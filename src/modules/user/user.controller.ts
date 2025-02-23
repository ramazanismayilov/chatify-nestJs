import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('profile')
  @Auth()
  getMyProfile() {
    return this.userService.getPublicProfile();
  }

  @Post('profile')
  @Auth()
  updateMyProfile(@Body() body: UpdateProfileDto) {
    return this.userService.updateProfile(body)
  }

  @Get('profile/:id')
  getProfile(@Param('id') id: number) {
    return this.userService.getPublicProfile(id)
  }
}