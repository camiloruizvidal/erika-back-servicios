import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';

export class PaqueteListadoResponseDto {
  @ApiProperty({
    description: 'Identificador único del paquete',
    type: Number,
    example: 1,
  })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'id' })
  id!: number;

  @ApiProperty({
    description: 'Nombre descriptivo del paquete',
    type: String,
    example: 'Paquete Empresarial',
  })
  @Expose({ name: 'nombre' })
  nombre!: string;

  @ApiProperty({
    description: 'Valor total del paquete',
    type: Number,
    example: 250000,
  })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'valor' })
  valor!: number;

  @ApiProperty({
    description: 'Fecha desde la cual el paquete está disponible',
    type: String,
    format: 'date',
    example: '2025-01-01',
  })
  @Transform(({ value }) => {
    if (!value) return null;
    return moment.utc(value).format('YYYY-MM-DD');
  })
  @Expose({ name: 'fecha_inicio' })
  fecha_inicio!: string;

  @ApiProperty({
    description:
      'Fecha en la que el paquete deja de estar vigente o null si permanece activo indefinidamente',
    type: String,
    format: 'date',
    required: false,
    nullable: true,
    example: null,
  })
  @Transform(({ value }) => {
    if (!value) return null;
    return moment.utc(value).format('YYYY-MM-DD');
  })
  @Expose({ name: 'fecha_fin' })
  fecha_fin!: string | null;

  @ApiProperty({
    description: 'Indicador de estado activo del paquete',
    type: Boolean,
    example: true,
  })
  @Expose({ name: 'activo' })
  activo!: boolean;
}

