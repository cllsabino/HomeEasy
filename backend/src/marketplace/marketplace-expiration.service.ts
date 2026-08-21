import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';

import { MarketplaceService } from './marketplace.service';

const expirationIntervalMilliseconds = 60 * 1000;

@Injectable()
export class MarketplaceExpirationService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(MarketplaceExpirationService.name);
  private interval: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly marketplaceService: MarketplaceService) {}

  onApplicationBootstrap() {
    void this.expireRecords();
    this.interval = setInterval(() => void this.expireRecords(), expirationIntervalMilliseconds);
    this.interval.unref();
  }

  onApplicationShutdown() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private async expireRecords() {
    try {
      await this.marketplaceService.expireOpenRecords();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Falha ao consolidar expirações: ${message}`);
    }
  }
}
