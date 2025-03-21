import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Auth } from "src/shared/decorators/auth.decorator";
import { GetCommentQueryDto } from "./dto/get-comment.dto";

@Controller('post/:postId/comment')
@Auth()
export class CommentController {
    constructor(private commentService: CommentService) { }

    @Get()
    list(@Param('postId') postId: number, @Query() query: GetCommentQueryDto) {
        return this.commentService.postComments(postId, query);
    }

    @Post()
    create(@Param('postId') postId: number, @Body() body: CreateCommentDto) {
        return this.commentService.create(postId, body);
    }
}