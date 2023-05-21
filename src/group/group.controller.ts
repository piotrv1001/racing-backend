import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Request,
  Query,
  HttpException,
} from '@nestjs/common';
import { GroupService, GroupWithUserCount } from './group.service';
import { Group } from './group.entity';
import { User } from 'src/user/user.entity';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Request() req, @Query('userId') userId?: number): Promise<Group> {
    return this.groupService.create(req.body, userId);
  }

  @Put()
  async getGroupByCode(
    @Query('code') code: string,
    @Query('userId') userId: number,
  ): Promise<GroupWithUserCount> {
    const group = await this.groupService.getGroupByCode(code);
    if (!group) {
      throw new HttpException('Not found', 404);
    }
    await this.groupService.addUserToGroup(userId, group.id);
    return group;
  }

  @Get()
  getByUserId(@Query('userId') userId?: number) {
    return this.groupService.getGroupsByUserId(userId);
  }

  @Get(':id/users')
  async getUsersByGroupId(@Param('id') id: number): Promise<User[]> {
    return this.groupService.getUsersByGroupId(id);
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Group> {
    return this.groupService.getById(id);
  }

  @Delete(':groupId/users/:userId')
  async removeUserFromGroup(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
  ) {
    return this.groupService.removeUserFromGroup(groupId, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.groupService.delete(id);
  }
}
