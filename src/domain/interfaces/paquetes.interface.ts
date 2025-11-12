export interface IServicioPaqueteDetalle {
  nombre: string;
  valor: number;
}

export interface ICrearPaquete {
  tenantId: number;
  nombre: string;
  valor: number;
  fechaInicio: Date;
  fechaFin?: Date | null;
  activo: boolean;
  servicios: IServicioPaqueteDetalle[];
}

export interface IServicioAsociado {
  id: number;
  nombre: string;
  valor: number | null;
}

export interface IPaqueteCreado {
  id: number;
  nombre: string;
  valor: number;
  fechaInicio: Date;
  fechaFin: Date | null;
  activo: boolean;
  servicios: IServicioAsociado[];
}
