import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const rawHost = process.env.DB_HOST || 'localhost';
  const normalizedHost = rawHost.replace(/\\\\/g, '\\');
  const database = process.env.DB_DATABASE || 'HealthcareInventoryDB';
  const encrypt = process.env.DB_ENCRYPT === 'true';
  const trustServerCertificate = process.env.DB_TRUST_CERT === 'true';

  return {
    type: 'mssql' as const,
    driver: require('mssql/msnodesqlv8'),
    host: normalizedHost,
    port: parseInt(process.env.DB_PORT ?? '1433', 10),
    database,
    extra: {
      connectionString:
        'Driver={ODBC Driver 18 for SQL Server};' +
        `Server=${normalizedHost};` +
        `Database=${database};` +
        'Trusted_Connection=Yes;' +
        `Encrypt=${encrypt ? 'Yes' : 'No'};` +
        `TrustServerCertificate=${trustServerCertificate ? 'Yes' : 'No'};` +
        'Persist Security Info=False;' +
        'Pooling=False;' +
        'MultipleActiveResultSets=False;' +
        'Command Timeout=2147483647;',
    },
    options: {
      trustedConnection: true,
      encrypt,
      trustServerCertificate,
    },
    autoLoadEntities: true,
    synchronize: false, // Never auto-sync — we use SQL scripts
    logging: process.env.NODE_ENV === 'development',
  };
});
