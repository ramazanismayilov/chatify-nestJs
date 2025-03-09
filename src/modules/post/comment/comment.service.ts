import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { PostCommentEntity } from "src/database/entities/PostComment.entity";
import { DataSource, Repository } from "typeorm";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { ClsService } from "nestjs-cls";
import { UserEntity } from "src/database/entities/User.entity";
import { PostService } from "../post.service";

@Injectable()
export class CommentService {
    private commentRepo: Repository<PostCommentEntity>
    constructor(
        private cls: ClsService,
        private postService: PostService,
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.commentRepo = this.dataSource.getRepository(PostCommentEntity)
    }

    async create(postId: number, params: CreateCommentDto) {
        let user = this.cls.get<UserEntity>('user')

        let post = await this.postService.findOne(postId);
        if (!post) throw new NotFoundException('Post is not found');
    }
}