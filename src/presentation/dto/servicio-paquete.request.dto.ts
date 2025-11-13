import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsString, Min, MinLength } from 'class-validator';
import { Constantes } from '../../utils/constantes';
import { TransformadoresDto } from '../utils/transformadores-dto.helper';

export class ServicioPaqueteRequestDto {
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('nombre_servicio') })
  @MinLength(2)
  @Expose({ name: 'nombre_servicio' })
  nombreServicio!: string;

  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsNumber(
    {},
    { message: Constantes.PROPIEDAD_NO_PERMITIDA('valor_servicio') },
  )
  @Min(0)
  @Expose({ name: 'valor_servicio' })
  valorServicio!: number;
}

