import { Op } from 'sequelize';
import { ServicioModel } from '../models/servicio.model';
import { Transformador } from 'src/utils/transformador.util';
import { IServicio } from '../interfaces/servicio.interface';
import { PaqueteModel } from '../models/paquete.model';
import { IResultadoFindAndCount } from '../../../shared/interfaces/sequelize-find.interface';

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
    return Transformador.extraerDataValues(servicio) as IServicio;
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
    return Transformador.extraerDataValues(servicios) as IServicio[];
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
    return Transformador.extraerDataValues(servicios) as IServicio[];
  }

  static async crearServicio(registro: {
    tenantId: number;
    nombre: string;
    valor: number;
  }): Promise<IServicio> {
    const servicio = await ServicioModel.create(registro);
    return Transformador.extraerDataValues(servicio) as IServicio;
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
    return Transformador.extraerDataValues(servicios) as IServicio[];
  }

  static async buscarPorId(
    tenantId: number,
    servicioId: number,
  ): Promise<IServicio | null> {
    const servicio = await ServicioModel.findOne({
      where: {
        tenantId,
        id: servicioId,
      },
      include: [
        {
          model: PaqueteModel,
          attributes: ['id', 'nombre', 'activo', 'fechaInicio', 'fechaFin'],
          through: { attributes: [] },
        },
      ],
    });

    return Transformador.extraerDataValues(servicio) as IServicio | null;
  }

  static async listarTodos(
    tenantId: number,
    offset: number,
    limit: number,
    nombre?: string,
    paqueteId?: number,
  ): Promise<IResultadoFindAndCount<IServicio>> {
    const whereClause: any = {
      tenantId,
    };

    if (nombre && nombre.trim().length > 0) {
      whereClause.nombre = { [Op.iLike]: `%${nombre.trim()}%` };
    }

    const includeOptions: any = {
      model: PaqueteModel,
      attributes: ['id', 'nombre', 'activo', 'fechaInicio', 'fechaFin'],
      through: { attributes: [] },
      required: false,
    };

    if (paqueteId) {
      includeOptions.where = { id: paqueteId };
      includeOptions.required = true;
    }

    const resultado = await ServicioModel.findAndCountAll({
      where: whereClause,
      include: [includeOptions],
      distinct: true,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });
    return Transformador.extraerDataValues(
      resultado,
    ) as IResultadoFindAndCount<IServicio>;
  }

  static async listarSinPaquete(
    tenantId: number,
    offset: number,
    limit: number,
  ): Promise<IResultadoFindAndCount<IServicio>> {
    const resultado = await ServicioModel.findAndCountAll({
      where: {
        tenantId,
        '$paquetes.id$': null,
      },
      include: [
        {
          model: PaqueteModel,
          attributes: [],
          through: { attributes: [] },
          required: false,
        },
      ],
      distinct: true,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });
    return Transformador.extraerDataValues(
      resultado,
    ) as IResultadoFindAndCount<IServicio>;
  }

  static async listarConPaquetes(
    tenantId: number,
    paqueteId: number,
    offset: number,
    limit: number,
  ): Promise<IResultadoFindAndCount<IServicio>> {
    const resultado = await ServicioModel.findAndCountAll({
      where: {
        tenantId,
      },
      include: [
        {
          model: PaqueteModel,
          attributes: [],
          through: { attributes: [] },
          where: {
            id: paqueteId,
          },
          required: true,
        },
      ],
      distinct: true,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });
    return Transformador.extraerDataValues(
      resultado,
    ) as IResultadoFindAndCount<IServicio>;
  }
}
