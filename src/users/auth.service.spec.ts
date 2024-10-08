import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let authService;
  let fakeUserService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      find: (email: string) => {
        const filterdUser = users.filter((u) => u.email === email);
        return Promise.resolve(filterdUser);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // create an DI testing container
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(authService).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await authService.signup('asdf@gmail.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await authService.signup('asd@gmail.com', 'pass');
    await expect(authService.signup('asd@gmail.com', 'asd')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(authService.signin('asd@gmail.com', '123')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    await authService.signup('laskdjf@alskdfj.com', 'pass');
    await expect(
      authService.signin('laskdjf@alskdfj.com', 'passowrd'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await authService.signup('test@test.com', 'pass');
    const user = await authService.signin('test@test.com', 'pass');
    expect(user).toBeDefined();
  });
});
