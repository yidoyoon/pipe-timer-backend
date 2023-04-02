import { CheckEmailHandler } from '@/auth/command/handler/check-email.handler';
import { RoutineToTimerEntity } from '@/routines/infra/db/entity/routine-to-timer.entity';
import { RoutineEntity } from '@/routines/infra/db/entity/routine.entity';
import { RoutineRepository } from '@/routines/infra/db/repository/routine-repository.service';
import { AddResetTokenHandler } from '@/users/application/command/handler/add-reset-token.handler';
import { ChangeEmailHandler } from '@/users/application/command/handler/change-email.handler';
import { ChangeNameHandler } from '@/users/application/command/handler/change-name.handler';
import { CreateTimestampHandler } from '@/users/application/command/handler/create-timestamp.handler';
import { DeleteAccountHandler } from '@/users/application/command/handler/delete-account.handler';
import { UpdatePasswordHandler } from '@/users/application/command/handler/update-password.handler';
import { VerifyChangeEmailHandler } from '@/users/application/command/handler/verify-change-email.handler';

import { VerifyResetPasswordTokenHandler } from '@/users/application/command/handler/verify-reset-password-token.handler';
import { PasswordResetStrategy } from '@/users/common/strategy/password-reset.strategy';
import { Logger, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from './infra/adapter/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/db/entity/user.entity';
import { UserRegisterEventHandler } from './application/event/user-register-event.handler';
import { UserFactory } from './domain/user.factory';
import { UserRepository } from './infra/db/repository/UserRepository';
import { UserController } from './interface/user.controller';
import { UserProfile } from '@/users/common/mapper/user.profile';
import { VerifyEmailHandler } from '@/users/application/command/handler/verify-email.handler';
import { PassportModule } from '@nestjs/passport';

const commandHandlers = [
  VerifyEmailHandler,
  CheckEmailHandler,
  VerifyResetPasswordTokenHandler,
  AddResetTokenHandler,
  UpdatePasswordHandler,
  ChangeEmailHandler,
  CreateTimestampHandler,
  VerifyChangeEmailHandler,
  ChangeNameHandler,
  DeleteAccountHandler,
];
const queryHandlers = [];
const eventHandlers = [UserRegisterEventHandler];
const factories = [UserFactory];

const strategies = [PasswordResetStrategy];

const repositories = [
  { provide: 'UserRepository', useClass: UserRepository },
  { provide: 'RoutineRepository', useClass: RoutineRepository },
  { provide: 'EmailService', useClass: EmailService },
];

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    EmailModule,
    TypeOrmModule.forFeature([UserEntity, RoutineEntity, RoutineToTimerEntity]),
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [UserController],
  providers: [
    ...commandHandlers,
    ...eventHandlers,
    ...factories,
    ...queryHandlers,
    ...repositories,
    ...strategies,
    Logger,
    UserProfile,
  ],
})
export class UserModule {}
