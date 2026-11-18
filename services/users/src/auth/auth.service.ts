import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { AccountKind } from '@prisma/client';

const MAX_FAILED = 5;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.account.findFirst({
      where: { OR: [{ identifier: dto.identifier }, { contact: dto.contact }] },
    });
    if (existing) throw new BadRequestException('Identifier or contact already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const account = await this.prisma.account.create({
      data: {
        identifier: dto.identifier,
        contact: dto.contact,
        name: dto.name,
        passwordHash,
        kind: dto.kind as AccountKind,
        language: dto.language || 'FR',
      },
    });
    const { passwordHash: _, ...safe } = account;
    return safe;
  }

  async login(dto: LoginDto) {
    const account = await this.prisma.account.findFirst({
      where: { OR: [{ identifier: dto.identifier }, { contact: dto.identifier }] },
    });

    if (!account) throw new UnauthorizedException('Invalid credentials');
    if (account.status === 'BLOCKED') throw new ForbiddenException('Account is blocked');

    const valid = await bcrypt.compare(dto.password, account.passwordHash);
    if (!valid) {
      const failedLoginCount = account.failedLoginCount + 1;
      await this.prisma.account.update({
        where: { id: account.id },
        data: {
          failedLoginCount,
          status: failedLoginCount >= MAX_FAILED ? 'BLOCKED' : 'ACTIVE',
        },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.account.update({ where: { id: account.id }, data: { failedLoginCount: 0 } });

    const { passwordHash: _, ...safe } = account;
    const accessToken = this.jwt.sign({ sub: account.id, kind: account.kind });
    return { accessToken, account: safe };
  }
}
