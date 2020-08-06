import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;


describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  })

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Jonh Doe');
    expect(profile.email).toBe('johndoe@example.com');
  });


  it('should not be able to show the profile of non-existing user', async () => {
     expect(showProfile.execute({
      user_id: 'non-existing-user-id',
    })).rejects.toBeInstanceOf(AppError);
  });

});
