import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { PostEntity } from "src/database/entities/Post.entity";
import { DataSource, In, Repository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";
import { UserEntity } from "src/database/entities/User.entity";
import { MediaEntity } from "src/database/entities/Media.entity";
import { UserService } from "../user/user.service";
import { FollowService } from "../user/follow/follow.service";
import { UserPostsQueryDto } from "./dto/user-posts.dto";

@Injectable()
export class PostService {
    private postRepo: Repository<PostEntity>
    private mediaRepo: Repository<MediaEntity>
    constructor(
        private cls: ClsService,
        private userService: UserService,
        private followService: FollowService,
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.postRepo = this.dataSource.getRepository(PostEntity)
        this.mediaRepo = this.dataSource.getRepository(MediaEntity)
    }

    async findOne(id: number, relations: string[] = []) {
        return this.postRepo.findOne({ where: { id }, relations });
    }

    async create(params: CreatePostDto) {
        let user = this.cls.get<UserEntity>('user')
        const media = await this.mediaRepo.findBy({
            id: In(params.media)
        });

        let post = this.postRepo.create({
            ...params,
            media,
            userId: user.id
        })

        await post.save();
        await this.userService.incrementCount(user.id, 'postCount', 1)
        return post
    }

    async userPosts(userId: number, params: UserPostsQueryDto) {
        let user = this.cls.get<UserEntity>('user')

        let currentUser = userId === user.id ? user : await this.userService.getUser(userId);
        if (!currentUser) throw new NotFoundException('User is not found');

        let checkAccess = await this.followService.userAccessible(user.id, currentUser.id);
        if (!checkAccess) throw new ForbiddenException('Profile is private');

        let page = (params.page || 1) - 1;
        let limit = params.limit || 10;

        let [posts, total] = await this.postRepo.findAndCount({
            where: {
                userId,
            },
            relations: ['media'],
            order: {
                createdAt: 'DESC',
            },
            skip: page * limit,
            take: limit,
        });

        return {
            posts,
            total,
        };
    }

    async increment(postId: number, column: 'view' | 'like' | 'commentCount', value: number = 0) {
        return this.postRepo.increment({ id: postId }, column, value);
    }
}