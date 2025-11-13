import { HttpStatus, Injectable } from '@nestjs/common';
import { IServiciosService } from '../ports/servicios.port';
import {
  ICrearServicio,
  IServicioCreado,
} from '../../domain/interfaces/servicios.interface';
import { ServicioRepository } from '../../infrastructure/persistence/repositories/servicio.repository';
import { PaqueteRepository } from '../../infrastructure/persistence/repositories/paquete.repository';
import { PaqueteServicioRepository } from '../../infrastructure/persistence/repositories/paquete-servicio.repository';
import { ErrorPersonalizado } from '../../utils/error-personalizado/error-personalizado';
import { Constantes } from '../../utils/constantes';
import { IServicio } from '../../infrastructure/persistence/interfaces/servicio.interface';

@Injectable()
export class ServiciosService implements IServiciosService {
  public async crearServicio(
    payload: ICrearServicio,
  ): Promise<IServicioCreado> {
    const nombreNormalizado = payload.nombre.trim();

    const servicioExistente = await ServicioRepository.buscarPorNombre(
      nombreNormalizado,
      payload.tenantId,
    );

    if (servicioExistente) {
      throw new ErrorPersonalizado(
        HttpStatus.CONFLICT,
        Constantes.SERVICIO_YA_EXISTE,
      );
    }

    let paqueteRelacionado: number | null = null;
    if (payload.paqueteId) {
      const paquete = await PaqueteRepository.buscarPorId(
        payload.paqueteId,
        payload.tenantId,
      );

      if (!paquete) {
        throw new ErrorPersonalizado(
          HttpStatus.NOT_FOUND,
          Constantes.PAQUETE_NO_ENCONTRADO,
        );
      }

      paqueteRelacionado = paquete.id;
    }

    const servicioCreado = await ServicioRepository.crearServicio({
      tenantId: payload.tenantId,
      nombre: nombreNormalizado,
      valor: payload.valor,
    });

    const servicioResultado: IServicioCreado = {
      id: servicioCreado.id,
      nombre: servicioCreado.nombre,
      valor: Number(servicioCreado.valor),
    };

    if (paqueteRelacionado) {
      await PaqueteServicioRepository.registrarServiciosEnPaquete([
        {
          paqueteId: paqueteRelacionado,
          servicioId: servicioCreado.id,
          tenantId: payload.tenantId,
        },
      ]);
      servicioResultado['paqueteId'] = paqueteRelacionado;
    }

    return servicioResultado;
  }
}
