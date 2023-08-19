import { Global, Module } from '@nestjs/common';
import { Allow } from 'class-validator';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports:[PrismaService]
})
export class PrismaModule {}
