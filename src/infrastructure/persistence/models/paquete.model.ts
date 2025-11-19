import {
  Table,
  Column,
  DataType,
  Model,
  AllowNull,
  Default,
  BelongsToMany,
} from 'sequelize-typescript';
import { ServicioModel } from './servicio.model';
import { PaqueteServicioModel } from './paquete-servicio.model';
import { EFrecuenciaTipo } from '../../../domain/enums/frecuencia-tipo.enum';

@Table({
  tableName: 'paquetes',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class PaqueteModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'tenant_id' })
  declare tenantId: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(150) })
  declare nombre: string;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(12, 2) })
  declare valor: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'fecha_inicio' })
  declare fechaInicio: Date;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'fecha_fin' })
  declare fechaFin: Date | null;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  declare activo: boolean;

  @AllowNull(false)
  @Default(EFrecuenciaTipo.MENSUAL)
  @Column({ type: DataType.STRING(20), field: 'frecuencia_tipo' })
  declare frecuenciaTipo: EFrecuenciaTipo;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER, field: 'frecuencia_valor' })
  declare frecuenciaValor: number | null;

  @BelongsToMany(() => ServicioModel, () => PaqueteServicioModel)
  servicios?: ServicioModel[];
}
