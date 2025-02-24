import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserEntity } from "src/database/entities/User.entity";
import { DataSource, Repository } from "typeorm";
import { CreateForgetPasswordDto } from "./dto/create-forget-password.dto,";
import { UserActivationEntity } from "src/database/entities/UserActivation.entity";

@Injectable()
export class ForgetPasswordService {
    private userRepo: Repository<UserEntity>
    private activationRepo: Repository<UserActivationEntity>

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.userRepo = this.dataSource.getRepository(UserEntity)
        this.activationRepo = this.dataSource.getRepository(UserActivationEntity)
    }

    async createForgetPasswordRequest(params: CreateForgetPasswordDto) {
        let user = this.userRepo.findOne({ where: params })
        if (!user) throw new NotFoundException('User is not found');
    }
}