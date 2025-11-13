import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ServicioListadoResponseDto,
  ServicioConPaquetesResponseDto,
} from './servicio-listado.response.dto';

export class MetaPaginadoResponseDto {
  @ApiProperty({ description: 'Total de registros encontrados', type: Number })
  @Expose({ name: 'total' })
  total!: number;

  @ApiProperty({
    description: 'Página solicitada (comienza en 1)',
    type: Number,
  })
  @Expose({ name: 'pagina' })
  pagina!: number;

  @ApiProperty({
    description: 'Cantidad de elementos en la página',
    type: Number,
  })
  @Expose({ name: 'tamanoPagina' })
  tamano_pagina!: number;
}

export class PaginadoResponseDto<T> {
  @ApiProperty({ type: () => MetaPaginadoResponseDto })
  @Expose({ name: 'meta' })
  @Type(() => MetaPaginadoResponseDto)
  meta!: MetaPaginadoResponseDto;

  @ApiProperty({ isArray: true, type: () => Object })
  @Expose({ name: 'data' })
  data!: T[];
}

export class ServiciosSinPaquetePaginadosResponseDto extends PaginadoResponseDto<ServicioListadoResponseDto> {
  @ApiProperty({ isArray: true, type: () => ServicioListadoResponseDto })
  @Expose({ name: 'data' })
  @Type(() => ServicioListadoResponseDto)
  declare data: ServicioListadoResponseDto[];
}

export class ServiciosConPaquetesPaginadosResponseDto extends PaginadoResponseDto<ServicioConPaquetesResponseDto> {
  @ApiProperty({
    isArray: true,
    type: () => ServicioConPaquetesResponseDto,
  })
  @Expose({ name: 'data' })
  @Type(() => ServicioConPaquetesResponseDto)
  declare data: ServicioConPaquetesResponseDto[];
}
