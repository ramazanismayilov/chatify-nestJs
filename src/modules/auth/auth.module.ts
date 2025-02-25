import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ForgetPasswordModule } from "./forget-password/forget-password.module";
import { AuthUtils } from "./auth.utils";

@Module({
    imports: [ForgetPasswordModule],
    controllers: [AuthController],
    providers: [AuthService, AuthUtils]
})
export class AuthModule { }