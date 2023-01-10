import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RoleGuard } from '../role/role.guard';
import { Role } from '../role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { join } from 'path';
import { ApiTags } from '@nestjs/swagger';
import { CollectionQuery } from '@chamabet/query';
import { QueryConstructor } from '@chamabet/query';
import path = require('path');
import mime = require('mime-types');
import { v4 as uuid } from 'uuid';
import { existsSync, mkdirSync } from 'fs';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create-product')
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
          // const uploadPath = process.env.UPLOAD_LOCATION;
          const uploadPath = './upload/products';
          // Create folder if doesnt exist
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
          // Calling the callback passing the random name generated with
          // the original extension name

          cb(null, `${uuid()}.${mime.extension(file.mimetype)}`);
        },
      }),
    }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    try {
      createProductDto.image = `${image.filename}`;
      return this.productService.createProduct(createProductDto);
    } catch (error) {
      throw new BadRequestException('missing file');
    }
  }

  @Get('image/:path')
  getImage(@Param('path') path: string, @Res() res) {
    try {
      res.sendFile(path, { root: 'upload/products' });
    } catch {
      throw new BadRequestException("File doesn't exist");
    }
  }

  @Get('get-products')
  @UseGuards(RoleGuard(Role.Admin))
  findAll(@Query() query: CollectionQuery) {
    return this.productService.getQuery(query);
  }

  @Get('get-product/:id')
  @UseGuards(RoleGuard(Role.Admin))
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Patch('update-product/:id')
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
          // const uploadPath = process.env.UPLOAD_LOCATION;
          const uploadPath = './upload/products';
          // Create folder if doesnt exist
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
          // Calling the callback passing the random name generated with
          // the original extension name

          cb(null, `${uuid()}.${mime.extension(file.mimetype)}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    if (image) {
      updateProductDto.image = image.filename;
    }
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete('delete-product/:id')
  @UseGuards(RoleGuard(Role.Admin))
  remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }

  @Post('query')
  getQuery(@Body() query: CollectionQuery) {
    return this.productService.getQuery(query);
  }
}
