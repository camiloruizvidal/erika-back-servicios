export interface IServicioSinPaqueteListado {
  id: number;
  nombre: string;
  valor: number;
}

export interface IServicioConPaquetesListado {
  id: number;
  nombre: string;
  valor: number;
  paquetes: Array<{
    id: number;
    nombre: string;
  }>;
}
