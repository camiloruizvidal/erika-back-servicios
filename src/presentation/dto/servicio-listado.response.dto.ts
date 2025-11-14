import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import * as moment from 'moment';

export class ServicioListadoResponseDto {
  @ApiProperty({ description: 'Identificador del servicio', type: Number })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'id' })
  id!: number;

  @ApiProperty({ description: 'Nombre del servicio', type: String })
  @Expose({ name: 'nombre' })
  nombre!: string;

  @ApiProperty({ description: 'Valor del servicio', type: Number })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'valor' })
  valor!: number;
}

export class ServicioConPaquetesResponseDto {
  @ApiProperty({ description: 'Identificador del servicio', type: Number })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'id' })
  id!: number;

  @ApiProperty({ description: 'Nombre del servicio', type: String })
  @Expose({ name: 'nombre' })
  nombre!: string;

  @ApiProperty({ description: 'Valor del servicio', type: Number })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'valor' })
  valor!: number;

  @ApiProperty({
    description: 'Paquetes asociados al servicio',
    type: () => [ServicioConPaquetesItemResponseDto],
  })
  @Expose({ name: 'paquetes' })
  @Type(() => ServicioConPaquetesItemResponseDto)
  paquetes!: ServicioConPaquetesItemResponseDto[];
}

export class ServicioConPaquetesItemResponseDto {
  @ApiProperty({
    description: 'Identificador del paquete asociado',
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'id' })
  id!: number;

  @ApiProperty({ description: 'Nombre del paquete asociado', type: String })
  @Expose({ name: 'nombre' })
  nombre!: string;

  @ApiProperty({
    description: 'Indicador de estado activo del paquete',
    type: Boolean,
  })
  @Expose({ name: 'activo' })
  activo!: boolean;

  @ApiProperty({
    description: 'Fecha desde la cual el paquete está disponible',
    type: String,
    format: 'date',
  })
  @Transform(({ value }) => {
    if (!value) return null;
    return moment.utc(value).format('YYYY-MM-DD');
  })
  @Expose({ name: 'fechaInicio' })
  fecha_inicio!: string;

  @ApiProperty({
    description:
      'Fecha en la que el paquete deja de estar vigente o null si permanece activo indefinidamente',
    type: String,
    format: 'date',
    required: false,
    nullable: true,
  })
  @Transform(({ value }) => {
    if (!value) return null;
    return moment.utc(value).format('YYYY-MM-DD');
  })
  @Expose({ name: 'fechaFin' })
  fecha_fin!: string | null;
}
