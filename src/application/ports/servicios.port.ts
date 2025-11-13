import {
  ICrearServicio,
  IServicioCreado,
} from '../../domain/interfaces/servicios.interface';
import {
  IServicioSinPaqueteListado,
  IServicioConPaquetesListado,
} from '../../domain/interfaces/listados-servicios.interface';
import { IPaginado } from '../../shared/interfaces/paginado.interface';

export interface IServiciosService {
  crearServicio(payload: ICrearServicio): Promise<IServicioCreado>;
  listarServiciosSinPaquete(
    tenantId: number,
    pagina: number,
    tamanoPagina: number,
  ): Promise<IPaginado<IServicioSinPaqueteListado>>;
  listarServiciosDePaquetes(
    tenantId: number,
    pagina: number,
    tamanoPagina: number,
  ): Promise<IPaginado<IServicioConPaquetesListado>>;
}
