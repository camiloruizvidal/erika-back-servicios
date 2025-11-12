import { Transaction } from 'sequelize';
import { PaqueteServicioModel } from '../models/paquete-servicio.model';
import { ServicioModel } from '../models/servicio.model';
import { Transformador } from 'src/utils/transformador.util';
import { PaqueteModel } from '../models/paquete.model';

export class PaqueteServicioRepository {
  static async crearRelacion(
    paqueteId: number,
    servicioId: number,
    tenantId: number,
    transaction: Transaction,
  ): Promise<PaqueteServicioModel> {
    return PaqueteServicioModel.create(
      {
        paqueteId,
        servicioId,
        tenantId,
      },
      { transaction },
    );
  }

  static async registrarServiciosEnPaquete(
    registros: Array<{
      paqueteId: number;
      servicioId: number;
      tenantId: number;
    }>,
  ): Promise<void> {
    await PaqueteServicioModel.bulkCreate(registros, {
      ignoreDuplicates: true,
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
}
