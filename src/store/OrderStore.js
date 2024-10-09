// store/OrderStore.js

import { makeAutoObservable, action, runInAction } from 'mobx';
import {
  createOrder,
  fetchUserOrders,
  fetchNewOrders,
  fetchAllOrders,
  confirmOrder,
  rejectOrder,
  fetchOrderDetails,
} from '../http/orderAPI';

export default class OrderStore {
  constructor() {
    this._orders = [];
    this._newOrders = [];
    this._allOrders = [];
    this._orderDetails = null;
    this._loading = false;

    makeAutoObservable(this, {
      setOrders: action,
      setNewOrders: action,
      setAllOrders: action,
      setOrderDetails: action,
      setLoading: action,
      loadUserOrders: action,
      loadNewOrders: action,
      loadAllOrders: action,
      loadOrderDetails: action,
      createNewOrder: action,
      confirmExistingOrder: action,
      rejectExistingOrder: action,
      updateOrderStatus: action,
    });
  }

  // Сеттеры
  setOrders(orders) {
    this._orders = orders;
  }

  setNewOrders(newOrders) {
    this._newOrders = newOrders;
  }

  setAllOrders(allOrders) {
    this._allOrders = allOrders;
  }

  setOrderDetails(orderDetails) {
    this._orderDetails = orderDetails;
  }

  setLoading(loading) {
    this._loading = loading;
  }

  // Методы для работы с заказами
  async loadUserOrders() {
    this.setLoading(true);
    try {
      const data = await fetchUserOrders();
      runInAction(() => {
        this.setOrders(data);
        this.setLoading(false);
      });
    } catch (error) {
      console.error('Ошибка при загрузке заказов пользователя:', error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async loadNewOrders() {
    this.setLoading(true);
    try {
      const data = await fetchNewOrders();
      runInAction(() => {
        this.setNewOrders(data);
        this.setLoading(false);
      });
    } catch (error) {
      console.error('Ошибка при загрузке новых заказов:', error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async loadAllOrders() {
    this.setLoading(true);
    try {
      const data = await fetchAllOrders();
      runInAction(() => {
        this.setAllOrders(data);
        this.setLoading(false);
      });
    } catch (error) {
      console.error('Ошибка при загрузке всех заказов:', error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async loadOrderDetails(orderId) {
    this.setLoading(true);
    try {
      const data = await fetchOrderDetails(orderId);
      runInAction(() => {
        this.setOrderDetails(data);
        this.setLoading(false);
      });
    } catch (error) {
      console.error('Ошибка при загрузке деталей заказа:', error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async createNewOrder(orderData) {
    this.setLoading(true);
    try {
      const data = await createOrder(orderData);
      runInAction(() => {
        this._orders.push(data);
        this.setLoading(false);
      });
      return data;
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      runInAction(() => {
        this.setLoading(false);
      });
      throw error;
    }
  }

  async confirmExistingOrder(orderId) {
    this.setLoading(true);
    try {
      const data = await confirmOrder(orderId);
      runInAction(() => {
        this.updateOrderStatus(orderId, 'confirmed');
        this.setLoading(false);
      });
      return data;
    } catch (error) {
      console.error('Ошибка при подтверждении заказа:', error);
      runInAction(() => {
        this.setLoading(false);
      });
      throw error;
    }
  }

  async rejectExistingOrder(orderId) {
    this.setLoading(true);
    try {
      const data = await rejectOrder(orderId);
      runInAction(() => {
        this.updateOrderStatus(orderId, 'rejected');
        this.setLoading(false);
      });
      return data;
    } catch (error) {
      console.error('Ошибка при отклонении заказа:', error);
      runInAction(() => {
        this.setLoading(false);
      });
      throw error;
    }
  }

  updateOrderStatus(orderId, status) {
    const updateStatus = (orders) => {
      const index = orders.findIndex((order) => order.id === orderId);
      if (index !== -1) {
        orders[index].status = status;
      }
    };

    updateStatus(this._orders);
    updateStatus(this._newOrders);
    updateStatus(this._allOrders);
  }

  // Геттеры
  get orders() {
    return this._orders;
  }

  get newOrders() {
    return this._newOrders;
  }

  get allOrders() {
    return this._allOrders;
  }

  get orderDetails() {
    return this._orderDetails;
  }

  get loading() {
    return this._loading;
  }
}
