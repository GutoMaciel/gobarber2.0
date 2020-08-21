// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;


describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
  })

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Jonh John',
      email: 'john.jonh@example.com',
      password: '123456',
    });

    const LoggedUser = await fakeUsersRepository.create({
      name: 'Logged User',
      email: 'logged.user@example.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: LoggedUser.id,
    });

    expect(providers).toEqual([
      user1,
      user2,
    ]);
  });

});
