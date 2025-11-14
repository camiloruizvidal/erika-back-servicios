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
  Query,
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
import { PaginadoPaquetesRequestDto } from '../dto/paginado-paquetes.request.dto';
import { PaquetesPaginadosResponseDto } from '../dto/paginado.response.dto';

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

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOkResponse({ type: PaquetesPaginadosResponseDto })
  public async listar(
    @Query() query: PaginadoPaquetesRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<PaquetesPaginadosResponseDto> {
    try {
      const tenantId = request.tenantId;
      const pagina = query.pagina ?? 1;
      const tamanoPagina = query.tamanoPagina ?? 10;
      const nombre = query.nombre?.trim() || undefined;
      const activo = query.activo;
      const fechaInicio = query.fechaInicio?.trim() || undefined;
      const fechaFin = query.fechaFin?.trim() || undefined;

      const resultado = await this.paquetesService.listarPaquetes(
        tenantId,
        pagina,
        tamanoPagina,
        nombre,
        activo,
        fechaInicio,
        fechaFin,
      );

      return plainToInstance(PaquetesPaginadosResponseDto, resultado, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      Logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

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
