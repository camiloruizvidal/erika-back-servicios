import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { PaginadoRequestDto } from './paginado.request.dto';
import { TransformadoresDto } from '../utils/transformadores-dto.helper';

export class PaginadoPaquetesRequestDto extends PaginadoRequestDto {
  @ApiPropertyOptional({
    description: 'Filtro para buscar por nombre del paquete',
    type: String,
    example: 'Paquete Empresarial',
  })
  @IsOptional()
  @IsString({ message: 'nombre debe ser una cadena de texto' })
  @Expose({ name: 'nombre' })
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Filtro para buscar por estado activo/inactivo',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarBooleano(value))
  @IsBoolean({ message: 'activo debe ser un valor booleano' })
  @Expose({ name: 'activo' })
  activo?: boolean;

  @ApiPropertyOptional({
    description: 'Filtro para buscar por fecha de inicio (formato YYYY-MM-DD)',
    type: String,
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'fecha_inicio debe ser una fecha válida en formato YYYY-MM-DD' },
  )
  @Expose({ name: 'fecha_inicio' })
  fechaInicio?: string;

  @ApiPropertyOptional({
    description: 'Filtro para buscar por fecha de fin (formato YYYY-MM-DD)',
    type: String,
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'fecha_fin debe ser una fecha válida en formato YYYY-MM-DD' },
  )
  @Expose({ name: 'fecha_fin' })
  fechaFin?: string;
}
