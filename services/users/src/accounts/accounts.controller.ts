import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentAccount } from './current-account.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accounts: AccountsService) {}

  @Get('me')
  getMe(@CurrentAccount() account: any) {
    return this.accounts.getMe(account.id);
  }

  @Patch('me')
  updateMe(@CurrentAccount() account: any, @Body() dto: UpdateProfileDto) {
    return this.accounts.updateMe(account.id, dto);
  }

  @Patch('me/password')
  changePassword(@CurrentAccount() account: any, @Body() dto: ChangePasswordDto) {
    return this.accounts.changePassword(account.id, dto);
  }
}
