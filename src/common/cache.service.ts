import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

interface MemEntry { value: string; expiresAt: number }

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private redis?: Redis;
  private mem = new Map<string, MemEntry>();

  constructor() {
    const url = process.env.REDIS_URL || process.env.REDIS_HOST;
    if (url) {
      try {
        this.redis = new Redis(url);
      } catch (err) {
        this.logger.warn('Failed to initialize Redis client, falling back to memory cache');
      }
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (this.redis) {
      const raw = await this.redis.get(key);
      return raw ? JSON.parse(raw) as T : null;
    }

    const entry = this.mem.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.mem.delete(key);
      return null;
    }
    return JSON.parse(entry.value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
    if (this.redis) {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return;
    }

    this.mem.set(key, { value: JSON.stringify(value), expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  async del(key: string): Promise<void> {
    if (this.redis) {
      await this.redis.del(key);
      return;
    }
    this.mem.delete(key);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}
