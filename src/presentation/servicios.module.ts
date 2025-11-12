import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ServiciosController } from './controllers/servicios.controller';
import { ServiciosService } from '../application/services/servicios.service';
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
  controllers: [ServiciosController],
  providers: [ServiciosService, ManejadorError, JwtTenantGuard],
})
export class ServiciosModule {}

