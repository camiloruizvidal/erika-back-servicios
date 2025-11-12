import {
  Table,
  Column,
  DataType,
  Model,
  AllowNull,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ServicioModel } from './servicio.model';
import { PaqueteModel } from './paquete.model';

@Table({
  tableName: 'paquete_servicios',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class PaqueteServicioModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => PaqueteModel)
  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'paquete_id' })
  paqueteId!: number;

  @BelongsTo(() => PaqueteModel)
  paquete?: PaqueteModel;

  @ForeignKey(() => ServicioModel)
  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'servicio_id' })
  servicioId!: number;

  @BelongsTo(() => ServicioModel)
  servicio?: ServicioModel;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'tenant_id' })
  tenantId!: number;
}
