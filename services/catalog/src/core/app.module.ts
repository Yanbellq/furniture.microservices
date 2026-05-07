import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { CatalogModule } from '@/modules/catalog/catalog.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CatalogModule,
    RouterModule.register([
      {
        path: 'catalog',
        module: CatalogModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
