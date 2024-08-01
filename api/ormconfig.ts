import * as dotenv from 'dotenv';
dotenv.config();

export const ormconfig = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  "extra": {
    // "ssl": "true",
    trustServerCertificate: true,
  },
  // ssl: {
  //   rejectUnauthorized: false
  // },
  autoLoadEntities: true,
  synchronize: false,
  migrations: ['src/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration',
  },
};