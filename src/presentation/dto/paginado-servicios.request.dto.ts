import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { PaginadoRequestDto } from './paginado.request.dto';
import { TransformadoresDto } from '../utils/transformadores-dto.helper';

export class PaginadoServiciosRequestDto extends PaginadoRequestDto {
  @ApiPropertyOptional({
    description: 'Filtro para buscar por nombre del servicio',
    type: String,
    example: 'Servicio Premium',
  })
  @IsOptional()
  @IsString({ message: 'nombre debe ser una cadena de texto' })
  @Expose({ name: 'nombre' })
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Filtro para buscar servicios por paquete',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsInt({ message: 'paquete_id debe ser un número entero' })
  @Min(1, { message: 'paquete_id debe ser mayor o igual a 1' })
  @Expose({ name: 'paquete_id' })
  paqueteId?: number;
}

