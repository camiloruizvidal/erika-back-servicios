import { Transaction } from 'sequelize';
import { PaqueteServicioModel } from '../models/paquete-servicio.model';
import { ServicioModel } from '../models/servicio.model';
import { Transformador } from 'src/utils/transformador.util';
import { PaqueteModel } from '../models/paquete.model';
import { IPaqueteServicio } from '../interfaces/paquete-servicio.interface';

export class PaqueteServicioRepository {
  static async crearRelacion(
    paqueteId: number,
    servicioId: number,
    tenantId: number,
    transaction: Transaction,
  ): Promise<IPaqueteServicio> {
    const relacion = await PaqueteServicioModel.create(
      {
        paqueteId,
        servicioId,
        tenantId,
      },
      { transaction },
    );
    return Transformador.extraerDataValues(relacion);
  }

  static async registrarServiciosEnPaquete(
    registros: Array<{
      paqueteId: number;
      servicioId: number;
      tenantId: number;
    }>,
    transaction?: Transaction,
  ): Promise<void> {
    if (registros.length === 0) {
      return;
    }

    await PaqueteServicioModel.bulkCreate(registros, {
      ignoreDuplicates: true,
      transaction,
    });
  }

  static async obtenerServiciosAsociados(paqueteId: number): Promise<any> {
    const paquete = await PaqueteModel.findByPk(paqueteId, {
      include: [
        {
          model: ServicioModel,
          attributes: ['id', 'nombre', 'valor'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    return Transformador.extraerDataValues(paquete);
  }

  static async obtenerIdsServiciosPorPaquete(
    paqueteId: number,
    tenantId: number,
  ): Promise<number[]> {
    const relaciones = await PaqueteServicioModel.findAll({
      where: {
        paqueteId,
        tenantId,
      },
      attributes: ['servicioId'],
    });

    return relaciones.map((relacion) => relacion.servicioId);
  }

  static async eliminarServiciosDePaquete(
    paqueteId: number,
    tenantId: number,
    serviciosIds: number[],
    transaction?: Transaction,
  ): Promise<void> {
    if (serviciosIds.length === 0) {
      return;
    }

    await PaqueteServicioModel.destroy({
      where: {
        paqueteId,
        tenantId,
        servicioId: serviciosIds,
      },
      transaction,
    });
  }
}
