import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ServicioAsociadoResponseDto {
  @ApiProperty({
    description: 'Identificador único del servicio asociado',
    type: Number,
    example: 5,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Nombre del servicio incluido dentro del paquete',
    type: String,
    example: 'Capacitación mensual',
  })
  @Expose()
  nombre!: string;

  @ApiProperty({
    description: 'Valor unitario del servicio',
    type: Number,
    example: 45000,
  })
  @Transform(({ value }) =>
    value !== null && value !== undefined ? Number(value) : null,
  )
  @Expose()
  valor!: number | null;
}

