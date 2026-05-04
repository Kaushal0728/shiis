import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mssql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '1433', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'HealthcareInventoryDB',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    instanceName: process.env.DB_INSTANCE || undefined,
  },
  autoLoadEntities: true,
  synchronize: false, // Never auto-sync — we use SQL scripts
  logging: process.env.NODE_ENV === 'development',
}));
