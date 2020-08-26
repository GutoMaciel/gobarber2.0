import React, { useCallback, useRef } from 'react';
import { FiMail, FiUser, FiLock, FiArrowLeft, FiCamera } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';


import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const  { user } = useAuth();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Your name is required'),
          email: Yup.string()
            .required('An email is required')
            .email('Type an invalid email'),
          password: Yup.string().min(
            6,
            '6 characters are required in your password.',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        addToast({
          type: 'success',
          title: 'Success!',
          description: 'Now you can log on GoBarber',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Subscription Error',
          description: 'Check your data.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
          <Form
            ref={formRef}
            initialData={{
              name: user.name,
              email: user.email,
            }}
            onSubmit={handleSubmit}>
            <AvatarInput>
              <img src={user.avatar_url} alt={user.name}/>
              <button type="button">
                <FiCamera />
              </button>
            </AvatarInput>

            <h1>My account</h1>

            <Input name="name" icon={FiUser} placeholder="Name" />
            <Input name="email" icon={FiMail} placeholder="email" />

            <Input
              containerStyle={{ marginTop: 24}}
              name="old_password"
              icon={FiLock}
              type="password"
              placeholder="Your current password"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="The new password"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="New password confirmation"
            />


            <Button type="submit">Update profile</Button>
          </Form>
      </Content>
    </Container>
  );
};

export default Profile;
