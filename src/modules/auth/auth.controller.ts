import { Body, Controller, Post, Res } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { LoginDto, LoginWithFirebaseDto } from "./dto/login.dto";
import { Auth } from "src/shared/decorators/auth.decorator";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @Post('firebase')
    async loginWithFirebase(@Body() body: LoginWithFirebaseDto) {
        return this.authService.loginWithFirebase(body);
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