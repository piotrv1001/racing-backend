import { UserDTO } from './user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userDTO: UserDTO): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userDTO.password, salt);
    const user = new User();
    user.username = userDTO.username;
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getById(id: number, withGroups: string): Promise<User> {
    if (withGroups === 'true') {
      return this.userRepository.findOne({
        where: { id: id },
        relations: {
          groups: true,
        },
      });
    }
    return this.userRepository.findOneBy({ id: id });
  }

  async getByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username: username });
  }

  async partialUpdate(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
