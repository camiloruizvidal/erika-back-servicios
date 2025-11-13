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
import { CrearServicioRequestDto } from '../dto/crear-servicio.request.dto';
import { ServicioCreadoResponseDto } from '../dto/servicio-creado.response.dto';
import { ServiciosService } from '../../application/services/servicios.service';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';
import { ServiciosMapper } from '../../shared/mappings/servicios.mapper';
import { JwtTenantGuard } from '../guards/jwt-tenant.guard';
interface RequestConTenant extends Request {
  tenantId: number;
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
  @ApiBody({ type: CrearServicioRequestDto })
  @ApiCreatedResponse({ type: ServicioCreadoResponseDto })
  public async crear(
    @Body() dto: CrearServicioRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<ServicioCreadoResponseDto> {
    try {
      const tenantId = request.tenantId;
      const payload = ServiciosMapper.toInterface(dto, tenantId);
      const servicio = await this.serviciosService.crearServicio(payload);
      return plainToInstance(ServicioCreadoResponseDto, servicio, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.manejadorError.resolverErrorApi(error);
    }
  }
}
