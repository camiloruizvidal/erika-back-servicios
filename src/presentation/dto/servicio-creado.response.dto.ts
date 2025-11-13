import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ServicioCreadoResponseDto {
  @ApiProperty({
    description: 'Identificador generado para el servicio',
    type: Number,
    example: 14,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Nombre del servicio registrado',
    type: String,
    example: 'Soporte técnico premium',
  })
  @Expose()
  nombre: string;

  @ApiProperty({
    description: 'Valor del servicio en moneda local',
    type: Number,
    example: 95000,
  })
  @Expose({ name: 'valor' })
  valor: number;

  @ApiProperty({
    description:
      'Identificador del paquete asociado o null si el servicio no está vinculado a uno',
    type: Number,
    nullable: true,
    example: null,
  })
  @Expose({ name: 'paqueteId' })
  paquete_id: number;
}
