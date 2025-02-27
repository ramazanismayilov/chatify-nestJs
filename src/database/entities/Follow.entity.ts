import { FollowStatus } from "src/shared/enums/follow.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date
}