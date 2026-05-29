import { Global, Module } from '@nestjs/common';
import { wrapPrismaWithTracing } from '../tracing/prisma-tracing.wrapper';
import { TracingService } from '../tracing/tracing.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: (tracing: TracingService) => {
        const prisma = new PrismaService();
        return tracing.isEnabled()
          ? wrapPrismaWithTracing(prisma, tracing)
          : prisma;
      },
      inject: [TracingService],
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
