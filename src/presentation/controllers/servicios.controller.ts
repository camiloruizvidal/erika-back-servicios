import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
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
import {
  ServiciosSinPaquetePaginadosResponseDto,
  ServiciosConPaquetesPaginadosResponseDto,
} from '../dto/paginado.response.dto';

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
  @ApiOkResponse({ type: ServiciosSinPaquetePaginadosResponseDto })
  public async listarSinPaquetes(
    @Query() query: PaginadoRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<ServiciosSinPaquetePaginadosResponseDto> {
    try {
      const tenantId = request.tenantId;
      const pagina = query.pagina ?? 1;
      const tamanoPagina = query.tamanoPagina ?? 10;

      const resultado = await this.serviciosService.listarServiciosSinPaquete(
        tenantId,
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

  @Get('packages')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOkResponse({ type: ServiciosConPaquetesPaginadosResponseDto })
  public async listarConPaquetes(
    @Query() query: PaginadoRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<ServiciosConPaquetesPaginadosResponseDto> {
    try {
      const tenantId = request.tenantId;
      const pagina = query.pagina ?? 1;
      const tamanoPagina = query.tamanoPagina ?? 10;

      const resultado = await this.serviciosService.listarServiciosDePaquetes(
        tenantId,
        pagina,
        tamanoPagina,
      );

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
