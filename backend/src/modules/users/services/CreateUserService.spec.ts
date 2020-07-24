import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    const user = await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with an email already taken', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    await createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    });

    expect(createUser.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
