import {
  Table,
  Column,
  DataType,
  Model,
  AllowNull,
  BelongsToMany,
} from 'sequelize-typescript';
import { PaqueteModel } from './paquete.model';
import { PaqueteServicioModel } from './paquete-servicio.model';

@Table({
  tableName: 'servicios',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class ServicioModel extends Model {
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
  @Column({
    type: DataType.DECIMAL(12, 2),
    get(): number {
      return parseFloat(this.getDataValue('valor'));
    },
  })
  declare valor: number;

  @BelongsToMany(() => PaqueteModel, () => PaqueteServicioModel)
  paquetes?: PaqueteModel[];
}
