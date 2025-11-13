import { CrearPaqueteRequestDto } from '../../presentation/dto/crear-paquete.request.dto';
import {
  ICrearPaquete,
  IServicioPaqueteDetalle,
} from '../../domain/interfaces/paquetes.interface';

export class PaquetesMapper {
  static toInterface(
    dto: CrearPaqueteRequestDto,
    tenantId: number,
  ): ICrearPaquete {
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
    servicio: CrearPaqueteRequestDto['servicios'][number],
  ): IServicioPaqueteDetalle {
    return {
      nombre: servicio.nombreServicio.trim(),
      valor: servicio.valorServicio,
    };
  }
}
