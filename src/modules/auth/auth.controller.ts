import { Body, Controller, Post, Res } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { LoginDto } from "./dto/login.dto";
import { Auth } from "src/shared/decorators/auth.decorator";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto, @Res() res: Response) {
        let result = await this.authService.login(body);
        res.cookie('authorization', result.token);
        res.json(result);
    }

    @Post('register')
    register(@Body() body: RegisterDto) {
        return this.authService.register(body)
    }

    @Post('reset-password')
    @Auth()
    resetPassword(@Body() body: ResetPasswordDto) {
        return this.authService.resetPassword(body);
    }
}