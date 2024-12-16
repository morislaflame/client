import { $authHost } from "./index";

export const createOrder = async (order) => {
  const { data } = await $authHost.post('/api/order', order);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await $authHost.get('/api/order/my-orders');
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await $authHost.get(`/api/order/${id}`);
  return data;
};

export const completeOrder = async (id) => {
  const { data } = await $authHost.put(`/api/order/${id}/complete`);
  return data;
};

export const applyPromoCode = async (id, promocode) => {
  const { data } = await $authHost.post(`/api/order/${id}/apply-promocode`, { promocode });
  return data;
};

export const removePromoCode = async (id) => {
  const { data } = await $authHost.post(`/api/order/${id}/remove-promocode`);
  return data;
};

export const getMyPromoCodes = async () => {
  const { data } = await $authHost.get('/api/promocode/my-promocodes');
  return data;
};

export const getUserPromoCodes = async (userId) => {
  const { data } = await $authHost.get(`/api/promocode/user/${userId}`);
  return data;
};


export const getMyReturns = async () => {
  const { data } = await $authHost.get('/api/return/my-returns');
  return data;
};

export const getReturnById = async (id) => {
  const { data } = await $authHost.get(`/api/return/${id}`);
  return data;
};

export const createReturn = async (orderId, reason) => {
  const { data } = await $authHost.post(`/api/return`, { orderId, reason });
  return data;
};

export const getUserOrders = async (userId) => {
  const { data } = await $authHost.get(`/api/order/user/${userId}`);
  return data;
};
