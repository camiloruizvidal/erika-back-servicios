import { PaqueteModel } from '../models/paquete.model';
import { ICrearPaquete } from '../../../domain/interfaces/paquetes.interface';
import { Transformador } from 'src/utils/transformador.util';
import { IPaquete } from '../interfaces/paquete.interface';

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
}
