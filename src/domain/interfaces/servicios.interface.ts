export interface ICrearServicio {
  tenantId: number;
  nombre: string;
  valor: number;
  paqueteId?: number | null;
}

export interface IServicioCreado {
  id: number;
  nombre: string;
  valor: number;
  paqueteId?: number;
}
