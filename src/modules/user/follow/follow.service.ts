import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UserService } from "../user.service";
import { RemoveFollowerDto, ToggleFollowRequestDto, UpdateFollowStatusDto } from "./dto/follow.dto";
import { ClsService } from "nestjs-cls";
import { FollowEntity } from "src/database/entities/Follow.entity";
import { UserEntity } from "src/database/entities/User.entity";
import { FollowStatus, UpdateFollowStatusEnum } from "src/shared/enums/follow.enum";
import { ProfileEntity } from "src/database/entities/Profile.entity";

@Injectable()
export class FollowService {
    private followRepo: Repository<FollowEntity>
    private profileRepo: Repository<ProfileEntity>
    constructor(
        private cls: ClsService,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.followRepo = this.dataSource.getRepository(FollowEntity)
        this.profileRepo = this.dataSource.getRepository(ProfileEntity)
    }

    async userAccessible(from: number, to: number) {
        if (from === to) return true;
        let user = await this.userService.getUser(to);
        if (!user?.isPrivate) return true;
        return this.followRepo.exists({
            where: { fromId: from, toId: to, status: FollowStatus.ACCEPTED },
        });
    }

    async getUserFollowers(id: number) {
        let user = this.cls.get<UserEntity>('user');

        let currentUser = user.id === id ? user : await this.userService.getUser(id);
        if (!currentUser) throw new NotFoundException('User is not found');

        if (user.id !== currentUser.id && currentUser.isPrivate) {
            let checkFollow = await this.followRepo.exists({
                where: {
                    fromId: user.id,
                    toId: currentUser.id,
                    status: FollowStatus.ACCEPTED,
                },
            });

            if (!checkFollow) throw new ForbiddenException("You're not allowed to look at this user's follower list");
        }

        return this.followRepo.find({
            where: {
                toId: currentUser.id,
                status: FollowStatus.ACCEPTED,
            },
            select: {
                id: true,
                from: {
                    id: true,
                    username: true,
                    profile: {
                        id: true,
                        fullName: true,
                        image: {
                            id: true,
                            url: true,
                        },
                    },
                },
            },
            relations: ['from', 'from.profile', 'from.profile.image'],
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async getUserFollowings(id: number) {
        let user = this.cls.get<UserEntity>('user');

        let currentUser =
            user.id === id ? user : await this.userService.getUser(id);

        if (!currentUser) throw new NotFoundException('User is not found');

        if (user.id !== currentUser.id && currentUser.isPrivate) {
            let checkFollow = await this.followRepo.exists({
                where: {
                    fromId: user.id,
                    toId: currentUser.id,
                    status: FollowStatus.ACCEPTED,
                },
            });

            if (!checkFollow)
                throw new ForbiddenException(
                    "You're not allowed to look at this user's follower list",
                );
        }

        return this.followRepo.find({
            where: {
                fromId: currentUser.id,
                status: FollowStatus.ACCEPTED,
            },
            select: {
                id: true,
                to: {
                    id: true,
                    username: true,
                    profile: {
                        id: true,
                        fullName: true,
                        image: {
                            id: true,
                            url: true,
                        },
                    },
                },
            },
            relations: ['to', 'to.profile', 'to.profile.image'],
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async pendingRequests(userId?: number) {
        let user = this.cls.get<UserEntity>('user');
        return this.followRepo.find({
            where: { toId: userId || user.id, status: FollowStatus.PENDING },
            select: {
                id: true,
                from: {
                    id: true,
                    username: true,
                    profile: {
                        id: true,
                        fullName: true,
                        bio: true,
                        image: {
                            id: true,
                            url: true,
                        },
                    },
                },
            },
            relations: ['from', 'from.profile', 'from.profile.image'],
            order: { createdAt: 'DESC' },
        });
    }

    async toggleFollowRequest(params: ToggleFollowRequestDto) {
        let user = this.cls.get<UserEntity>('user')

        let toUser = await this.userService.getUser(params.to)
        if (!toUser) throw new NotFoundException('User is not found');

        if (toUser.id === user.id) throw new BadRequestException('You cannot follow yourself');

        let followRequest = await this.followRepo.findOne({
            where: { fromId: user.id, toId: params.to }
        })

        let followIncrement = 1
        let isNew = false

        if (followRequest) {
            this.followRepo.delete({ id: followRequest.id })
            followIncrement = -1
        } else {
            followRequest = this.followRepo.create({
                fromId: user.id,
                toId: params.to,
                status: toUser.isPrivate ? FollowStatus.PENDING : FollowStatus.ACCEPTED
            })
            await this.followRepo.save(followRequest)
            isNew = true
        }

        if (followRequest.status === FollowStatus.PENDING) {
            followIncrement = 0;
        }

        await this.updateFollowCounts(user.id, toUser.id, followIncrement);

        return {
            message: isNew ? 'Follow request has been sent' : "You've unfollowed",
        };
    }

    async updateFollowStatus(params: UpdateFollowStatusDto) {
        let user = this.cls.get('user')

        let fromUser = await this.userService.getUser(params.from)
        if (!fromUser) throw new NotFoundException("User is not found")

        let followRequest = await this.followRepo.findOne({
            where: { fromId: fromUser.id, toId: user.id },
        });

        if (!followRequest) throw new NotFoundException('Such follow request is not found');

        if (followRequest.status != FollowStatus.PENDING) throw new BadRequestException('This follow request is already accepted');

        if (params.status === UpdateFollowStatusEnum.REJECT) {
            await this.followRepo.delete({ id: followRequest.id })
            return {
                message: 'Follow request is rejected',
            };
        } else {
            await this.followRepo.update(
                { id: followRequest.id },
                { status: FollowStatus.ACCEPTED }
            );
            await this.updateFollowCounts(fromUser.id, user.id, 1);

            return {
                message: 'Follow request is accepted',
            };
        }

    }

    async removeFollower(params: RemoveFollowerDto) {
        let user = this.cls.get<UserEntity>('user');

        let followRequest = await this.followRepo.findOne({
            where: {
                fromId: params.followerId,
                toId: user.id,
                status: FollowStatus.ACCEPTED,
            }
        });
        if (!followRequest) throw new NotFoundException('Follow request is not found');

        await this.followRepo.delete({ id: followRequest.id });
        await this.updateFollowCounts(followRequest.fromId, followRequest.toId, -1);

        return {
            message: `You've successfully get away from ${followRequest.fromId}`,
        };
    }

    private updateFollowCounts(from: number, to: number, increment: number) {
        let promises: any = [];
        promises.push(this.userService.incrementCount(from, 'following', increment));
        promises.push(this.userService.incrementCount(to, 'follower', increment));
        return Promise.all(promises);
    }

    async acceptPendingRequests() {
        let pendingRequests = await this.pendingRequests();

        let promises = pendingRequests.map((followRequest) =>
            this.updateFollowStatus({
                from: followRequest.fromId,
                status: UpdateFollowStatusEnum.ACCEPT,
            }),
        );
        return await Promise.all(promises);
    }
}