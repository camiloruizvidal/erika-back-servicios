import { Transaction } from 'sequelize';
import { PaqueteModel } from '../models/paquete.model';
import { ICrearPaquete } from '../../../domain/interfaces/paquetes.interface';

export class PaqueteRepository {
  static async buscarPorNombre(
    nombre: string,
    tenantId: number,
  ): Promise<PaqueteModel | null> {
    return PaqueteModel.findOne({
      where: {
        nombre,
        tenantId,
      },
    });
  }

  static async crearPaquete(datos: ICrearPaquete): Promise<PaqueteModel> {
    return PaqueteModel.create({
      tenantId: datos.tenantId,
      nombre: datos.nombre,
      valor: datos.valor,
      fechaInicio: datos.fechaInicio,
      fechaFin: datos.fechaFin ?? null,
      activo: datos.activo,
    });
  }
}
