import { Inject, Injectable } from '@nestjs/common';
import { Between, DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity.js';
import { SignUpDto } from '../auth/auth.zod.js';
import { UpdateUsernameDto } from './user.zod.js';
import {
  MYSQL_DATASOURCE_KEY,
  USER_REPOSITORY_KEY,
} from '../../common/constants.js';
import { GeneralQueryFilter } from '../../applications/api/api.zod.js';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(USER_REPOSITORY_KEY)
    private usersRepository: Repository<User>,
    @Inject(MYSQL_DATASOURCE_KEY)
    private mysqlProvider: DataSource,
  ) {}

  async findOne(user: FindOptionsWhere<User>) {
    return await this.usersRepository.findOneBy(user);
  }

  async findSecretValues(user: FindOptionsWhere<User>) {
    return await this.usersRepository.findOne({
      where: user,
      select: {
        salt: true,
        password: true,
      },
    });
  }

  async saveUser(dto: SignUpDto) {
    const created = this.usersRepository.create(dto);
    const { salt, password, ...result } = await this.usersRepository.save(
      created,
    );
    return result;
  }

  async findAllUsers(q: GeneralQueryFilter) {
    const where: { createdAt?: any } = {};

    if (q.startDt && q.endDt) {
      where.createdAt = Between(q.startDt, q.endDt);
    }
    return await this.usersRepository.find({
      where,
      skip: q.offset,
      take: q.limit,
    });
  }

  async updatePasswordById(id: number, password: string) {
    const updated = await this.usersRepository.update(id, {
      password,
    });
    return !!updated.affected;
  }

  async deleteById(id: number) {
    const deleted = await this.usersRepository.delete(id);
    return !!deleted.affected;
  }

  async updateUsernameById(id: number, updateUserDto: UpdateUsernameDto) {
    const updated = await this.usersRepository.update(id, updateUserDto);
    return !!updated.affected;
  }
}
