import { AuthService } from './auth.service';

function makeMockPrisma(account: any) {
  return {
    account: {
      findFirst: jest.fn().mockResolvedValue(account),
      update: jest.fn().mockImplementation(({ data }) => Promise.resolve({ ...account, ...data })),
    },
  };
}

const mockJwt = { sign: jest.fn().mockReturnValue('token') };

const bcrypt = require('bcryptjs');

describe('AuthService — blocking logic', () => {
  it('blocks account after 5 failed attempts', async () => {
    const passwordHash = await bcrypt.hash('correct', 12);
    const account = {
      id: '1',
      identifier: 'user1',
      contact: 'u@example.com',
      name: 'User',
      passwordHash,
      kind: 'USER',
      language: 'FR',
      status: 'ACTIVE',
      failedLoginCount: 4,
    };
    const prisma = makeMockPrisma(account) as any;
    const service = new AuthService(prisma, mockJwt as any);

    await expect(service.login({ identifier: 'user1', password: 'wrong' })).rejects.toThrow();
    expect(prisma.account.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { failedLoginCount: 5, status: 'BLOCKED' },
    });
  });

  it('does not block after 4 failed attempts', async () => {
    const passwordHash = await bcrypt.hash('correct', 12);
    const account = {
      id: '2',
      identifier: 'user2',
      contact: 'u2@example.com',
      name: 'User2',
      passwordHash,
      kind: 'USER',
      language: 'FR',
      status: 'ACTIVE',
      failedLoginCount: 3,
    };
    const prisma = makeMockPrisma(account) as any;
    const service = new AuthService(prisma, mockJwt as any);

    await expect(service.login({ identifier: 'user2', password: 'wrong' })).rejects.toThrow();
    expect(prisma.account.update).toHaveBeenCalledWith({
      where: { id: '2' },
      data: { failedLoginCount: 4, status: 'ACTIVE' },
    });
  });
});
