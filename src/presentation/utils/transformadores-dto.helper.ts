import * as moment from 'moment';

export class TransformadoresDto {
  public static transformarNumero(
    valor: string | number | null | undefined,
  ): number | undefined {
    if (valor === undefined || valor === null || valor === '') {
      return undefined;
    }

    return typeof valor === 'number' ? valor : Number(valor);
  }

  public static transformarBooleano(
    valor: string | number | boolean | null | undefined,
  ): boolean | undefined {
    if (valor === undefined || valor === null || valor === '') {
      return undefined;
    }

    if (typeof valor === 'boolean') {
      return valor;
    }

    if (typeof valor === 'number') {
      return valor === 1;
    }

    const normalizado = valor.toString().toLowerCase();
    return normalizado === 'true' || normalizado === '1';
  }

  public static transformarFecha(valor: unknown): Date | undefined {
    if (valor === undefined || valor === null || valor === '') {
      return undefined;
    }

    const fecha = moment.utc(valor).startOf('day');
    if (!fecha.isValid()) {
      return undefined;
    }

    return fecha.toDate();
  }
}
