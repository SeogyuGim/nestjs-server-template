import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { SignUpDto } from '@app/domain/auth/zod/auth.zod';
import { UpdateUsernameDto } from '@app/domain/users/zod/user.zod';
import { MysqlDatasourceKey, UserRepositoryKey } from '@app/constants';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(UserRepositoryKey) private usersRepository: Repository<UserEntity>,
    @Inject(MysqlDatasourceKey) private mysqlProvider: DataSource,
  ) {}

  async findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({
      username,
    });
  }

  async findSecretValuesByUsername(username: string) {
    return this.usersRepository.findOne({
      where: {
        username,
      },
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

  async findAllUsers() {
    return this.usersRepository.find();
  }

  async updateUsernameById(id: number, dto: UpdateUsernameDto) {
    const updated = await this.usersRepository.update(id, dto);
    return !!updated.affected;
  }

  async deleteById(id: number) {
    const deleted = await this.usersRepository.delete(id);
    return !!deleted.affected;
  }
}
