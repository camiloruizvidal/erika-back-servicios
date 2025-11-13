import { CrearServicioRequestDto } from '../../presentation/dto/crear-servicio.request.dto';
import { ICrearServicio } from '../../domain/interfaces/servicios.interface';

export class ServiciosMapper {
  static toInterface(
    dto: CrearServicioRequestDto,
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

