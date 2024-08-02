import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { CacheManager } from 'src/common/cache.manager';
import { StatusEnum } from 'src/common/enums';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class RequestHandlerMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly cacheManager: CacheManager,
        @InjectEntityManager() private readonly entityManager: EntityManager,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            let token = req.headers?.authorization?.replace('Bearer ', '');
            if (token) {
                let tokenUser = this.jwtService.decode(token);
                
            }
        } catch (error) {
            throw new Error(error.message)
        }
        next();
    }
}
