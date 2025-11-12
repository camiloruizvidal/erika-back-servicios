import {
  ICrearServicio,
  IServicioCreado,
} from '../../domain/interfaces/servicios.interface';

export interface IServiciosService {
  crearServicio(payload: ICrearServicio): Promise<IServicioCreado>;
}
