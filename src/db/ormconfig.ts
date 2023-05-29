import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

dotenv.config({
  path: path.join(
    process.cwd(),
    'env',
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : process.env.NODE_ENV === 'staging'
      ? '.staging.env'
      : '.development.env',
  ),
});

export const ormConfig = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: Boolean(process.env.DB_SYNCHRONIZE),
  migrations: ['dist/migration/*{.ts,.js}'],
  timezone: 'Z',
});

export default ormConfig;
