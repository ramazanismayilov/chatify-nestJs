import { Body, Controller, Get, Post } from "@nestjs/common";
import { FollowService } from "./follow.service";
import { RemoveFollowerDto, ToggleFollowRequestDto, UpdateFollowStatusDto } from "./dto/follow.dto";
import { Auth } from "src/shared/decorators/auth.decorator";

@Controller('follows')
@Auth()
export class FollowController {
    constructor(private followService: FollowService) { }

    @Get('pending-requests')
    pendingRequests() {
        return this.followService.pendingRequests();
    }

    @Post('toggle')
    toggleFollowRequest(@Body() body: ToggleFollowRequestDto) {
        return this.followService.toggleFollowRequest(body);
    }

    @Post('status')
    updateFollowStatus(@Body() body: UpdateFollowStatusDto) {
        return this.followService.updateFollowStatus(body);
    }

    @Post('remove-followers')
    removeFollower(@Body() body: RemoveFollowerDto) {
        return this.followService.removeFollower(body);
    }
}