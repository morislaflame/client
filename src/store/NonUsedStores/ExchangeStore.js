// store/ExchangeStore.js

import { makeAutoObservable, action, runInAction } from 'mobx';
import {
  createExchangeRequest,
  fetchAllExchangeRequests,
  fetchUserExchangeRequests,
  approveExchangeRequest,
  rejectExchangeRequest,
  confirmPayment,
  confirmRefund,
} from '../../http/NonUsedAPI/exchangeAPI';

export default class ExchangeStore {
  constructor() {
    this._exchangeRequests = [];
    this._allExchangeRequests = [];
    this._loading = false;

    makeAutoObservable(this, {
      setExchangeRequests: action,
      setAllExchangeRequests: action,
      setLoading: action,
      loadUserExchangeRequests: action,
      loadAllExchangeRequests: action,
      createNewExchangeRequest: action,
      approveExistingExchangeRequest: action,
      rejectExistingExchangeRequest: action,
      confirmPaymentForExchange: action,
      confirmRefundForExchange: action,
      updateExchangeStatus: action,
    });
  }

  // Сеттеры
  setExchangeRequests(exchangeRequests) {
    this._exchangeRequests = exchangeRequests;
  }

  setAllExchangeRequests(allExchangeRequests) {
    this._allExchangeRequests = allExchangeRequests;
  }

  setLoading(loading) {
    this._loading = loading;
  }

  // Методы для работы с обменами
  async loadUserExchangeRequests() {
    this.setLoading(true);
    try {
      const data = await fetchUserExchangeRequests();
      runInAction(() => {
        this.setExchangeRequests(data);
        this.setLoading(false);
      });
    } catch (error) {
      console.error('Ошибка при загрузке запросов на обмен пользователя:', error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async loadAllExchangeRequests(status) {
    this.setLoading(true);
    try {
      const data = await fetchAllExchangeRequests(status);
      runInAction(() => {
        this.setAllExchangeRequests(data);
        this.setLoading(false);
      });
    } catch (error) {
      console.error('Ошибка при загрузке всех запросов на обмен:', error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async createNewExchangeRequest(exchangeData) {
    this.setLoading(true);
    try {
      const data = await createExchangeRequest(exchangeData);
      runInAction(() => {
        this._exchangeRequests.push(data);
        this.setLoading(false);
      });
      return data;
    } catch (error) {
      console.error('Ошибка при создании запроса на обмен:', error);
      runInAction(() => {
        this.setLoading(false);
      });
      throw error;
    }
  }

  async approveExistingExchangeRequest(exchangeRequestId) {
    this.setLoading(true);
    try {
      const data = await approveExchangeRequest(exchangeRequestId);
      runInAction(() => {
        this.updateExchangeStatus(exchangeRequestId, 'approved');
        this.setLoading(false);
      });
      return data;
    } catch (error) {
      console.error('Ошибка при подтверждении запроса на обмен:', error);
      runInAction(() => {
        this.setLoading(false);
      });
      throw error;
    }
  }

  async rejectExistingExchangeRequest(exchangeRequestId) {
    this.setLoading(true);
    try {
      const data = await rejectExchangeRequest(exchangeRequestId);
      runInAction(() => {
        this.updateExchangeStatus(exchangeRequestId, 'rejected');
        this.setLoading(false);
      });
      return data;
    } catch (error) {
      console.error('Ошибка при отклонении запроса на обмен:', error);
      runInAction(() => {
        this.setLoading(false);
      });
      throw error;
    }
  }

  async confirmPaymentForExchange(exchangeRequestId) {
    this.setLoading(true);
    try {
      const data = await confirmPayment(exchangeRequestId);
      runInAction(() => {
        this.updateExchangeStatus(exchangeRequestId, 'payment_confirmed');
        this.setLoading(false);
      });
      return data;
    } catch (error) {
      console.error('Ошибка при подтверждении доплаты:', error);
      runInAction(() => {
        this.setLoading(false);
      });
      throw error;
    }
  }

  async confirmRefundForExchange(exchangeRequestId, cryptoTransactionHash) {
    this.setLoading(true);
    try {
      const data = await confirmRefund(exchangeRequestId, cryptoTransactionHash);
      runInAction(() => {
        this.updateExchangeStatus(exchangeRequestId, 'refund_confirmed');
        this.setLoading(false);
      });
      return data;
    } catch (error) {
      console.error('Ошибка при подтверждении возврата средств:', error);
      runInAction(() => {
        this.setLoading(false);
      });
      throw error;
    }
  }

  updateExchangeStatus(exchangeRequestId, status) {
    const updateStatus = (requests) => {
      const index = requests.findIndex((request) => request.id === exchangeRequestId);
      if (index !== -1) {
        requests[index].status = status;
      }
    };

    updateStatus(this._exchangeRequests);
    updateStatus(this._allExchangeRequests);
  }

  // Геттеры
  get exchangeRequests() {
    return this._exchangeRequests;
  }

  get allExchangeRequests() {
    return this._allExchangeRequests;
  }

  get loading() {
    return this._loading;
  }
}
