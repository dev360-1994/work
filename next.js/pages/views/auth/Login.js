import React, { useEffect, useState} from 'react';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import useJwt from '@src/components/auth/useJwt';

import {
  CheckCircle,
} from 'react-feather';
import {
  Alert, Card, CardBody, CardTitle, Form, FormGroup, Label, Button, Spinner,
} from 'reactstrap';
import { toast } from 'react-toastify';

import { login } from '@src/api/auth';
import { useRouter } from 'next/router';
import BlankLayout from '@src/layouts/BlankLayout';

import LogoImage from "@src/assets/images/logos/logo.png";
import Image from 'next/image';
import Link from 'next/link';

import jwt_decode from 'jwt-decode';

const config = useJwt.jwtConfig;

const Login = () => {
  const isObjEmpty = (obj) => Object.keys(obj).length === 0;
  const router = useRouter();
  const [isProcessing, setProcessing] = useState(false);
  const [apiErrors, setApiErrors] = useState({});
  const {
    register, errors, handleSubmit, clearErrors,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      const userData = localStorage.getItem('userData');
      if(userData){
        const {token} = JSON.parse(userData);
        const {userId} = jwt_decode(token);
  
        if(userId){
          router.push('/admin/activity')
        }
      }
    };
    fetchData();
  }, []);

  function LoginError(loginProps) {
    const { error } = loginProps;
    if (error.data) {
      return (
        <Alert color="danger">
          <div className="alert-body">
            <span>{error.data}</span>
          </div>
        </Alert>
      );
    }
    return '';
  }

  const onSubmit = async (data) => {
    setProcessing(true);
    await login(data.userName, data.password)
      .then((res) => {
        const loginData = { ...res.data, accessToken: res.data.token };
        // ---------------------------
        try {
          if (loginData.accessToken) {
            localStorage.setItem(config.storageTokenKeyName, loginData.accessToken);
            delete loginData.accessToken;
          }
          localStorage.setItem('userData', JSON.stringify(loginData));
          setProcessing(false);
        } catch (error) {
          console.error("Error storing data in localStorage:", error);
        }      
        // ---------------------------
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Log in Succeed.
          </>, {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: true,
          }
        );
        router.push('/admin/activity');
      })
      .catch((err) => {
        setProcessing(false);
        setApiErrors(err.response ? err.response : { data: 'API connectivity error' });
      });
  };

  const handleButtonClick = () => {
    clearErrors();
    handleSubmit(onSubmit)();
  };

  return (
    <BlankLayout>
      <div className="auth-wrapper auth-v1 px-2">
        <div className="auth-inner py-2">
          <div className="brand-logo">
            <Link href="/" passHref={true}>
              <a className="navbar-brand">
                <Image src={LogoImage} alt="logo" />
              </a>              
            </Link>
          </div>
          <Card className="mb-0">
            <CardBody>
              <CardTitle tag="h4" className="mb-1">
                Log in
              </CardTitle>
              <Form noValidate className="auth-login-form mt-2" onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                  <Label className="form-label" for="login-email">
                    UserName
                  </Label>
                  <input
                    autoFocus
                    type="text"
                    id="userName"
                    name="userName"
                    placeholder=""
                    className={classnames({ 'is-invalid': errors && errors.userName }, 'form-control')}
                    {...register('userName', { required: false })}
                  />
                </FormGroup>
                <FormGroup>
                  <div className="d-flex justify-content-between">
                    <Label className="form-label" for="login-password">
                      Password
                    </Label>
                  </div> 
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`input-group-merge ${classnames({ 'is-invalid': errors && errors.password }, 'form-control')}`}
                    {...register('password', { required: false })}
                  />
                </FormGroup>
                <LoginError error={apiErrors} />
                <Button type="Button" color="primary" block onClick={handleButtonClick}>
                  Sign in
                  {isProcessing && (
                    <Spinner style={{ width: '1rem', height: '1rem' }} type="grow" color="light" />
                  )}
                </Button>

              </Form>
            </CardBody>
          </Card>
        </div>
      </div>
    </BlankLayout>
  );
};

export default Login;
