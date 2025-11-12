import { CrearServicioDto } from '../../presentation/dto/crear-servicio.dto';
import { ICrearServicio } from '../../domain/interfaces/servicios.interface';

export class ServiciosMapper {
  static toInterface(
    dto: CrearServicioDto,
    tenantId: number,
  ): ICrearServicio {
    return {
      tenantId,
      nombre: dto.nombre.trim(),
      valor: dto.valor,
      paqueteId: dto.paqueteId ?? null,
    };
  }
}

