import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { CrearPaqueteRequestDto } from '../dto/crear-paquete.request.dto';
import { PaquetesService } from '../../application/services/paquetes.service';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';
import { PaquetesMapper } from '../../shared/mappings/paquetes.mapper';
import { PaqueteCreadoResponseDto } from '../dto/paquete-creado.response.dto';
import { JwtTenantGuard } from '../guards/jwt-tenant.guard';
import { ActualizarServiciosPaqueteRequestDto } from '../dto/actualizar-servicios-paquete.request.dto';

interface RequestConTenant extends Request {
  tenantId: number;
}

@ApiTags('packages')
@Controller('api/v1/packages')
export class PaquetesController {
  constructor(
    private readonly paquetesService: PaquetesService,
    private readonly manejadorError: ManejadorError,
  ) {}

  @Get(':paqueteId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOkResponse({ type: PaqueteCreadoResponseDto })
  public async obtenerDetalle(
    @Param('paqueteId', ParseIntPipe) paqueteId: number,
    @Req() request: RequestConTenant,
  ): Promise<PaqueteCreadoResponseDto> {
    try {
      const tenantId = request.tenantId;
      const paquete = await this.paquetesService.obtenerDetallePaquete(
        tenantId,
        paqueteId,
      );

      return plainToInstance(PaqueteCreadoResponseDto, paquete, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      Logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtTenantGuard)
  @ApiBody({ type: CrearPaqueteRequestDto })
  @ApiCreatedResponse({ type: PaqueteCreadoResponseDto })
  public async crear(
    @Body() dto: CrearPaqueteRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<PaqueteCreadoResponseDto> {
    try {
      const tenantId = request.tenantId;
      const payload = PaquetesMapper.toInterface(dto, tenantId);
      const respuesta = await this.paquetesService.crearPaquete(payload);
      console.log({ respuesta: JSON.stringify(respuesta) });
      return plainToInstance(PaqueteCreadoResponseDto, respuesta, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      Logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Put(':paqueteId/services')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiBody({ type: ActualizarServiciosPaqueteRequestDto })
  @ApiOkResponse({ type: PaqueteCreadoResponseDto })
  public async actualizarServicios(
    @Param('paqueteId', ParseIntPipe) paqueteId: number,
    @Body() dto: ActualizarServiciosPaqueteRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<PaqueteCreadoResponseDto> {
    try {
      const tenantId = request.tenantId;
      const resultado = await this.paquetesService.actualizarServiciosPaquete(
        tenantId,
        paqueteId,
        dto.servicioIds,
      );

      return plainToInstance(PaqueteCreadoResponseDto, resultado, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      Logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }
}
