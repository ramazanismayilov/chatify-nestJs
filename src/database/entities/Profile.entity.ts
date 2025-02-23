import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ImageEntity } from "./Image.entity";
import { UserEntity } from "./User.entity";

@Entity('profiles')
export class ProfileEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ default: 0 })
    follower: number;

    @Column({ default: 0 })
    following: number;

    @Column({ default: 0 })
    postCount: number;

    @Column({ nullable: true })
    imageId: string;

    @Column()
    userId: number;

    @OneToOne(() => ImageEntity)
    @JoinColumn({
        name: 'imageId',
        referencedColumnName: 'id',
    })
    image: ImageEntity;

    @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id',
    })
    user: UserEntity;
}