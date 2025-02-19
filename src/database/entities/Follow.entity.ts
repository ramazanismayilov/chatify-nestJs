import { FollowStatus } from "src/shared/enums/follow.enum";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./User.entity";

@Entity('follows')
export class FollowEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'enum', enum: FollowStatus })
    status: FollowStatus;

    @Column()
    fromId: number;

    @Column()
    toId: number;

    @ManyToOne(() => UserEntity, (user) => user.following)
    from: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.follower)
    to: UserEntity;
}