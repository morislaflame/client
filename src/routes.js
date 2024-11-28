import Basket from "./pages/BasketPage/Basket";
import Shop from "./pages/Shop/Shop";
import Auth from "./pages/AuthPage/Auth";
import ModelPage from "./pages/ModelPage/ModelPage";
import { 
    ADMIN_ROUTE, 
    BASKET_ROUTE, 
    LOGIN_ROUTE, 
    REGISTRATION_ROUTE, 
    SHOP_ROUTE, 
    THING_ROUTE, 
    MAIN_ROUTE, 
    TERMS_ROUTE, 
    PRIVACY_ROUTE, 
    PAYMENT_ROUTE, 
    USERINFO_ROUTE, 
    USER_ACCOUNT_ROUTE, 
    ALL_ORDERS_ROUTE, 
    ALL_USERS_ROUTE, 
    ALL_RETURNS_ROUTE,
    EDIT_THING_ROUTE,
    SELLER_ACCOUNT_ROUTE,
    EDIT_SELLER_MODEL_ROUTE,
    ALL_SELLERS_ROUTE,
    SELLER_INFO_ROUTE,
    SELLER_PROFILE_ROUTE,
} from "./utils/consts";
import Main from "./pages/Main/Main";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import PaymentPage from "./pages/Payment/PaymentPage";
import UserInfoPage from "./pages/AllAdminPages/UserInfoPage/UserInfoPage";
import UserAccount from "./pages/NonUsedPages/UserAccount/UserAccount";
import AllOrdersPage from "./pages/AllAdminPages/AllOrdersPage/AllOrdersPage";
import AllUsersPage from "./pages/AllAdminPages/AllUsersPage/AllUsersPage";
import AllReturnsPage from "./pages/AllAdminPages/AllReturnPage/AllReturnPage";
import ModelEditPage from "./pages/AllAdminPages/ModelEditPage/ModelEditPage"; 
import SellerAccount from "./pages/SellerAccount/SellerAccount";
import EditSellerModel from "./pages/EditSellerModel/EditSellerModel";
import AdminPage from "./pages/AdminPage/AdminPage";
import AllSellersPage from "./pages/AllAdminPages/AllSellersPage/AllSellersPage";
import SellerInfoPage from "./pages/AllAdminPages/SellerInfoPage/SellerInfoPage";
import SellerProfile from "./pages/SellerProfile/SellerProfile";



export const authRoutes = (user) => {
    console.log("User in authRoutes:", user);

    const routes = [
        {
            path: BASKET_ROUTE,
            Component: <Basket />
        },
        {
            path: USER_ACCOUNT_ROUTE,
            Component: <UserAccount /> // Личный кабинет
        },
        {
            path: PAYMENT_ROUTE,
            Component: <PaymentPage />
        },
        {
            path: SELLER_PROFILE_ROUTE + '/:id',
            Component: <SellerProfile />
        },
    ];
    
    if (user && user.role === 'ADMIN') {
        console.log("User is admin, adding admin route");
        routes.push({
            path: ADMIN_ROUTE,
            Component: <AdminPage />
        });
        routes.push({
            path: USERINFO_ROUTE,
            Component: <UserInfoPage />
        });
        routes.push({
            path: ALL_ORDERS_ROUTE, 
            Component: <AllOrdersPage />
        });
        routes.push({
            path: ALL_USERS_ROUTE,
            Component: <AllUsersPage />
        });
        routes.push({
            path: ALL_RETURNS_ROUTE, 
            Component: <AllReturnsPage />
        });
        routes.push({
            path: EDIT_THING_ROUTE + '/:id', 
            Component: <ModelEditPage />
        });
        routes.push({
            path: ALL_SELLERS_ROUTE,
            Component: <AllSellersPage />
        });
        routes.push({
            path: SELLER_INFO_ROUTE + '/:id',
            Component: <SellerInfoPage />
        });
    } else {
        console.log("User is not admin");
    }

    if (user && user.role === 'SELLER') {
        console.log("User is seller, adding seller routes");
        routes.push({
            path: SELLER_ACCOUNT_ROUTE,
            Component: <SellerAccount />
        });
        routes.push({
            path: EDIT_SELLER_MODEL_ROUTE + '/:id',
            Component: <EditSellerModel />
        });
        // Добавьте остальные маршруты продавца, если необходимо
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
        Component: <ModelPage />
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
