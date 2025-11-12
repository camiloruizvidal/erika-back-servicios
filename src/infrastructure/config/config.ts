import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

export class Config {
  static get ambiente(): string | undefined {
    return process.env.AMBIENTE;
  }

  static readonly puerto = Number(process.env.PORT ?? 3000);
  static readonly dbHost = process.env.DB_HOST;
  static readonly dbPuerto = Number(process.env.DB_PORT);
  static readonly dbUsuario = process.env.DB_USER;
  static readonly dbContrasena = process.env.DB_PASSWORD;
  static readonly dbBaseDatos = process.env.DB_NAME;
  static readonly dbDialect = process.env.DB_DIALECT as Dialect;
  static readonly dbLogging = process.env.DB_LOGGING === 'true';
  static readonly jwtKey = process.env.JWT_KEY;
}
