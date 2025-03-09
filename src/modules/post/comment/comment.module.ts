import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { PostModule } from "../post.module";
import { CommentController } from "./comment.controller";

@Module({
    imports: [PostModule],
    controllers: [CommentController],
    providers: [CommentService]
})
export class CommentModule { }