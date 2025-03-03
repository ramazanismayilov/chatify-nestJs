import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { mediaFileFilter } from './media.filter';
import { UPLOAD_MEDIA_MAX_SIZE } from 'src/shared/constants/media.constant';
import { UploadMediaDto } from './dto/media.dto';

@Controller('media')
@Auth()
export class MediaController {
    constructor(private mediaService: MediaService) { }

    @Post()
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: memoryStorage(),
            fileFilter: mediaFileFilter,
            limits: {
                fileSize: UPLOAD_MEDIA_MAX_SIZE,
            },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadMediaDto })
    uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
        return this.mediaService.uploadFiles(files);
    }
}