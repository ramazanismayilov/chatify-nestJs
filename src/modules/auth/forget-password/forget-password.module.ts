import { Module } from "@nestjs/common";
import { ForgetPasswordService } from "./forget-password.service";
import { ForgetPasswordController } from "./forget-password.controller";
import { AuthUtils } from "../auth.utils";

@Module({
    imports: [],
    controllers: [ForgetPasswordController],
    providers: [ForgetPasswordService, AuthUtils]
})
export class ForgetPasswordModule{}