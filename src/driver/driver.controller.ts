import { Controller, Get, Param, Delete, Post, Request } from '@nestjs/common';
import { DriverService } from './driver.service';
import { Driver } from './driver.entity';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('init')
  initDrivers(): Promise<Driver[]> {
    return this.driverService.initDrivers();
  }

  @Post()
  create(@Request() req): Promise<Driver> {
    return this.driverService.create(req.body);
  }

  @Get()
  getAll(): Promise<Driver[]> {
    return this.driverService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Driver> {
    return this.driverService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.driverService.delete(id);
  }
}
