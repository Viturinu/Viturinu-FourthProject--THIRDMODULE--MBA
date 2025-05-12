import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Module({ //junta tudo, como se fosse um bundler
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
