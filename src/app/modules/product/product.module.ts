import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
  imports: [
    TypeOrmModule.forFeature([Product]),
    MulterModule.register({ dest: './upload' }),
  ],
})
export class ProductModule {}
