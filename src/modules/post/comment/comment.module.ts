import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { PostModule } from "../post.module";
import { CommentController } from "./comment.controller";
import { FollowModule } from "src/modules/user/follow/follow.module";

@Module({
    imports: [PostModule, FollowModule],
    controllers: [CommentController],
    providers: [CommentService]
})
export class CommentModule { }