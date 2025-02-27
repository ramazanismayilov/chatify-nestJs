import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FollowService } from './follow/follow.service';

@Controller('users')
@Auth()
export class UserController {
  constructor(
    private userService: UserService,
    private followService: FollowService
  ) { }

  @Get('profile')
  getMyProfile() {
    return this.userService.getPublicProfile();
  }

  @Get('profile/:id')
  getUserProfile(@Param('id') id: number) {
    return this.userService.getPublicProfile(id)
  }

  @Get(':id/followers')
  getUserFollowers(@Param('id') id: number) {
    return this.followService.getUserFollowers(id);
  }

  @Get(':id/followings')
  getUserFollowings(@Param('id') id: number) {
    return this.followService.getUserFollowings(id);
  }

  @Post('profile')
  updateUserProfile(@Body() body: UpdateProfileDto) {
    return this.userService.updateProfile(body)
  }
}