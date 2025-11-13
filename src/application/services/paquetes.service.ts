import { HttpStatus, Injectable } from '@nestjs/common';
import { IPaquetesService } from '../ports/paquetes.port';
import {
  ICrearPaquete,
  IPaqueteCreado,
  IServicioPaqueteDetalle,
} from '../../domain/interfaces/paquetes.interface';
import { PaqueteRepository } from '../../infrastructure/persistence/repositories/paquete.repository';
import { ServicioRepository } from '../../infrastructure/persistence/repositories/servicio.repository';
import { PaqueteServicioRepository } from '../../infrastructure/persistence/repositories/paquete-servicio.repository';
import { ErrorPersonalizado } from '../../utils/error-personalizado/error-personalizado';
import { Constantes } from '../../utils/constantes';
import * as moment from 'moment';
import { IServicio } from '../../infrastructure/persistence/interfaces/servicio.interface';

@Injectable()
export class PaquetesService implements IPaquetesService {
  public async crearPaquete(payload: ICrearPaquete): Promise<IPaqueteCreado> {
    this.validarServicios(payload.servicios);
    this.validarFechas(payload.fechaInicio, payload.fechaFin ?? null);

    const paqueteExistente = await PaqueteRepository.buscarPorNombre(
      payload.nombre,
      payload.tenantId,
    );

    if (paqueteExistente) {
      throw new ErrorPersonalizado(
        HttpStatus.CONFLICT,
        Constantes.PAQUETE_YA_EXISTE,
      );
    }

    const paqueteCreado = await PaqueteRepository.crearPaquete(payload);

    const serviciosNormalizados = payload.servicios.map((servicio) => ({
      nombre: (servicio.nombre ?? '').trim(),
      valor: servicio.valor,
    }));

    const nombresSolicitados = serviciosNormalizados.map(
      (servicio) => servicio.nombre,
    );
    const serviciosExistentes = await ServicioRepository.buscarPorNombres(
      payload.tenantId,
      nombresSolicitados,
    );

    const nombresExistentes = new Set(
      serviciosExistentes.map((servicio) =>
        (servicio.nombre ?? '').trim().toLowerCase(),
      ),
    );

    const serviciosParaCrear = serviciosNormalizados.filter(
      (servicio) => !nombresExistentes.has(servicio.nombre.toLowerCase()),
    );

    let serviciosNuevos: IServicio[] = [];
    if (serviciosParaCrear.length > 0) {
      const registrosServicios = serviciosParaCrear.map((servicio) => ({
        tenantId: payload.tenantId,
        nombre: servicio.nombre,
        valor: servicio.valor,
      }));

      serviciosNuevos =
        await ServicioRepository.crearServicios(registrosServicios);
    }

    const todosLosServicios = [...serviciosExistentes, ...serviciosNuevos];

    await PaqueteServicioRepository.registrarServiciosEnPaquete(
      todosLosServicios.map((servicio) => ({
        paqueteId: paqueteCreado.id,
        servicioId: servicio.id,
        tenantId: payload.tenantId,
      })),
    );

    const paqueteConServicios =
      (await PaqueteServicioRepository.obtenerServiciosAsociados(
        paqueteCreado.id,
      )) as IPaqueteCreado;

    return paqueteConServicios;
  }

  public async obtenerDetallePaquete(
    tenantId: number,
    paqueteId: number,
  ): Promise<IPaqueteCreado> {
    const paquete = await PaqueteRepository.buscarPorId(paqueteId, tenantId);

    if (!paquete) {
      throw new ErrorPersonalizado(
        HttpStatus.NOT_FOUND,
        Constantes.PAQUETE_NO_ENCONTRADO,
      );
    }

    const paqueteConServicios =
      (await PaqueteServicioRepository.obtenerServiciosAsociados(
        paquete.id,
      )) as IPaqueteCreado;

    return paqueteConServicios;
  }

  public async actualizarServiciosPaquete(
    tenantId: number,
    paqueteId: number,
    servicioIds: number[],
  ): Promise<IPaqueteCreado> {
    const paquete = await PaqueteRepository.buscarPorId(paqueteId, tenantId);

    if (!paquete) {
      throw new ErrorPersonalizado(
        HttpStatus.NOT_FOUND,
        Constantes.PAQUETE_NO_ENCONTRADO,
      );
    }

    const idsUnicos = Array.from(new Set(servicioIds));

    if (idsUnicos.length !== servicioIds.length) {
      throw new ErrorPersonalizado(
        HttpStatus.BAD_REQUEST,
        Constantes.SERVICIO_DUPLICADO_EN_SOLICITUD,
      );
    }

    if (idsUnicos.length > 0) {
      const servicios = await ServicioRepository.buscarPorIds(
        tenantId,
        idsUnicos,
      );

      if (servicios.length !== idsUnicos.length) {
        throw new ErrorPersonalizado(
          HttpStatus.BAD_REQUEST,
          Constantes.SERVICIOS_NO_ENCONTRADOS,
        );
      }
    }

    const serviciosActuales =
      await PaqueteServicioRepository.obtenerIdsServiciosPorPaquete(
        paqueteId,
        tenantId,
      );

    const setActuales = new Set(serviciosActuales);
    const setNuevos = new Set(idsUnicos);

    const serviciosAgregar = idsUnicos.filter(
      (id) => !setActuales.has(id),
    );
    const serviciosEliminar = serviciosActuales.filter(
      (id) => !setNuevos.has(id),
    );

    if (serviciosEliminar.length > 0) {
      await PaqueteServicioRepository.eliminarServiciosDePaquete(
        paqueteId,
        tenantId,
        serviciosEliminar,
      );
    }

    if (serviciosAgregar.length > 0) {
      const registros = serviciosAgregar.map((servicioId) => ({
        paqueteId,
        servicioId,
        tenantId,
      }));

      await PaqueteServicioRepository.registrarServiciosEnPaquete(registros);
    }

    const paqueteActualizado =
      (await PaqueteServicioRepository.obtenerServiciosAsociados(
        paqueteId,
      )) as IPaqueteCreado;

    return paqueteActualizado;
  }

  private validarServicios(servicios: IServicioPaqueteDetalle[]): void {
    if (!servicios || servicios.length === 0) {
      throw new ErrorPersonalizado(
        HttpStatus.BAD_REQUEST,
        Constantes.SERVICIOS_REQUERIDOS,
      );
    }

    const nombres = new Set<string>();
    for (const servicio of servicios) {
      const nombreNormalizado = servicio.nombre.trim().toLowerCase();
      if (nombres.has(nombreNormalizado)) {
        throw new ErrorPersonalizado(
          HttpStatus.BAD_REQUEST,
          Constantes.SERVICIO_DUPLICADO_EN_SOLICITUD,
        );
      }
      nombres.add(nombreNormalizado);
    }
  }

  private validarFechas(fechaInicio: Date, fechaFin: Date | null): void {
    if (fechaFin && fechaFin < fechaInicio) {
      throw new ErrorPersonalizado(
        HttpStatus.BAD_REQUEST,
        Constantes.FECHA_FIN_ANTERIOR,
      );
    }
  }

  private estandarizarFecha(fecha: Date | string): Date {
    return moment.utc(fecha).startOf('day').toDate();
  }

  private estandarizarFechaNullable(fecha: Date | string | null): Date | null {
    if (!fecha) {
      return null;
    }
    return this.estandarizarFecha(fecha);
  }
}
