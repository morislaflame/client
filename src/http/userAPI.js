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

export const becomeSeller = async () => {
    const { data } = await $authHost.post('api/user/become-seller');
    return data;
};







// Добавление товара продавцом
export const createThingAsSeller = async (formData) => {
    const { data } = await $authHost.post('api/seller/things', formData);
    return data;
};

// Обновление товара продавцом
export const updateThingAsSeller = async (thingId, formData) => {
    const { data } = await $authHost.put(`api/seller/things/${thingId}`, formData);
    return data;
};

// Удаление товара продавцом
export const deleteThingAsSeller = async (thingId) => {
    const { data } = await $authHost.delete(`api/seller/things/${thingId}`);
    return data;
};

// Получение списка товаров продавца
export const fetchSellerThings = async () => {
    const { data } = await $authHost.get('api/seller/things');
    return data;
};




export const fetchUsers = async () => {
    const { data } = await $authHost.get('api/user/users');
    return data;
};

export const getUserById = async (id) => {
    const { data } = await $authHost.get(`api/user/user/${id}`);
    return data;
};

// Поиск пользователя по email
export const getUserByEmail = async (email) => {
    const { data } = await $authHost.post('api/user/user', { email });
    return data;
};

// Изменение роли пользователя
export const changeUserRole = async (userId, newRole) => {
    const { data } = await $authHost.put('api/user/role', { userId, newRole });
    return data;
};

// Удаление пользователя
export const deleteUser = async (userId) => {
    const { data } = await $authHost.delete('api/user/users', { data: { userId } });
    return data;
};

// Получение товаров, ожидающих модерации
export const fetchPendingThings = async () => {
    const { data } = await $authHost.get('api/thing/admin/pending');
    return data;
};

// Одобрение товара
export const approveThing = async (thingId) => {
    const { data } = await $authHost.put(`api/thing/admin/${thingId}/approve`);
    return data;
};

// Отклонение товара
export const rejectThing = async (thingId, rejectionReason) => {
    const { data } = await $authHost.put(`api/thing/admin/${thingId}/reject`, { rejectionReason });
    return data;
};

// Удаление товара администратором
export const deleteThingAsAdmin = async (thingId) => {
    const { data } = await $authHost.delete(`api/thing/${thingId}`);
    return data;
};

