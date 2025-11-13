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
import { IPaginado } from '../../shared/interfaces/paginado.interface';
import {
  IServicioSinPaqueteListado,
  IServicioConPaquetesListado,
} from '../../domain/interfaces/listados-servicios.interface';

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

  public async listarServicios(
    tenantId: number,
    pagina: number,
    tamanoPagina: number,
  ): Promise<IPaginado<IServicioConPaquetesListado>> {
    const offset = (pagina - 1) * tamanoPagina;

    const resultado = await ServicioRepository.listarTodos(
      tenantId,
      offset,
      tamanoPagina,
    );

    const totalPaginas =
      tamanoPagina > 0 ? Math.ceil(Number(resultado.count) / tamanoPagina) : 0;

    return {
      meta: {
        total: Number(resultado.count),
        pagina,
        tamanoPagina,
        totalPaginas,
      },
      data: resultado.rows as IServicioConPaquetesListado[],
    };
  }

  public async listarServiciosDePaquetes(
    tenantId: number,
    paqueteId: number,
    pagina: number,
    tamanoPagina: number,
  ): Promise<IPaginado<IServicioSinPaqueteListado>> {
    const offset = (pagina - 1) * tamanoPagina;

    const paquete = await PaqueteRepository.buscarPorId(paqueteId, tenantId);

    if (!paquete) {
      throw new ErrorPersonalizado(
        HttpStatus.NOT_FOUND,
        Constantes.PAQUETE_NO_ENCONTRADO,
      );
    }

    const resultado = await ServicioRepository.listarConPaquetes(
      tenantId,
      paqueteId,
      offset,
      tamanoPagina,
    );

    const totalPaginas =
      tamanoPagina > 0 ? Math.ceil(Number(resultado.count) / tamanoPagina) : 0;

    return {
      meta: {
        total: Number(resultado.count),
        pagina,
        tamanoPagina,
        totalPaginas,
      },
      data: resultado.rows as IServicioSinPaqueteListado[],
    };
  }

  public async obtenerDetalleServicio(
    tenantId: number,
    servicioId: number,
  ): Promise<IServicioConPaquetesListado> {
    const servicio = await ServicioRepository.buscarPorId(tenantId, servicioId);

    if (!servicio) {
      throw new ErrorPersonalizado(
        HttpStatus.NOT_FOUND,
        Constantes.SERVICIOS_NO_ENCONTRADOS,
      );
    }

    const servicioDetallado: IServicioConPaquetesListado = {
      id: servicio.id,
      nombre: servicio.nombre,
      valor: Number(servicio.valor),
      paquetes:
        servicio.paquetes?.map((paquete) => ({
          id: paquete.id,
          nombre: paquete.nombre,
        })) ?? [],
    };

    return servicioDetallado;
  }
}
