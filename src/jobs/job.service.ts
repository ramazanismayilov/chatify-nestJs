import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectDataSource } from "@nestjs/typeorm";
import { LoginAttempts } from "src/database/entities/LoginAttempts.entity";
import { DataSource, LessThan, Repository } from "typeorm";
import { addHours } from 'date-fns';

@Injectable()
export class JobService {
    private loginAttemptRepo: Repository<LoginAttempts>;

    constructor(@InjectDataSource() private dataSource: DataSource) {
        this.loginAttemptRepo = this.dataSource.getRepository(LoginAttempts);
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async clearLoginAttempts() {
        await this.loginAttemptRepo.delete({
            createdAt: LessThan(addHours(new Date(), -1)),
        });
    }
}