
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class CacheManager {
    constructor(
        @Inject((forwardRef(() => CACHE_MANAGER))) private cacheManager: Cache
    ) { }
    async get(key: string) {
        return await this.cacheManager.get(key)
    }
    async set(key: string, value: any, ttl = 1000 * 60 * 30) {
        await this.cacheManager.set(key, value, ttl)
        return true
    }
    async delete(key: string) {
        await this.cacheManager.del(key)
        return true
    }
    async reset() {
        await this.cacheManager.reset()
        return true
    }
}