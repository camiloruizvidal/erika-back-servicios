import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/persistence/database/database.module';
import { PaquetesModule } from './presentation/paquetes.module';
import { ServiciosModule } from './presentation/servicios.module';

@Module({
  imports: [DatabaseModule, PaquetesModule, ServiciosModule],
})
export class AppModule {}
