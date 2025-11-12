import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaquetesController } from './controllers/paquetes.controller';
import { PaquetesService } from '../application/services/paquetes.service';
import { ManejadorError } from '../utils/manejador-error/manejador-error';
import { JwtTenantGuard } from './guards/jwt-tenant.guard';
import { Config } from '../infrastructure/config/config';

@Module({
  imports: [
    JwtModule.register({
      secret: Config.jwtKey,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [PaquetesController],
  providers: [PaquetesService, ManejadorError, JwtTenantGuard],
})
export class PaquetesModule {}
