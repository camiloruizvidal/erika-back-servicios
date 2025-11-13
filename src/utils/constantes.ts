export class Constantes {
  static readonly LOCAL = 'local';
  static readonly MENSAJE_TIEMPO_EXCEDIDO =
    'El tiempo de 60000ms ha sido excedido';
  static readonly CONEXION_ABORTADA = 'ECONNABORTED';
  static readonly MENSAJE_ERROR_INTERNO = 'Error interno en el servidor';
  static readonly PROPIEDAD_NO_PERMITIDA = (property: string) =>
    `${property} no es una propiedad permitida`;
  static readonly TENANT_YA_EXISTE =
    'Ya existe una empresa registrada con ese NIT';
  static readonly USUARIO_YA_EXISTE =
    'Ya existe un usuario registrado con ese correo';
  static readonly USUARIO_NO_EXISTE = 'El usuario no se encuentra registrado';
  static readonly CREDENCIALES_INVALIDAS = 'Credenciales inválidas';
  static readonly AUTH_HEADER_REQUERIDO =
    'El encabezado Authorization es obligatorio';
  static readonly TOKEN_INVALIDO = 'El token proporcionado no es válido';
  static readonly TOKEN_SIN_CLAIMS =
    'El token no contiene la información requerida';
  static readonly PAQUETE_YA_EXISTE =
    'La empresa ya cuenta con un paquete con ese nombre';
  static readonly SERVICIOS_REQUERIDOS =
    'Debe registrar al menos un servicio para crear el paquete';
  static readonly SERVICIO_DUPLICADO_EN_SOLICITUD =
    'Existen servicios duplicados en la solicitud';
  static readonly SERVICIOS_NO_ENCONTRADOS =
    'Alguno de los servicios indicados no existe para esta empresa';
  static readonly FECHA_FIN_ANTERIOR =
    'La fecha de fin no puede ser anterior a la fecha de inicio';
  static readonly TRANSACCION_NO_DISPONIBLE =
    'No fue posible iniciar la transacción de base de datos';
  static readonly SERVICIO_YA_EXISTE =
    'La empresa ya cuenta con un servicio con ese nombre';
  static readonly PAQUETE_NO_ENCONTRADO =
    'El paquete indicado no existe para esta empresa';
  static readonly LONGITUD_MINIMA = (campo: string, minimo: number) =>
    `${campo} debe tener al menos ${minimo} caracteres`;
  static readonly VALOR_MINIMO = (campo: string, minimo: number) =>
    `${campo} debe ser mayor o igual a ${minimo}`;
}
