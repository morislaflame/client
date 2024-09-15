import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { MAIN_ROUTE, SHOP_ROUTE } from '../utils/consts';
import { Context } from '../index';

const AppRouter = () => {
    const { user } = useContext(Context);
    const [routes, setRoutes] = useState([]);

    // Обновляем маршруты при изменении состояния аутентификации или роли пользователя
    useEffect(() => {
        console.log("User authentication or role changed, updating routes");
        setRoutes(authRoutes(user.user));
    }, [user.isAuth, user.user.role]);  // Отслеживаем изменения в авторизации и роли

    return (
        <Routes>
            {/* Маршруты, доступные только авторизованным пользователям */}
            {user.isAuth && routes.map(({ path, Component }) => (
                <Route key={path} path={path} element={Component} exact />
            ))}

            {/* Публичные маршруты */}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={Component} exact />
            ))}

            {/* Перенаправляем на главную страницу, если маршрут не найден */}
            <Route path="*" element={<Navigate to={MAIN_ROUTE} />} />
        </Routes>
    );
};

export default AppRouter;
