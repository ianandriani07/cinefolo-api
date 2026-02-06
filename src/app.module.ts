import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [PrismaModule, RatingsModule],
})
export class AppModule {}
