import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Param,
  ParseIntPipe,
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
import { CrearServicioRequestDto } from '../dto/crear-servicio.request.dto';
import { ServicioCreadoResponseDto } from '../dto/servicio-creado.response.dto';
import { ServiciosService } from '../../application/services/servicios.service';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';
import { ServiciosMapper } from '../../shared/mappings/servicios.mapper';
import { JwtTenantGuard } from '../guards/jwt-tenant.guard';
import { PaginadoRequestDto } from '../dto/paginado.request.dto';
import { PaginadoServiciosRequestDto } from '../dto/paginado-servicios.request.dto';
import {
  ServiciosSinPaquetePaginadosResponseDto,
  ServiciosConPaquetesPaginadosResponseDto,
} from '../dto/paginado.response.dto';
import { ServicioConPaquetesResponseDto } from '../dto/servicio-listado.response.dto';

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

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOkResponse({ type: ServiciosConPaquetesPaginadosResponseDto })
  public async listar(
    @Query() query: PaginadoServiciosRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<ServiciosConPaquetesPaginadosResponseDto> {
    try {
      const tenantId = request.tenantId;
      const pagina = query.pagina ?? 1;
      const tamanoPagina = query.tamanoPagina ?? 10;

      const resultado = await this.serviciosService.listarServicios(
        tenantId,
        pagina,
        tamanoPagina,
        query.nombre,
        query.paqueteId,
      );
      console.log({ resultado: JSON.stringify(resultado) });
      return plainToInstance(
        ServiciosConPaquetesPaginadosResponseDto,
        resultado,
        {
          excludeExtraneousValues: true,
        },
      );
    } catch (error) {
      Logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Get('packages/:paqueteId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOkResponse({ type: ServiciosSinPaquetePaginadosResponseDto })
  public async listarPorPaquete(
    @Param('paqueteId', ParseIntPipe) paqueteId: number,
    @Query() query: PaginadoRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<ServiciosSinPaquetePaginadosResponseDto> {
    try {
      const tenantId = request.tenantId;
      const pagina = query.pagina ?? 1;
      const tamanoPagina = query.tamanoPagina ?? 10;

      const resultado = await this.serviciosService.listarServiciosDePaquetes(
        tenantId,
        paqueteId,
        pagina,
        tamanoPagina,
      );

      return plainToInstance(
        ServiciosSinPaquetePaginadosResponseDto,
        resultado,
        {
          excludeExtraneousValues: true,
        },
      );
    } catch (error) {
      Logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Get(':servicioId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOkResponse({ type: ServicioConPaquetesResponseDto })
  public async obtenerDetalle(
    @Param('servicioId', ParseIntPipe) servicioId: number,
    @Req() request: RequestConTenant,
  ): Promise<ServicioConPaquetesResponseDto> {
    try {
      const tenantId = request.tenantId;
      const servicio = await this.serviciosService.obtenerDetalleServicio(
        tenantId,
        servicioId,
      );

      return plainToInstance(ServicioConPaquetesResponseDto, servicio, {
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
      Logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }
}
