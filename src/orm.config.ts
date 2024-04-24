import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  url: 'postgres://yordice77:fLG7tnh0Ofcq5hmK5CzdZXFKYfFISgtK@dpg-cokgr9f79t8c73cad7pg-a.oregon-postgres.render.com/diagramador_app',
  synchronize: true,
  entities: ['dist/**/*.entity.{ts,js}'],
  autoLoadEntities: true,
  ssl: {
    rejectUnauthorized: false,
  },
};
