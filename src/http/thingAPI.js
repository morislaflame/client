import axios from 'axios';

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'ngrok-skip-browser-warning': 'true', // Устанавливаем заголовок ngrok
        'User-Agent': 'CustomUserAgent/1.0'   // Устанавливаем нестандартный User-Agent
    }
});

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'ngrok-skip-browser-warning': 'true', // Устанавливаем заголовок ngrok
        'User-Agent': 'CustomUserAgent/1.0'   // Устанавливаем нестандартный User-Agent
    }
});

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

export const createType = async (type) => {
    const { data } = await $authHost.post('api/type', type);
    return data;
};

export const fetchTypes = async () => {
    const { data } = await $host.get('api/type');
    return data;
};

export const createBrand = async (brand) => {
    const { data } = await $authHost.post('api/brand', brand);
    return data;
};

export const fetchBrands = async () => {
    const { data } = await $host.get('api/brand');
    return data;
};

export const createThing = async (thing) => {
    const { data } = await $authHost.post('api/thing', thing);
    return data;
};

export const fetchThings = async (typeId, brandIds, page, limit = 20, minPrice, maxPrice) => {
    console.log("Fetching things with params:", { typeId, brandIds, page, limit, minPrice, maxPrice });
    try {
        const { data } = await $host.get('api/thing', {
            params: { typeId, brandIds, page, limit, minPrice, maxPrice }
        });
        console.log("Fetched things:", data);
        return data;
    } catch (error) {
        console.error("Error fetching things: ", error);
    }
};

// Добавляем метод для получения диапазона цен всех товаров
export const fetchPriceRange = async () => {
    const { data } = await $host.get('api/thing/price-range');
    return data;
};

export const fetchOneThing = async (id) => {
    const { data } = await $host.get('api/thing/' + id);
    return data;
};

export const addToBasket = async (thingId) => {
    const { data } = await $authHost.post('api/basket/add', { thingId });
    return data;
};

// Новый метод для обновления товара
export const updateThing = async (id, thing) => {
    const { data } = await $authHost.put(`api/thing/${id}`, thing);
    return data;
};
