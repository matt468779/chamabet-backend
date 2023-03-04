import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CollectionQuery } from '@chamabet/query';
import { QueryConstructor } from '@chamabet/query';
import { DataResponseFormat } from 'libs/api-data/src/lib/data-response-format';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltRounds);
    const createdUser = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });
    const { password, ...result } = createdUser;
    this.userRepository.save(createdUser);
    return result;
  }

  find() {
    return this.userRepository.find();
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hash = await bcrypt.hash(updateUserDto.password, 10);
      return this.userRepository.update(email, {
        ...updateUserDto,
        password: hash,
      });
    }
    return this.userRepository.update(email, updateUserDto);
  }

  remove(email: string) {
    return this.userRepository.delete(email);
  }

  async markEmailAsConfirmed(email: string) {
    return this.userRepository.update({ email }, { isEmailConfirmed: true });
  }

  async getQuery(query: CollectionQuery) {
    const products = await QueryConstructor.constructQuery(
      this.userRepository,
      query,
    ).getMany();
    const response = new DataResponseFormat();
    response.data = products;
    response.count = await this.userRepository.count();
    return response;
  }
}
