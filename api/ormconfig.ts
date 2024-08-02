import * as dotenv from 'dotenv';
dotenv.config();

export const ormconfig = {
  type: 'mssql',
  host: process.env.MSSQL_HOST,
  username: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  database: process.env.MSSQL_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
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