import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const rawHost = process.env.DB_HOST || 'localhost';
  const normalizedHost = rawHost.replace(/\\\\/g, '\\');
  const [host, instanceFromHost] = normalizedHost.includes('\\')
    ? normalizedHost.split('\\', 2)
    : [normalizedHost, undefined];

  return {
    type: 'mssql' as const,
    driver: require('mssql/msnodesqlv8'),
    host,
    port: parseInt(process.env.DB_PORT ?? '1433', 10),
    database: process.env.DB_DATABASE || 'HealthcareInventoryDB',
    extra: {
      driver: 'ODBC Driver 18 for SQL Server',
    },
    options: {
      trustedConnection: true,
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
      instanceName: process.env.DB_INSTANCE || instanceFromHost || undefined,
    },
    autoLoadEntities: true,
    synchronize: false, // Never auto-sync — we use SQL scripts
    logging: process.env.NODE_ENV === 'development',
  };
});
