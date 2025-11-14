import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { PaginadoRequestDto } from './paginado.request.dto';

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
}

