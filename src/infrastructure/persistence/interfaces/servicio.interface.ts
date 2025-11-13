export interface IServicio {
  id: number;
  tenantId: number;
  nombre: string;
  valor: number;
  paquetes?: Array<{
    id: number;
    nombre: string;
  }>;
}
