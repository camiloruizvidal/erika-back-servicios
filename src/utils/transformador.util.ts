export class Transformador {
  static extraerDataValues(result: any): any {
    if (
      !result ||
      (Array.isArray(result) && result.length === 0) ||
      (result.rows && result.rows.length === 0)
    ) {
      return result;
    }

    if (Array.isArray(result)) {
      return result.map((item) => Transformador.extraerDataValues(item));
    }

    if (result.rows) {
      return {
        ...result,
        rows: result.rows.map((item) => Transformador.extraerDataValues(item)),
      };
    }

    if (result?.dataValues) {
      const data = { ...result.dataValues };
      for (const key in data) {
        if (data[key]) {
          if (typeof data[key] === 'object' && !(data[key] instanceof Date)) {
            data[key] = Transformador.extraerDataValues(data[key]);
          }
        }
      }
      return data;
    }

    if (typeof result === 'object' && result !== null) {
      const data = { ...result };
      for (const key in data) {
        if (data[key] && typeof data[key] === 'object') {
          data[key] = Transformador.extraerDataValues(data[key]);
        }
      }
      return data;
    }

    return result;
  }
}
