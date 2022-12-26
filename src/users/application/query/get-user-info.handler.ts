import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../infra/db/entity/user.entity';
import { UserInfo } from '../../interface/UserInfo';
import { GetUserInfoQuery } from './get-user-info.query';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler
  implements IQueryHandler<GetUserInfoQuery>
{
  // TODO: usersRepository, 의존성 문제 해결
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserInfoQuery): Promise<UserInfo> {
    const { userId } = query;

    const user = await this.usersRepository.findOneBy({ uid: userId });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return {
      id: user.uid,
      name: user.userName,
      email: user.email,
    };
  }
}
