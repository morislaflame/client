import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { SHOP_ROUTE } from '../utils/consts';
import { Context } from '../index';


const AppRouter = () => {
    const { user } = useContext(Context);
    const [routes, setRoutes] = useState([]);

    // Обновляем маршруты при изменении состояния аутентификации или роли пользователя
    useEffect(() => {
        setRoutes(authRoutes(user.user));
    }, [user.isAuth, user.user.role]);  // Отслеживаем изменения в авторизации и роли

    return (
        <Routes>
            {user.isAuth && routes.map(({ path, Component }) => (
                <Route key={path} path={path} element={Component} exact />
            ))}

            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={Component} exact />
            ))}

            <Route path="*" element={<Navigate to={SHOP_ROUTE} />} />
        </Routes>
    );
};

export default AppRouter;
