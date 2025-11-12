import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Constantes } from '../../utils/constantes';

type EntradaNumerica = string | number | null | undefined;

const transformarTexto = (valor: unknown): string | undefined => {
  if (valor === undefined || valor === null) {
    return undefined;
  }
  if (typeof valor === 'string') {
    const texto = valor.trim();
    return texto.length === 0 ? undefined : texto;
  }
  return valor.toString();
};

const transformarNumero = (valor: EntradaNumerica): number | undefined => {
  if (valor === undefined || valor === null || valor === '') {
    return undefined;
  }
  const numero = typeof valor === 'number' ? valor : Number(valor);
  return Number.isNaN(numero) ? undefined : numero;
};

const transformarEntero = (valor: EntradaNumerica): number | undefined => {
  const numero = transformarNumero(valor);
  if (numero === undefined) {
    return undefined;
  }
  const entero = Number.parseInt(numero.toString(), 10);
  return Number.isNaN(entero) ? undefined : entero;
};

export class CrearServicioDto {
  @ApiProperty({
    description: 'Nombre del servicio a registrar',
    example: 'Soporte técnico premium',
  })
  @Transform(({ value }) => transformarTexto(value))
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('nombre') })
  @MinLength(2, { message: Constantes.LONGITUD_MINIMA('nombre', 2) })
  @Expose({ name: 'nombre' })
  nombre!: string;

  @ApiProperty({
    description: 'Valor del servicio',
    example: 95000,
    type: Number,
  })
  @Transform(({ value }) => transformarNumero(value))
  @IsNumber({}, { message: Constantes.PROPIEDAD_NO_PERMITIDA('valor') })
  @Min(0, { message: Constantes.VALOR_MINIMO('valor', 0) })
  @Expose({ name: 'valor' })
  valor!: number;

  @ApiProperty({
    description:
      'Identificador del paquete al que se asociará el servicio. Opcional.',
    required: false,
    nullable: true,
    type: Number,
    example: 3,
  })
  @IsOptional()
  @Transform(({ value }) => transformarEntero(value))
  @IsInt({ message: Constantes.PROPIEDAD_NO_PERMITIDA('paquete_id') })
  @Min(1, { message: Constantes.VALOR_MINIMO('paquete_id', 1) })
  @Expose({ name: 'paquete_id' })
  paqueteId?: number;
}

