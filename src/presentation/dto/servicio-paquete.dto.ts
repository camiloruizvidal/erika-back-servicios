import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsString, Min, MinLength } from 'class-validator';
import { Constantes } from '../../utils/constantes';

type EntradaNumerica = string | number | null | undefined;

const transformarNumero = (valor: EntradaNumerica): number | undefined => {
  if (valor === undefined || valor === null || valor === '') {
    return undefined;
  }
  return typeof valor === 'number' ? valor : Number(valor);
};

export class ServicioPaqueteDto {
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('nombre_servicio') })
  @MinLength(2)
  @Expose({ name: 'nombre_servicio' })
  nombreServicio!: string;

  @Transform(({ value }) => transformarNumero(value))
  @IsNumber(
    {},
    { message: Constantes.PROPIEDAD_NO_PERMITIDA('valor_servicio') },
  )
  @Min(0)
  @Expose({ name: 'valor_servicio' })
  valorServicio!: number;
}
