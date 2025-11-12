import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Config } from '../../config/config';
import { PaqueteModel } from '../models/paquete.model';
import { ServicioModel } from '../models/servicio.model';
import { PaqueteServicioModel } from '../models/paquete-servicio.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: Config.dbDialect,
      host: Config.dbHost,
      port: Config.dbPuerto,
      username: Config.dbUsuario,
      password: Config.dbContrasena,
      database: Config.dbBaseDatos,
      models: [PaqueteModel, ServicioModel, PaqueteServicioModel],
      logging: Config.dbLogging,
      define: {
        underscored: true,
      },
    }),
  ],
})
export class DatabaseModule {}
