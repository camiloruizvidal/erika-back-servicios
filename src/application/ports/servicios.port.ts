import {
  ICrearServicio,
  IServicioCreado,
} from '../../domain/interfaces/servicios.interface';
import {
  IServicioConPaquetesListado,
  IServicioSinPaqueteListado,
} from '../../domain/interfaces/listados-servicios.interface';
import { IPaginado } from '../../shared/interfaces/paginado.interface';

export interface IServiciosService {
  crearServicio(payload: ICrearServicio): Promise<IServicioCreado>;
  listarServicios(
    tenantId: number,
    pagina: number,
    tamanoPagina: number,
    nombre?: string,
  ): Promise<IPaginado<IServicioConPaquetesListado>>;
  listarServiciosDePaquetes(
    tenantId: number,
    paqueteId: number,
    pagina: number,
    tamanoPagina: number,
  ): Promise<IPaginado<IServicioSinPaqueteListado>>;
  obtenerDetalleServicio(
    tenantId: number,
    servicioId: number,
  ): Promise<IServicioConPaquetesListado>;
}
