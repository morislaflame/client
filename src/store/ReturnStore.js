// store/ReturnStore.js

import { makeAutoObservable, action, runInAction } from 'mobx';
import {
  createReturn,
  fetchUserReturns,
  fetchPendingReturns,
  fetchAllReturns,
  approveReturn,
  rejectReturn,
} from '../http/orderAPI';

export default class ReturnStore {
  constructor() {
    this._returns = [];
    this._pendingReturns = [];
    this._allReturns = [];
    this._loading = false;

    makeAutoObservable(this, {
      setReturns: action,
      setPendingReturns: action,
      setAllReturns: action,
      setLoading: action,
      loadUserReturns: action,
      loadPendingReturns: action,
      loadAllReturns: action,
      createNewReturn: action,
      approveExistingReturn: action,
      rejectExistingReturn: action,
      updateReturnStatus: action,
    });
  }

  // Сеттеры
  setReturns(returns) {
    this._returns = returns;
  }

  setPendingReturns(pendingReturns) {
    this._pendingReturns = pendingReturns;
  }

  setAllReturns(allReturns) {
    this._allReturns = allReturns;
  }

  setLoading(loading) {
    this._loading = loading;
  }

  // Методы для работы с возвратами
  async loadUserReturns() {
    this.setLoading(true);
    try {
      const data = await fetchUserReturns();
      runInAction(() => {
        this.setReturns(data);
        this.setLoading(false);
      });
    } catch (error) {
      console.error('Ошибка при загрузке возвратов пользователя:', error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async loadPendingReturns() {
    this.setLoading(true);
    try {
      const data = await fetchPendingReturns();
      runInAction(() => {
        this.setPendingReturns(data);
        this.setLoading(false);
      });
    } catch (error) {
      console.error('Ошибка при загрузке ожидающих возвратов:', error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async loadAllReturns() {
    this.setLoading(true);
    try {
      const data = await fetchAllReturns();
      runInAction(() => {
        this.setAllReturns(data);
        this.setLoading(false);
      });
    } catch (error) {
      console.error('Ошибка при загрузке всех возвратов:', error);
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async createNewReturn(returnData) {
    this.setLoading(true);
    try {
      await createReturn(returnData);
      await this.loadUserReturns(); // Перезагружаем возвраты пользователя
      runInAction(() => {
        this.setLoading(false);
      });
    } catch (error) {
      console.error('Ошибка при создании возврата:', error);
      runInAction(() => {
        this.setLoading(false);
      });
      throw error;
    }
  }
  

  async approveExistingReturn(returnId, cryptoTransactionHash) {
    this.setLoading(true);
    try {
      const data = await approveReturn(returnId, cryptoTransactionHash);
      runInAction(() => {
        this.updateReturnStatus(returnId, 'approved');
        this.setLoading(false);
      });
      return data;
    } catch (error) {
      console.error('Ошибка при подтверждении возврата:', error);
      runInAction(() => {
        this.setLoading(false);
      });
      throw error;
    }
  }

  async rejectExistingReturn(returnId) {
    this.setLoading(true);
    try {
      const data = await rejectReturn(returnId);
      runInAction(() => {
        this.updateReturnStatus(returnId, 'rejected');
        this.setLoading(false);
      });
      return data;
    } catch (error) {
      console.error('Ошибка при отклонении возврата:', error);
      runInAction(() => {
        this.setLoading(false);
      });
      throw error;
    }
  }

  updateReturnStatus(returnId, status) {
    const updateStatus = (returns) => {
      const index = returns.findIndex((returnItem) => returnItem.id === returnId);
      if (index !== -1) {
        returns[index].status = status;
      }
    };

    updateStatus(this._returns);
    updateStatus(this._pendingReturns);
    updateStatus(this._allReturns);
  }

  // Геттеры
  get returns() {
    return this._returns;
  }

  get pendingReturns() {
    return this._pendingReturns;
  }

  get allReturns() {
    return this._allReturns;
  }

  get loading() {
    return this._loading;
  }
}
