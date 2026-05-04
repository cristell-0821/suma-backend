import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get('departamentos')
  findAllDepartamentos() {
    return this.locationsService.findAllDepartamentos();
  }

  @Get('departamentos/:id')
  findDepartamento(@Param('id') id: string) {
    return this.locationsService.findDepartamentoById(id);
  }

  @Get('departamentos/:id/ciudades')
  findCiudadesByDepartamento(@Param('id') departamentoId: string) {
    return this.locationsService.findCiudadesByDepartamento(departamentoId);
  }
}