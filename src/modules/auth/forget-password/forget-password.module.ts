import { Module } from "@nestjs/common";
import { ForgetPasswordService } from "./forget-password.service";

@Module({
    imports: [],
    controllers: [],
    providers: [ForgetPasswordService]
})
export class ForgetPasswordModule{}