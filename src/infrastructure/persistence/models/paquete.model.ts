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
  tenantId!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(150) })
  nombre!: string;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(12, 2) })
  valor!: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'fecha_inicio' })
  fechaInicio!: Date;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'fecha_fin' })
  fechaFin!: Date | null;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  activo!: boolean;

  @BelongsToMany(() => ServicioModel, () => PaqueteServicioModel)
  servicios?: ServicioModel[];
}
