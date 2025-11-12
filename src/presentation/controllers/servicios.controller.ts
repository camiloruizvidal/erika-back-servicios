import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { CrearServicioDto } from '../dto/crear-servicio.dto';
import { ServicioCreadoDto } from '../dto/servicio-creado.dto';
import { ServiciosService } from '../../application/services/servicios.service';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';
import { ServiciosMapper } from '../../shared/mappings/servicios.mapper';
import { JwtTenantGuard } from '../guards/jwt-tenant.guard';
import { ErrorPersonalizado } from '../../utils/error-personalizado/error-personalizado';
import { Constantes } from '../../utils/constantes';

interface RequestConTenant extends Request {
  tenantId?: number;
}

@ApiTags('services')
@Controller('api/v1/services')
export class ServiciosController {
  constructor(
    private readonly serviciosService: ServiciosService,
    private readonly manejadorError: ManejadorError,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtTenantGuard)
  @ApiBody({ type: CrearServicioDto })
  @ApiCreatedResponse({ type: ServicioCreadoDto })
  public async crear(
    @Body() dto: CrearServicioDto,
    @Req() request: RequestConTenant,
  ): Promise<ServicioCreadoDto> {
    try {
      const tenantId = request.tenantId;

      if (tenantId === undefined) {
        throw new ErrorPersonalizado(
          HttpStatus.UNAUTHORIZED,
          Constantes.TOKEN_SIN_CLAIMS,
        );
      }

      const payload = ServiciosMapper.toInterface(dto, tenantId);
      const servicio = await this.serviciosService.crearServicio(payload);

      return plainToInstance(ServicioCreadoDto, servicio, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.manejadorError.resolverErrorApi(error);
    }
  }
}

