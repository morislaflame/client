import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const telegramAuth = async (initData) => {
    const { data } = await $host.post('api/user/telegramAuth', { initData });
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
};

export const registration = async (email, password) => {
    const {data} = await $host.post('api/user/registration', {email, password})
    console.log("Token received during registration:", data.token);  // Логируем полученный токен
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const fetchMyInfo = async () => {
    const { data } = await $authHost.get('api/user/me');
    return data;
};

export const fetchUserPromoCodes = async () => {
    const { data } = await $authHost.get('api/user/promoCodes');
    return data;
}

export const fetchMyPurchasedThings = async () => {
  const { data } = await $authHost.get('api/user/my-purchased-things');
  return data;
};

export const becomeSeller = async (sellerData) => {
    const { data } = await $authHost.post('api/user/become-seller', sellerData);
    localStorage.setItem('token', data.token);
    return data;
};
