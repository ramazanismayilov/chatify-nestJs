import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ImageEntity } from "./Image.entity";
import { UserEntity } from "./User.entity";

@Entity('profiles')
export class ProfileEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column()
    bio: string;

    @Column({ default: 0 })
    follower: number;

    @Column({ default: 0 })
    following: number;

    @Column({ default: 0 })
    postCount: number;

    @Column()
    imageId: number;

    @Column()
    userId: number;

    @OneToOne(() => ImageEntity)
    @JoinColumn({
        name: 'imageId',
        referencedColumnName: 'id',
    })
    image: ImageEntity;

    @OneToOne(() => UserEntity, (user) => user.profile)
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id',
    })
    user: UserEntity;
}