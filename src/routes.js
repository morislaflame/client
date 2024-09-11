import Admin from "./pages/Admin/Admin";
import Basket from "./pages/Basket";
import Shop from "./pages/Shop/Shop";
import Auth from "./pages/Auth";
import ThingPage from "./pages/ThingPage/ThingPage";
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, THING_ROUTE, MAIN_ROUTE, TERMS_ROUTE, PRIVACY_ROUTE, PAYMENT_ROUTE, USERINFO_ROUTE } from "./utils/consts";
import Main from "./pages/Main/Main";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import PaymentPage from "./pages/Payment/PaymentPage";
import UserInfoPage from "./pages/UserInfoPage/UserInfoPage";

export const authRoutes = (user) => {
    console.log("User in authRoutes:", user);

    const routes = [
        {
            path: BASKET_ROUTE,
            Component: <Basket />
        },
        {
            path: PAYMENT_ROUTE,
            Component: <PaymentPage />
        }
    ];

    
    if (user && user.role === 'ADMIN') {
        console.log("User is admin, adding admin route");
        routes.push({
            path: ADMIN_ROUTE,
            Component: <Admin />
        });
        routes.push({
            path: USERINFO_ROUTE,
            Component: <UserInfoPage />
        });
    } else {
        console.log("User is not admin");
    }


    return routes;
};

export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Component: <Main />
    },
    {
        path: SHOP_ROUTE,
        Component: <Shop />
    },
    {
        path: LOGIN_ROUTE,
        Component: <Auth />
    },
    {
        path: REGISTRATION_ROUTE,
        Component: <Auth />
    },
    {
        path: THING_ROUTE + '/:id',
        Component: <ThingPage />
    },
    {
        path: TERMS_ROUTE,
        Component: <TermsOfService />
    },
    {
        path: PRIVACY_ROUTE,
        Component: <PrivacyPolicy />
    }
];
