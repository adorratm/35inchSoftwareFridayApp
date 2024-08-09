import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from "helmet";
import { json, urlencoded } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(compression({
    level: 9,
    threshold: 0,
    filter: function (req, res) {
      if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
      }
      // fallback to standard filter function
      return compression.filter(req, res);
    }
  }))
  app.use(helmet())
  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:5000',
      'http://localhost:5001',
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  });
  await app.listen(5000);
}
bootstrap();
