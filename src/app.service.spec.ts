import * as bcrypt from 'bcrypt';
import { AppService } from './app.service';

describe('AppService token refresh flow', () => {
  const buildService = () => {
    const user = {
      _id: { toString: () => 'user-123' },
      email: 'test@example.com',
      password: 'hashed-password',
      name: 'Test User',
    };

    const jwtService = {
      sign: jest.fn((payload: Record<string, unknown>, options?: { expiresIn?: string }) => {
        if (options?.expiresIn === '7d') {
          return 'refresh-token-abc';
        }

        return 'access-token-xyz';
      }),
      verifyAsync: jest.fn(async (token: string) => {
        if (token === 'refresh-token-abc') {
          return { sub: 'user-123', email: 'test@example.com', type: 'refresh' };
        }

        throw new Error('Invalid refresh token');
      }),
    };

    const usersModel = {
      findUserByEmail: jest.fn(async (email: string) => {
        if (email === 'test@example.com') {
          return user;
        }

        return null;
      }),
      findUserById: jest.fn(async (id: string) => (id === 'user-123' ? user : null)),
      createUser: jest.fn(),
    };

    const service = new AppService(
      usersModel as any,
      {} as any,
      {} as any,
      {} as any,
      jwtService as any,
    );

    return { service, jwtService, user };
  };

  it('should return access and refresh tokens on login', async () => {
    const { service, jwtService, user } = buildService();
    const hashedPassword = await bcrypt.hash('strong-password', 10);
    user.password = hashedPassword;

    const result = await service.login({ email: 'test@example.com', password: 'strong-password' });

    expect(result.access_token).toBe('access-token-xyz');
    expect(result.refresh_token).toBe('refresh-token-abc');
    expect(result.expires_in).toBe(900);
    expect(jwtService.sign).toHaveBeenCalledWith(
      { sub: 'user-123', email: 'test@example.com' },
      { expiresIn: '15m' },
    );
  });

  it('should issue a new access token when refresh token is valid', async () => {
    const { service } = buildService();

    const result = await service.refreshToken({ refreshToken: 'refresh-token-abc' });

    expect(result.access_token).toBe('access-token-xyz');
    expect(result.refresh_token).toBe('refresh-token-abc');
    expect(result.user.email).toBe('test@example.com');
  });
});
