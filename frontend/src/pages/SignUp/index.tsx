import React, { useCallback, useRef } from 'react';
import { FiMail, FiUser, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSubmit = useCallback(async (data: object) => {
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
    } catch (err) {
      const errors = getValidationErrors(err);

      formRef.current?.setErrors(errors);
    }
  }, []);

  return (
    <Container>
      <Background />

      <Content>
        <img src={logoImg} alt="GoBarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Create your free account</h1>

          <Input name="name" icon={FiUser} placeholder="Name" />
          <Input name="email" icon={FiMail} placeholder="email" />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Password"
          />

          <Button type="submit">Subscribe</Button>
        </Form>

        <a href="login">
          <FiArrowLeft />
          Back
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
