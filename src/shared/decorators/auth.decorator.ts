import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '../enums/user.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from './role.decorator';

export const Auth = (...roles: UserRole[]) => {
   return applyDecorators(
        UseGuards(AuthGuard),
        Role(...roles),
        ApiBearerAuth()
    );
}