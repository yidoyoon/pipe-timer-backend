import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as winston from 'winston';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as fs from 'fs';
import helmet from 'helmet';

let httpsOptions;
if (process.env.NODE_ENV === 'development') {
  httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, '../certs/127.0.0.1-key.pem')),
    cert: fs.readFileSync(
      path.resolve(__dirname, '../certs/127.0.0.1-cert.pem'),
    ),
  };
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'staging' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(process.env.NODE_ENV, {
              prettyPrint: true,
              colors: true,
            }),
          ),
        }),
      ],
    }),
    httpsOptions,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const corsOption = {
    origin: [
      'https://127.0.0.1:4000',
      'https://127.0.0.1',
      'https://localhost:4000',
      'https://localhost',
      'https://ec2-3-38-208-7.ap-northeast-2.compute.amazonaws.com',
      'https://pomo.yibyeongyong.com:4000',
      'https://pomo.yibyeongyong.com',
      'https://api.yibyeongyong.com:3000',
      'https://api.yibyeongyong.com',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.use(cookieParser());

  app.enableCors(corsOption);
  app.use(helmet());

  await app.listen(3000);
}

bootstrap();
