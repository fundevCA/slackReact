// import useInput from '@hooks/useInput';
// import fetcher from '@utils/fetcher';
import React, { useCallback, useState, VFC } from 'react';
import axios from 'axios';
// import useSWR from 'swr';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from './styles';
import { Link, Redirect } from 'react-router-dom';
import useInput from '@hooks/useInput';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const SignUp = () => {
  const { data, error, revalidate } = useSWR('http://localhost:3095/api/users', fetcher);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      // console.log(email, nickname, password, passwordCheck);
      e.preventDefault();
      if (!mismatchError && nickname) {
        console.log('Register through server');
        setSignUpError('');
        setSignUpSuccess(false);
        axios
          .post(
            '/api/users',
            {
              email,
              nickname,
              password,
            },
            { withCredentials: true },
          )
          .then((res) => {
            console.log(res);
            setSignUpSuccess(true);
          })
          .catch((err) => {
            console.log(err.response);
            setSignUpError(err.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck, mismatchError],
  );

  if (data === undefined) {
    return <div>Loading...</div>;
  }

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

  return (
    <div id="container">
      <Header>Slack React</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>E-mail</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>Nickname</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>Password</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>Confirm Password</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>Password does not match</Error>}
          {!nickname && <Error>Enter Your Nickname</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>Successfully Signed up!</Success>}
        </Label>
        <Button type="submit">Register</Button>
      </Form>
      <LinkContainer>
        Already have an account?&nbsp;
        <Link to="/login">Log In</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
