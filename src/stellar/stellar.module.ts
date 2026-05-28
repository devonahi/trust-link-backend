import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { STELLAR_SERVER } from './stellar.tokens';
import { EventReplayService } from './event-replay.service';
import { WebhooksModule } from '../webhooks/webhooks.module';

@Module({
  imports: [WebhooksModule],
  providers: [
    ContractService,
    EventReplayService,
    { provide: STELLAR_SERVER, useValue: undefined },
  ],
  exports: [ContractService],
})
export class StellarModule {}
