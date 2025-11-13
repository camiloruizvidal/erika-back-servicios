export interface IPaquete {
  id: number;
  tenantId: number;
  nombre: string;
  valor: number;
  fechaInicio: Date;
  fechaFin: Date | null;
  activo: boolean;
}

