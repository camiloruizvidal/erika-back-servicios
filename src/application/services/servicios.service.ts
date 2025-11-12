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

    const paqueteIdSolicitado =
      payload.paqueteId !== undefined && payload.paqueteId !== null
        ? payload.paqueteId
        : null;

    let paqueteRelacionado: number | null = null;
    if (paqueteIdSolicitado !== null) {
      const paquete = await PaqueteRepository.buscarPorId(
        paqueteIdSolicitado,
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

    if (paqueteRelacionado !== null) {
      await PaqueteServicioRepository.registrarServiciosEnPaquete([
        {
          paqueteId: paqueteRelacionado,
          servicioId: servicioCreado.id,
          tenantId: payload.tenantId,
        },
      ]);
    }

    return {
      id: servicioCreado.id,
      nombre: servicioCreado.nombre,
      valor: Number(servicioCreado.valor),
      paqueteId: paqueteRelacionado,
    };
  }
}

