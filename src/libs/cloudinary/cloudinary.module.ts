import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({
  imports: [],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}