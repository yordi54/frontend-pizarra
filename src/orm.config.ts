import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  url: 'postgres://software1:Aspirine1234@software1-sistema.postgres.database.azure.com:5432/sistema-software1',
  synchronize: true,
  entities: ['dist/**/*.entity.{ts,js}'],
  autoLoadEntities: true,
  ssl: {
    rejectUnauthorized: false,
  },
};
