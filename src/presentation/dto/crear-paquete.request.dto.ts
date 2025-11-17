import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { Constantes } from '../../utils/constantes';
import { ServicioPaqueteRequestDto } from './servicio-paquete.request.dto';
import { TransformadoresDto } from '../utils/transformadores-dto.helper';
import { EFrecuenciaTipo } from '../../domain/enums/frecuencia-tipo.enum';

export class CrearPaqueteRequestDto {
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('nombre') })
  @MinLength(2)
  @Expose({ name: 'nombre' })
  nombre!: string;

  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsNumber({}, { message: Constantes.PROPIEDAD_NO_PERMITIDA('valor') })
  @Min(0)
  @Expose({ name: 'valor' })
  valor!: number;

  @Transform(({ value }) => TransformadoresDto.transformarFecha(value))
  @IsDate({ message: Constantes.PROPIEDAD_NO_PERMITIDA('fecha_inicio') })
  @Expose({ name: 'fecha_inicio' })
  fechaInicio!: Date;

  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarFecha(value) ?? null)
  @IsDate({ message: Constantes.PROPIEDAD_NO_PERMITIDA('fecha_fin') })
  @Expose({ name: 'fecha_fin' })
  fechaFin?: Date | null;

  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarBooleano(value))
  @IsBoolean({ message: Constantes.PROPIEDAD_NO_PERMITIDA('activo') })
  @Expose({ name: 'activo' })
  activo?: boolean;

  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('frecuencia_tipo') })
  @IsIn(Object.values(EFrecuenciaTipo), {
    message: 'El tipo de frecuencia no es válido',
  })
  @Expose({ name: 'frecuencia_tipo' })
  frecuenciaTipo!: string;

  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsInt({ message: Constantes.PROPIEDAD_NO_PERMITIDA('frecuencia_valor') })
  @Min(1, { message: Constantes.VALOR_MINIMO('frecuencia_valor', 1) })
  @Expose({ name: 'frecuencia_valor' })
  frecuenciaValor?: number | null;

  @IsArray({ message: Constantes.PROPIEDAD_NO_PERMITIDA('servicios') })
  @ArrayMinSize(1, { message: Constantes.SERVICIOS_REQUERIDOS })
  @ValidateNested({ each: true })
  @Type(() => ServicioPaqueteRequestDto)
  @Expose({ name: 'servicios' })
  servicios!: ServicioPaqueteRequestDto[];
}

