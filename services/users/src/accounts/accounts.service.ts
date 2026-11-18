import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async getMe(id: string) {
    const account = await this.prisma.account.findUnique({ where: { id } });
    const { passwordHash: _pw1, ...safe } = account;
    return safe;
  }

  async updateMe(id: string, dto: UpdateProfileDto) {
    const account = await this.prisma.account.update({ where: { id }, data: dto });
    const { passwordHash: _pw2, ...safe } = account;
    return safe;
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const account = await this.prisma.account.findUnique({ where: { id } });
    const valid = await bcrypt.compare(dto.currentPassword, account.passwordHash);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');
    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.account.update({ where: { id }, data: { passwordHash } });
    return { message: 'Password updated' };
  }
}
