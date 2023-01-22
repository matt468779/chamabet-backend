import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entities/user.entity';
import { ProductModule } from './modules/product/product.module';
import { Product } from './modules/product/entities/product.entity';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BranchModule } from './modules/branch/branch.module';
import { Branch } from './modules/branch/entities/branch.entity';
import { Stock } from './modules/stock/entities/stock.entity';
import { StockModule } from './modules/stock/stock.module';
import { Assignment } from './modules/assignment/entities/assignment.entity';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmailModule } from './modules/email/email.module';
import { Sale } from './modules/sale/entities/sale.entity';
import { SaleModule } from './modules/sale/sale.module';
import { SizeQuantity } from './modules/stock/entities/sizeQuantity.entity';
import { NotifyMe } from './modules/notification/entities/notifyme.entity';
import { NotificationModule } from './modules/notification/notification.module';
import { Notify } from './modules/notification/entities/notify.entity';
import { Deprecate } from './modules/deprecate/entities/deprecate.entity';
import { DeprecateModule } from './modules/deprecate/deprecate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    BranchModule,
    ProductModule,
    StockModule,
    AssignmentModule,
    EmailModule,
    SaleModule,
    NotificationModule,
    DeprecateModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload/products'),
      serveRoot: '/upload/products',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASENAME'),
        entities: [
          User,
          Branch,
          Product,
          Stock,
          Assignment,
          Sale,
          SizeQuantity,
          Notify,
          NotifyMe,
          Deprecate,
        ],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
