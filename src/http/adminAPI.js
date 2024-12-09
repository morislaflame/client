import { $authHost, $host } from './index';

export const fetchPendingModelProducts = async () => {
    const { data } = await $authHost.get('api/model-product/admin/pending');
    return data;
};

export const approveModelProduct = async (modelProductId) => {
    const { data } = await $authHost.post(`api/model-product/admin/${modelProductId}/approve`);
    return data;
};

export const rejectModelProduct = async (modelProductId, rejectionReason) => {
    const { data } = await $authHost.post(`api/model-product/admin/${modelProductId}/reject`, { rejectionReason });
    return data;
};

export const createSharedPromoCode = async (promoCodeData) => {
    const { data } = await $authHost.post('api/promocode/shared', promoCodeData);
    return data;
};

export const createOneTimePromoCode = async (promoCodeData) => {
    const { data } = await $authHost.post('api/promocode/one-time', promoCodeData);
    return data;
};

export const getAllPromoCodes = async () => {
    const { data } = await $authHost.get('api/promocode');
    return data;
};

export const deactivatePromoCode = async (promoCodeId) => {
    const { data } = await $authHost.put(`api/promocode/deactivate/${promoCodeId}`);
    return data;
};

export const deletePromoCode = async (promoCodeId) => {
    const { data } = await $authHost.delete(`api/promocode/${promoCodeId}`);
    return data;
};


export const fetchUsers = async () => {
    const { data } = await $authHost.get('api/user/users');
    return data;
};

export const getUserById = async (userId) => {
    const { data } = await $authHost.get(`api/user/user/${userId}`);
    return data;
};

export const changeUserRole = async (userId, newRole) => {
    const { data } = await $authHost.put(`api/user/role`, { userId, newRole });
    return data;
};

export const deleteUser = async (userId) => {
    const { data } = await $authHost.delete('api/user/users', { data: { userId } });
    return data;
};

export const getUserByEmail = async (email) => {
    const { data } = await $authHost.post('api/user/user', { email });
    return data;
};

export const createAdultPlatform = async (adultPlatform) => {
    const { data } = await $authHost.post('api/adult-platform', adultPlatform);
    return data;
};

export const deleteAdultPlatform = async (adultPlatformId) => {
    const { data } = await $authHost.delete(`api/adult-platform/${adultPlatformId}`);
    return data;
};

export const createCountry = async (country) => {
    const { data } = await $authHost.post('api/country', country);
    return data;
};

export const deleteCountry = async (countryId) => {
    const { data } = await $authHost.delete(`api/country/${countryId}`);
    return data;
};

export const createCommissionRate = async (commissionRateData) => {
    const { data } = await $authHost.post('api/commission-rate', commissionRateData);
    return data;
};

export const getAllCommissionRates = async () => {
    const { data } = await $authHost.get('api/commission-rate');
    return data;
};

export const deleteCommissionRate = async (commissionRateId) => {
    const { data } = await $authHost.delete(`api/commission-rate/${commissionRateId}`);
    return data;
};

export const createStory = async (story) => {
    const { data } = await $authHost.post('api/story', story);
    return data;
};

export const fetchStories = async () => {
    const { data } = await $host.get('api/story');
    return data;
};

// Добавляем функцию для удаления истории
export const deleteStory = async (id) => {
    const { data } = await $authHost.delete(`api/story/${id}`);
    return data;
}


export const getAllOrders = async () => {
    const { data } = await $authHost.get('api/order');
    return data;
};

export const deleteOrder = async (id) => {
    const { data } = await $authHost.delete(`api/order/${id}`);
    return data;
};

export const getReturnPendingOrders = async () => {
    const { data } = await $authHost.get('api/return/pending');
    return data;
};

export const getUserOrders = async (userId) => {
    const { data } = await $authHost.get(`api/order/user/${userId}`);
    return data;
};


export const getAllReturns = async (status) => {
    const { data } = await $authHost.get(`api/return/${status}`);
    return data;
};

export const approveReturn = async (returnId) => {
    const { data } = await $authHost.post(`api/return/${returnId}/approve`);
    return data;
};

export const rejectReturn = async (returnId) => {
    const { data } = await $authHost.post(`api/return/${returnId}/reject`);
    return data;
};

export const deleteReturn = async (returnId) => {
    const { data } = await $authHost.delete(`api/return/${returnId}`);
    return data;
};
