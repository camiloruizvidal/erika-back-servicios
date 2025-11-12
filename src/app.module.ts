import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/persistence/database/database.module';
import { PaquetesModule } from './presentation/paquetes.module';

@Module({
  imports: [DatabaseModule, PaquetesModule],
})
export class AppModule {}
