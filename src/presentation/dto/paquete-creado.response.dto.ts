import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ServicioAsociadoResponseDto } from './servicio-asociado.response.dto';

export class PaqueteCreadoResponseDto {
  @ApiProperty({
    description: 'Identificador único generado para el paquete',
    type: Number,
    example: 1,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Nombre descriptivo del paquete',
    type: String,
    example: 'Paquete Empresarial',
  })
  @Expose()
  nombre!: string;

  @ApiProperty({
    description: 'Valor total del paquete',
    type: Number,
    example: 250000,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  valor!: number;

  @ApiProperty({
    description: 'Fecha desde la cual el paquete está disponible',
    type: String,
    format: 'date-time',
    example: '2025-11-23T00:00:00.000Z',
  })
  @Expose({ name: 'fechaInicio' })
  @Type(() => Date)
  fecha_inicio!: Date;

  @ApiProperty({
    description:
      'Fecha en la que el paquete deja de estar vigente o null si permanece activo indefinidamente',
    type: String,
    format: 'date-time',
    required: false,
    nullable: true,
    example: null,
  })
  @Expose({ name: 'fechaFin' })
  @Type(() => Date)
  fecha_fin!: Date | null;

  @ApiProperty({
    description: 'Indicador de estado activo del paquete',
    type: Boolean,
    example: true,
  })
  @Expose()
  activo!: boolean;

  @ApiProperty({
    description: 'Servicios incluidos dentro del paquete',
    type: () => [ServicioAsociadoResponseDto],
  })
  @Expose()
  @Type(() => ServicioAsociadoResponseDto)
  servicios!: ServicioAsociadoResponseDto[];
}

