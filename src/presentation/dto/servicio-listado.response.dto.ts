import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

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
}