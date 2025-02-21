import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserEntity } from "src/database/entities/User.entity";
import { DataSource, FindOptionsWhere, In, Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    private userRepo: Repository<UserEntity>

    constructor(
        @InjectDataSource() private dataSource: DataSource,
        private jwt: JwtService,
    ) {
        this.userRepo = this.dataSource.getRepository(UserEntity)
    }

    async register(params: RegisterDto) {
        if (!params.phone && !params.email) throw new BadRequestException('Email or phone number needs to be filled');

        let username = params.username.toLowerCase();
        let email = params.email?.toLocaleLowerCase();
        let phone = params.phone;
        let where: FindOptionsWhere<UserEntity>[] = [{ username }]
        if (email) where.push({ email })
        if (phone) where.push({ phone })

        let userExists = await this.userRepo.findOne({
            where
        })
        if (userExists) {
            if (userExists.username === username) {
                throw new ConflictException({
                    message: 'Username is already exists',
                    suggestions: await this.usernameSuggestions(username),
                });
            } else if (userExists.email === email) {
                throw new ConflictException({ message: 'Email is already exists' });
            } else {
                throw new ConflictException({ message: 'Phone is already exists' });
            }
        }

        let user = this.userRepo.create({
            username,
            email,
            phone,
            password: params.password,
            profile: {
                fullName: params.fullName,
            },
        });
        await user.save();

        let token = this.generateToken(user.id);
        return { message: "Signup is successfully", user, token };
    }

    async usernameSuggestions(username: string) {
        let usernames = Array.from({ length: 8 }).map(() => `${username}${Math.floor(Math.random() * 8999) + 1000}`);
        let dbUsernames = await this.userRepo.find({
            where: {
                username: In(usernames),
            },
            select: {
                id: true,
                username: true,
            },
        });
        let existUsernames = dbUsernames.map((user) => user.username);
        usernames = usernames.filter(username => !existUsernames.includes(username));
        return usernames.slice(0, 2);
    }

    generateToken(userId: number) {
        return this.jwt.sign({ userId });
    }
}