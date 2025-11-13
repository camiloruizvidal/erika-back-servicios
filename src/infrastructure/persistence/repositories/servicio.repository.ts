import { Op } from 'sequelize';
import { ServicioModel } from '../models/servicio.model';
import { Transformador } from 'src/utils/transformador.util';
import { IServicio } from '../interfaces/servicio.interface';

export class ServicioRepository {
  static async buscarPorNombre(
    nombre: string,
    tenantId: number,
  ): Promise<IServicio | null> {
    const servicio = await ServicioModel.findOne({
      where: {
        nombre,
        tenantId,
      },
    });
    return Transformador.extraerDataValues(servicio);
  }

  static async buscarPorNombres(
    tenantId: number,
    nombres: string[],
  ): Promise<IServicio[]> {
    if (nombres.length === 0) {
      return [];
    }

    const servicios = await ServicioModel.findAll({
      where: {
        tenantId,
        nombre: {
          [Op.in]: nombres,
        },
      },
    });
    return Transformador.extraerDataValues(servicios);
  }

  static async crearServicios(
    registros: Array<{ tenantId: number; nombre: string; valor: number }>,
  ): Promise<IServicio[]> {
    if (registros.length === 0) {
      return [];
    }

    const servicios = await ServicioModel.bulkCreate(registros, {
      returning: true,
    });
    return Transformador.extraerDataValues(servicios);
  }

  static async crearServicio(registro: {
    tenantId: number;
    nombre: string;
    valor: number;
  }): Promise<IServicio> {
    const servicio = await ServicioModel.create(registro);
    return Transformador.extraerDataValues(servicio);
  }

  static async buscarPorIds(
    tenantId: number,
    ids: number[],
  ): Promise<IServicio[]> {
    if (ids.length === 0) {
      return [];
    }

    const servicios = await ServicioModel.findAll({
      where: {
        tenantId,
        id: {
          [Op.in]: ids,
        },
      },
    });
    return Transformador.extraerDataValues(servicios);
  }
}
