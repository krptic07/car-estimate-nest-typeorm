import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthSerice', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteresUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteresUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile(); // to create the DI container for Testing

    service = module.get(AuthService); // to create a new instance of the Auth Service
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('abhishek@gmail.com', 'abhishek');

    expect(user.password).not.toEqual('abhishek');

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email already in use', async () => {
    await service.signup('asdf@email.com', 'asdf');
    await expect(service.signup('asdf@email.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin is called with email not in use', async () => {
    await expect(service.signin('asf@am.com', 'asf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('signin throws an error if password does not match', async () => {
    await service.signup('asdf@email.com', 'asdf');
    await expect(service.signin('asdf@email.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@gmail.com', 'asdf');
    const user = await service.signin('asdf@gmail.com', 'asdf');
    expect(user).toBeDefined();
  });
});
