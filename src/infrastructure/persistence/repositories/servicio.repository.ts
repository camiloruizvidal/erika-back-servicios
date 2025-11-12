import { Op, Transaction } from 'sequelize';
import { ServicioModel } from '../models/servicio.model';

export class ServicioRepository {
  static async buscarPorNombre(
    nombre: string,
    tenantId: number,
    transaction?: Transaction,
  ): Promise<ServicioModel | null> {
    return ServicioModel.findOne({
      where: {
        nombre,
        tenantId,
      },
      transaction,
    });
  }

  static async buscarPorNombres(
    tenantId: number,
    nombres: string[],
  ): Promise<ServicioModel[]> {
    if (nombres.length === 0) {
      return [];
    }

    return ServicioModel.findAll({
      where: {
        tenantId,
        nombre: {
          [Op.in]: nombres,
        },
      },
    });
  }

  static async crearServicios(
    registros: Array<{ tenantId: number; nombre: string; valor: number }>,
  ): Promise<ServicioModel[]> {
    if (registros.length === 0) {
      return [];
    }

    return ServicioModel.bulkCreate(registros, {
      returning: true,
    });
  }
}
