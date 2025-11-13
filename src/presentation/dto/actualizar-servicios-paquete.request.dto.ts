import {
  ArrayUnique,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Constantes } from '../../utils/constantes';

export class ActualizarServiciosPaqueteRequestDto {
  @ApiProperty({
    description:
      'Listado de identificadores de servicios que deben quedar asociados al paquete',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray({ message: Constantes.PROPIEDAD_NO_PERMITIDA('servicio_ids') })
  @ArrayUnique({
    message: Constantes.SERVICIO_DUPLICADO_EN_SOLICITUD,
  })
  @Type(() => Number)
  @IsInt({
    each: true,
    message: Constantes.PROPIEDAD_NO_PERMITIDA('servicio_ids'),
  })
  @Min(1, {
    each: true,
    message: Constantes.VALOR_MINIMO('servicio_ids', 1),
  })
  @Expose({ name: 'servicio_ids' })
  servicioIds!: number[];
}

