import React from 'react';
import { loginValidation } from '../../validations/loginValidation';
import { useLoginMutation } from '../../services/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../services/auth/authSlice';
import FullscreenLoader from '../../components/FullScreenLoader';

const initialValues = {
    email: '',
    password: ''
};

const Login = () => {
 
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const handleLogin = async (values) => {
       const {email,password} = values;
        try {
            const userData= await login({ email, password }).unwrap();
              
            if(userData.user) {
                dispatch(setCredentials({
                  user: userData.user,
                  accessToken: userData.tokens.access.token,
                  refreshToken: userData.tokens.refresh.token,
                  tokenExpires: userData.tokens.access.expires,
                  refreshTokenExpires: userData.tokens.refresh.expires
                }));
                navigate('/home');
            }
                    

        } catch (error) {
            console.log(error)
        
            toast.error(error.data.message)
           
        } finally {
           
        }
    };


    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 radial-gradient">
          
            <Row className="justify-content-center w-100">
           
                <Col md={8} lg={6} xxl={3}>
                    <Card className="mb-0">
                    {isLoading && ( <BarLoader width="100%" />)}
                        <Card.Body>
                            <Link to="/" className="text-center d-block py-3 w-100">
                                <h2>Aegis demo</h2>
                            </Link>
                            <p className="text-center">Log in to your dashboard</p>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={loginValidation}
                                onSubmit={(values) => {
                                    handleLogin(values);
                                }}
                            >
                                {({ errors }) => (
                                    <Form>
                                        <BootstrapForm.Group className="mb-3" controlId="email">
                                            <BootstrapForm.Label>Email</BootstrapForm.Label>
                                            <Field name="email">
                                                {({ field }) => (
                                                    <BootstrapForm.Control
                                                        type="email"
                                                        isInvalid={!!errors.email}
                                                        {...field}
                                                    />
                                                )}
                                            </Field>
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.email}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                        <BootstrapForm.Group className="mb-4" controlId="password">
                                            <BootstrapForm.Label>Password</BootstrapForm.Label>
                                            <Field name="password">
                                                {({ field }) => (
                                                    <BootstrapForm.Control
                                                        type="password"
                                                        isInvalid={!!errors.password}
                                                        {...field}
                                                    />
                                                )}
                                            </Field>
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.password}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group>
                                        {/* <BootstrapForm.Group className="mb-3" controlId="email">
                                            <BootstrapForm.Label>Organization</BootstrapForm.Label>
                                            <Field name="organization_id">
                                                {({ field }) => (
                                                    <BootstrapForm.Control
                                                        type="text"
                                                        isInvalid={!!errors.organization_id}
                                                        {...field}
                                                    />
                                                )}
                                            </Field>
                                            <BootstrapForm.Control.Feedback type="invalid">
                                                {errors.organization_id}
                                            </BootstrapForm.Control.Feedback>
                                        </BootstrapForm.Group> */}
                                        {/* <div className="d-flex align-items-center justify-content-between mb-4">
                                            <Link to="/forgotPassword" className="text-primary fw-bold">
                                                Forgot password? Reset Password
                                            </Link>
                                        </div> */}
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="w-100 py-3 mb-4"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Logging in...' : 'Login'}
                                        </Button>
                                       
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
           
        </Container>
    );
};

export default Login;
