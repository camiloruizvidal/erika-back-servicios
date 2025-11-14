import {
  ICrearPaquete,
  IPaqueteCreado,
} from '../../domain/interfaces/paquetes.interface';
import { IPaginado } from '../../shared/interfaces/paginado.interface';
import { IPaquete } from '../../infrastructure/persistence/interfaces/paquete.interface';

export interface IPaquetesService {
  crearPaquete(payload: ICrearPaquete): Promise<IPaqueteCreado>;
  listarPaquetes(
    tenantId: number,
    pagina: number,
    tamanoPagina: number,
    nombre?: string,
    activo?: boolean,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<IPaginado<IPaquete>>;
  actualizarServiciosPaquete(
    tenantId: number,
    paqueteId: number,
    servicioIds: number[],
  ): Promise<IPaqueteCreado>;
  obtenerDetallePaquete(
    tenantId: number,
    paqueteId: number,
  ): Promise<IPaqueteCreado>;
}
