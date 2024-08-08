import * as dotenv from 'dotenv';
dotenv.config();

export const ormconfig = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  autoLoadEntities: true,
  synchronize: true,
  entities: ["src/**/*.entity.ts"], // set to true in dev
};