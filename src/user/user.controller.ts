import { UserService } from './user.service';
import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  Query,
} from '@nestjs/common';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  getById(
    @Param('id') id: number,
    @Query('withGroups') withGroups: string,
  ): Promise<User> {
    return this.userService.getById(id, withGroups);
  }

  @Patch()
  partialUpdate(@Request() req): Promise<User> {
    return this.userService.partialUpdate(req.body);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
