// import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;


describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  })

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndow@example.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jonh Tre',
      email: 'jonhtre@gmail.com'
    });

    expect(updatedUser.name).toBe('Jonh Tre');
    expect(updatedUser.email).toBe('jonhtre@gmail.com');
  });

  it('should not be able to update the profile of non-existing user', async () => {
    expect(updateProfile.execute({
     user_id: 'non-existing-user-id',
     name: 'Test',
     email: 'test@example.com',
   })).rejects.toBeInstanceOf(AppError);
 });

  it('should not be able to change the email if the email already exist', async () => {
    await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'teste@example.com',
      password: '123456',
    })

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Jonh Doe',
      email: 'johndoe@example.com'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndow@example.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jonh Tre',
      email: 'jonhtre@example.com',
      old_password: '123456',
      password: '123123'
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without the old password' , async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndow@example.com',
      password: '123456',
    })

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Jonh Tre',
      email: 'jonhtre@example.com',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with the wrong current password' , async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Jonh Tre',
      email: 'jonhtre@example.com',
      old_password: 'wrongcurrentpassword',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError);
  });

});