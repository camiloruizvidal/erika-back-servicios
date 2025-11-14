import { PaqueteModel } from '../models/paquete.model';
import { ICrearPaquete } from '../../../domain/interfaces/paquetes.interface';
import { Transformador } from 'src/utils/transformador.util';
import { IPaquete } from '../interfaces/paquete.interface';
import { IResultadoFindAndCount } from '../../../shared/interfaces/sequelize-find.interface';
import { Op } from 'sequelize';
import * as moment from 'moment';

export class PaqueteRepository {
  static async buscarPorNombre(
    nombre: string,
    tenantId: number,
  ): Promise<IPaquete | null> {
    const paquete = await PaqueteModel.findOne({
      where: {
        nombre,
        tenantId,
      },
    });
    return Transformador.extraerDataValues(paquete);
  }

  static async crearPaquete(datos: ICrearPaquete): Promise<IPaquete> {
    const paquete = await PaqueteModel.create({
      tenantId: datos.tenantId,
      nombre: datos.nombre,
      valor: datos.valor,
      fechaInicio: datos.fechaInicio,
      fechaFin: datos.fechaFin ?? null,
      activo: datos.activo,
    });
    return Transformador.extraerDataValues(paquete);
  }

  static async buscarPorId(
    paqueteId: number,
    tenantId: number,
  ): Promise<IPaquete | null> {
    const paquete = await PaqueteModel.findOne({
      where: {
        id: paqueteId,
        tenantId,
      },
    });
    return Transformador.extraerDataValues(paquete);
  }

  static async listarPorTenant(
    tenantId: number,
    offset: number,
    limit: number,
    nombre?: string,
    activo?: boolean,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<IResultadoFindAndCount<IPaquete>> {
    const whereClause: any = {
      tenantId,
    };

    if (nombre && nombre.trim().length > 0) {
      whereClause.nombre = { [Op.iLike]: `%${nombre.trim()}%` };
    }

    if (activo !== undefined && activo !== null) {
      whereClause.activo = activo;
    }

    if (fechaInicio) {
      const fechaInicioMoment = moment.utc(fechaInicio).startOf('day');
      whereClause.fechaInicio = {
        [Op.gte]: fechaInicioMoment.toDate(),
      };
    }

    if (fechaFin) {
      const fechaFinMoment = moment.utc(fechaFin).endOf('day');
      whereClause.fechaFin = {
        [Op.lte]: fechaFinMoment.toDate(),
      };
    }

    const resultado = await PaqueteModel.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    return Transformador.extraerDataValues(
      resultado,
    ) as IResultadoFindAndCount<IPaquete>;
  }
}
