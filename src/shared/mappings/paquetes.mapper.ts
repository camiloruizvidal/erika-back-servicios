import { CrearPaqueteDto } from '../../presentation/dto/crear-paquete.dto';
import {
  ICrearPaquete,
  IServicioPaqueteDetalle,
} from '../../domain/interfaces/paquetes.interface';

export class PaquetesMapper {
  static toInterface(dto: CrearPaqueteDto, tenantId: number): ICrearPaquete {
    return {
      tenantId,
      nombre: dto.nombre.trim(),
      valor: dto.valor,
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin ?? null,
      activo: dto.activo ?? true,
      servicios: dto.servicios.map((servicio) => this.mapearServicio(servicio)),
    };
  }

  private static mapearServicio(
    servicio: CrearPaqueteDto['servicios'][number],
  ): IServicioPaqueteDetalle {
    return {
      nombre: servicio.nombreServicio.trim(),
      valor: servicio.valorServicio,
    };
  }
}
