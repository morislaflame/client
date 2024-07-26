
import Admin from "./pages/Admin/Admin";
import Basket from "./pages/Basket";
import Shop from "./pages/Shop/Shop";
import Auth from "./pages/Auth";
import ThingPage from "./pages/ThingPage/ThingPage";
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, THING_ROUTE } from "./utils/consts";

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
]