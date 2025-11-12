import {
  ICrearPaquete,
  IPaqueteCreado,
} from '../../domain/interfaces/paquetes.interface';

export interface IPaquetesService {
  crearPaquete(payload: ICrearPaquete): Promise<IPaqueteCreado>;
}
