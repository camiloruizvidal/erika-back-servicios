import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { Constantes } from '../../utils/constantes';
import { ServicioPaqueteDto } from './servicio-paquete.dto';

type EntradaNumerica = string | number | null | undefined;
type EntradaBooleana = string | number | boolean | null | undefined;

const transformarNumero = (valor: EntradaNumerica): number | undefined => {
  if (valor === undefined || valor === null || valor === '') {
    return undefined;
  }
  return typeof valor === 'number' ? valor : Number(valor);
};

const transformarBooleano = (valor: EntradaBooleana): boolean | undefined => {
  if (valor === undefined || valor === null || valor === '') {
    return undefined;
  }
  if (typeof valor === 'boolean') {
    return valor;
  }
  if (typeof valor === 'number') {
    return valor === 1;
  }
  const normalizado = valor.toString().toLowerCase();
  return normalizado === 'true' || normalizado === '1';
};

const transformarFecha = (valor: unknown): Date | undefined => {
  if (!valor) {
    return undefined;
  }
  const fecha = new Date(valor as string | number | Date);
  return Number.isNaN(fecha.getTime()) ? undefined : fecha;
};

export class CrearPaqueteDto {
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('nombre') })
  @MinLength(2)
  @Expose({ name: 'nombre' })
  nombre!: string;

  @Transform(({ value }) => transformarNumero(value))
  @IsNumber({}, { message: Constantes.PROPIEDAD_NO_PERMITIDA('valor') })
  @Min(0)
  @Expose({ name: 'valor' })
  valor!: number;

  @Transform(({ value }) => transformarFecha(value))
  @IsDate({ message: Constantes.PROPIEDAD_NO_PERMITIDA('fecha_inicio') })
  @Expose({ name: 'fecha_inicio' })
  fechaInicio!: Date;

  @IsOptional()
  @Transform(({ value }) => transformarFecha(value) ?? null)
  @IsDate({ message: Constantes.PROPIEDAD_NO_PERMITIDA('fecha_fin') })
  @Expose({ name: 'fecha_fin' })
  fechaFin?: Date | null;

  @IsOptional()
  @Transform(({ value }) => transformarBooleano(value))
  @IsBoolean({ message: Constantes.PROPIEDAD_NO_PERMITIDA('activo') })
  @Expose({ name: 'activo' })
  activo?: boolean;

  @IsArray({ message: Constantes.PROPIEDAD_NO_PERMITIDA('servicios') })
  @ArrayMinSize(1, { message: Constantes.SERVICIOS_REQUERIDOS })
  @ValidateNested({ each: true })
  @Type(() => ServicioPaqueteDto)
  @Expose({ name: 'servicios' })
  servicios!: ServicioPaqueteDto[];
}
