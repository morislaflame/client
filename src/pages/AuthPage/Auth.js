import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../../utils/consts';
import { registration, login } from '../../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from "../../index";
import { Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './Auth.module.css';

const Auth = observer(() => {
    const { user, model } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        if (!email || !password) {
            message.error('Please fill in all fields');
            return;
        }

        if (!email.includes('@')) {
            message.error('Please enter a valid email');
            return;
        }

        if (password.length < 6) {
            message.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(email, password);
            }
            user.setUser(data);
            user.setIsAuth(true);
            await model.loadBasket();

            localStorage.setItem('redirectAfterReload', SHOP_ROUTE);
            window.location.reload();
        } catch (e) {
            console.error('Error during registration or login:', e);
            message.error(e.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const redirectAfterReload = localStorage.getItem('redirectAfterReload');
        if (redirectAfterReload) {
            localStorage.removeItem('redirectAfterReload');
            navigate(redirectAfterReload);
        }
    }, [navigate]);

    return (
        <div className={styles.auth}>
            <div className={styles.auth_form}>
                <h2 className={styles.auth_title}>
                    {isLogin ? 'Authorization' : 'Registration'}
                </h2>
                <div className='container-item'>
                    <Input
                        size="large"
                        prefix={<UserOutlined />}
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Input.Password
                        size="large"
                        prefix={<LockOutlined />}
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onPressEnter={handleSubmit}
                    />
                </div>
                <div className={styles.auth_row}>
                    <div className={styles.auth_row_link}>
                        {isLogin ? (
                            <>No account? <NavLink to={REGISTRATION_ROUTE}>Sign up</NavLink></>
                        ) : (
                            <>Have an account? <NavLink to={LOGIN_ROUTE}>Sign in</NavLink></>
                        )}
                    </div>
                    <div className={styles.auth_row_button}>
                        <Button
                            type="ghost"
                            onClick={handleSubmit}
                            loading={loading}
                            size="large"
                            style={{ width: '100%', fontSize: 'var(--medium-font-size)' }}
                        >
                            {isLogin ? 'Sign in' : 'Sign up'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Auth;
