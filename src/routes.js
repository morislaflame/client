
import Admin from "./pages/Admin/Admin";
import Basket from "./pages/Basket";
import Shop from "./pages/Shop/Shop";
import Auth from "./pages/Auth";
import ThingPage from "./pages/ThingPage/ThingPage";
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, THING_ROUTE, MAIN_ROUTE, TERMS_ROUTE, PRIVACY_ROUTE } from "./utils/consts";
import Main from "./pages/Main/Main";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: <Admin/>
    },
    {
        path: BASKET_ROUTE,
        Component: <Basket/>
    }
]

export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Component: <Main/>
    },
    {
        path: SHOP_ROUTE,
        Component: <Shop/>
    },
    {
        path: LOGIN_ROUTE,
        Component: <Auth/>
    },
    {
        path: REGISTRATION_ROUTE,
        Component: <Auth/>
    },
    {
        path: THING_ROUTE + '/:id',
        Component: <ThingPage/>
    },
    {
        path: TERMS_ROUTE,
        Component: <TermsOfService/>
    },
    {
        path: PRIVACY_ROUTE,
        Component: <PrivacyPolicy/>
    },
]