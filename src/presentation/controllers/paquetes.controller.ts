import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { CrearPaqueteDto } from '../dto/crear-paquete.dto';
import { PaquetesService } from '../../application/services/paquetes.service';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';
import { PaquetesMapper } from '../../shared/mappings/paquetes.mapper';
import { PaqueteCreadoDto } from '../dto/paquete-creado.dto';
import { JwtTenantGuard } from '../guards/jwt-tenant.guard';
import { ErrorPersonalizado } from '../../utils/error-personalizado/error-personalizado';
import { Constantes } from '../../utils/constantes';

interface RequestConTenant extends Request {
  tenantId?: number;
}

@ApiTags('packages')
@Controller('api/v1/packages')
export class PaquetesController {
  constructor(
    private readonly paquetesService: PaquetesService,
    private readonly manejadorError: ManejadorError,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtTenantGuard)
  @ApiBody({ type: CrearPaqueteDto })
  @ApiCreatedResponse({ type: PaqueteCreadoDto })
  public async crear(
    @Body() dto: CrearPaqueteDto,
    @Req() request: RequestConTenant,
  ): Promise<PaqueteCreadoDto> {
    try {
      const tenantId = request.tenantId;
      if (tenantId === undefined) {
        throw new ErrorPersonalizado(
          HttpStatus.UNAUTHORIZED,
          Constantes.TOKEN_SIN_CLAIMS,
        );
      }
      const payload = PaquetesMapper.toInterface(dto, tenantId);
      const respuesta = await this.paquetesService.crearPaquete(payload);
      console.log({ respuesta: JSON.stringify(respuesta) });
      return plainToInstance(PaqueteCreadoDto, respuesta, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      Logger.error(error);
      this.manejadorError.resolverErrorApi(error);
    }
  }
}
