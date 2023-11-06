import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PhotosService } from './photos.service';
import { Request, Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';

@Controller('photos')
@UseGuards(AuthGuard('jwt-access'))
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 6))
  async uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
    @Req() req: Request,
  ) {
    console.log(files);
    const base64Strings = files.map((file) => {
      const base64 = file.buffer.toString('base64');
      return `data:image/jpeg;base64,${base64}`;
    });
    console.log('req.user.id', req.user['userId'], typeof req.user['id']);
    console.log('req.user', req.user);
    await this.photosService.setUserPhotos(req.user['userId'], base64Strings);
    return res.send({ base64Strings });
  }

  @Get()
  async getUserPhotos(@Req() req: Request) {
    const photos = this.photosService.getUserPhotos(req.user['id']);
    return photos;
  }

  @Get('images/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: '../uploads' });
  }
}
