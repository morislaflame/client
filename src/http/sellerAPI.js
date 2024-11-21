import { $authHost } from './index';

export const createModelProduct = async (formData) => {
    const { data } = await $authHost.post('api/model-product', formData);
    return data;
};

// Обновление товара продавцом
export const updateModelProduct = async (modelProductId, formData) => {
    const { data } = await $authHost.put(`api/model-product/${modelProductId}`, formData);
    return data;
};

// Удаление товара продавцом
export const deleteModelProduct = async (modelProductId) => {
    const { data } = await $authHost.delete(`api/model-product/${modelProductId}`);
    return data;
};

// Получение списка товаров продавца
export const fetchMyModelProducts = async () => {
    const { data } = await $authHost.get('api/seller/my-models');
    return data;
};

export const updateMyInformation = async (formData) => {
    const { data } = await $authHost.put('api/seller/profile', formData);
    return data;
};

export const fetchMyOrders = async () => {
    const { data } = await $authHost.get('api/seller/my-orders');
    return data;
};

export const getSellerById = async (sellerId) => {
    const { data } = await $authHost.get(`api/seller/${sellerId}`);
    return data;
};

export const getAllSellers = async () => {
    const { data } = await $authHost.get('api/seller');
    return data;
};

export const createSellerReview = async (sellerId, formData) => {
    const { data } = await $authHost.post(`api/seller/${sellerId}/reviews`, formData);
    return data;
};

export const getSellerReviews = async (sellerId) => {
    const { data } = await $authHost.get(`api/seller/${sellerId}/reviews`);
    return data;
};


