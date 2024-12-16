import { makeAutoObservable, runInAction } from "mobx";
import { 
  createOrder,
  getMyOrders, 
  getOrderById, 
  completeOrder, 
  applyPromoCode, 
  removePromoCode, 
  getMyReturns, 
  getReturnById, 
  createReturn,
  getUserOrders,
  getMyPromoCodes
} from "../http/orderAPI";

import {
  getAllOrders,
  deleteOrder,
  getReturnPendingOrders,
  getAllReturns, 
  approveReturn, 
  rejectReturn, 
  deleteReturn 
} from "../http/adminAPI";

import { 
    createInvoice, 
    getAllInvoice, 
    deleteInvoice, 
    getOrderInvoices 
} from "../http/invoiceAPI";

export default class OrderStore {

  orders = [];
  returns = [];
  currentOrder = null;
  currentReturn = null;

  // Новые состояния для админа
  pendingReturns = [];
  isLoadingOrders = false;
  isLoadingReturns = false;

  userOrders = [];
  loading = false;

  availablePromoCodes = [];
  isLoadingPromoCodes = false;

  currentInvoice = null;
  isLoadingInvoice = false;
  orderInvoices = [];
  isLoadingOrderInvoices = false;
  isInvoiceVisible = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadMyOrders = async () => {
        try {
            const data = await getMyOrders();
            runInAction(() => {
                this.orders = data;
            });
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    loadMyReturns = async () => {
        try {
            const data = await getMyReturns();
            runInAction(() => {
                this.returns = data;
            });
        } catch (error) {
            console.error('Error loading returns:', error);
        }
    }

    createOrder = async (orderData) => {
        try {
            const data = await createOrder(orderData);
            runInAction(() => {
                this.orders.push(data);
                this.currentOrder = data;
            });
            return data;
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }

    getOrderById = async (id) => {
        try {
            const data = await getOrderById(id);
            runInAction(() => {
                this.currentOrder = data;
            });
            return data;
        } catch (error) {
            console.error('Error loading order:', error);
        }
    }

    completeOrder = async (id) => {
        try {
            const data = await completeOrder(id);
            runInAction(() => {
                this.orders = this.orders.map(order => 
                    order.id === id ? { ...order, status: 'completed' } : order
                );
                if (this.currentOrder?.id === id) {
                    this.currentOrder = { ...this.currentOrder, status: 'completed' };
                }
            });
            return data;
        } catch (error) {
            console.error('Error completing order:', error);
        }
    }

    // В OrderStore.js

    applyPromoCode = async (orderId, promocode) => {
        try {
            await applyPromoCode(orderId, promocode);
            // После применения промокода загружаем обновленный заказ
            const updatedOrder = await this.getOrderById(orderId);
            runInAction(() => {
                this.currentOrder = updatedOrder;
            });
            return updatedOrder;
        } catch (error) {
            console.error('Error applying promocode:', error);
            throw error;
        }
    }
    
    removePromoCode = async (orderId) => {
        try {
            await removePromoCode(orderId);
            // После удаления промокода загружаем обновленный заказ
            const updatedOrder = await this.getOrderById(orderId);
            runInAction(() => {
                this.currentOrder = updatedOrder;
            });
            return updatedOrder;
        } catch (error) {
            console.error('Error removing promocode:', error);
            throw error;
        }
    }

    loadMyPromoCodes = async () => {
        this.isLoadingPromoCodes = true;
        try {
            const data = await getMyPromoCodes();
            runInAction(() => {
                this.availablePromoCodes = data;
            });
        } catch (error) {
            console.error('Error loading available promo codes:', error);
        } finally {
            runInAction(() => {
                this.isLoadingPromoCodes = false;
            });
        }
    }

    getReturnById = async (id) => {
        try {
            const data = await getReturnById(id);
            runInAction(() => {
                this.currentReturn = data;
            });
            return data;
        } catch (error) {
            console.error('Error loading return:', error);
        }
    }

    createReturn = async (orderId, reason) => {
        try {
            const data = await createReturn(orderId, reason);
            runInAction(() => {
                this.returns.push(data);
                this.currentReturn = data;
            });
            return data;
        } catch (error) {
            console.error('Error creating return:', error);
        }
    }

    // Админские методы
    loadAllOrders = async () => {
        this.isLoadingOrders = true;
        try {
            const data = await getAllOrders();
            runInAction(() => {
                this.orders = data;
            });
        } catch (error) {
            console.error('Error loading all orders:', error);
        } finally {
            runInAction(() => {
                this.isLoadingOrders = false;
            });
        }
    }

    loadPendingReturns = async () => {
        try {
            const data = await getReturnPendingOrders();
            runInAction(() => {
                this.pendingReturns = data;
            });
        } catch (error) {
            console.error('Error loading pending returns:', error);
        }
    }

    getUserOrders = async (userId) => {
        try {
            this.loading = true;
            const data = await getUserOrders(userId);
            runInAction(() => {
                this.userOrders = data;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            console.error("Error loading user orders:", error);
        }
    }

    deleteOrderAdmin = async (orderId) => {
        try {
            await deleteOrder(orderId);
            runInAction(() => {
                this.orders = this.orders.filter(order => order.id !== orderId);
            });
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    }

    loadAllReturns = async (status) => {
        this.isLoadingReturns = true;
        try {
            const data = await getAllReturns(status);
            runInAction(() => {
                this.returns = data;
            });
        } catch (error) {
            console.error('Error loading returns:', error);
        } finally {
            runInAction(() => {
                this.isLoadingReturns = false;
            });
        }
    }

    approveReturnAdmin = async (returnId) => {
        try {
            await approveReturn(returnId);
            runInAction(() => {
                this.pendingReturns = this.pendingReturns.filter(
                    returnItem => returnItem.id !== returnId
                );
                const returnIndex = this.returns.findIndex(r => r.id === returnId);
                if (returnIndex !== -1) {
                    this.returns[returnIndex] = { ...this.returns[returnIndex], status: 'APPROVED' };
                }
            });
        } catch (error) {
            console.error('Error approving return:', error);
            throw error;
        }
    }

    rejectReturnAdmin = async (returnId, reason) => {
        try {
            await rejectReturn(returnId, reason);
            runInAction(() => {
                this.pendingReturns = this.pendingReturns.filter(
                    returnItem => returnItem.id !== returnId
                );
                const returnIndex = this.returns.findIndex(r => r.id === returnId);
                if (returnIndex !== -1) {
                    this.returns[returnIndex] = { ...this.returns[returnIndex], status: 'REJECTED' };
                }
            });
        } catch (error) {
            console.error('Error rejecting return:', error);
            throw error;
        }
    }

    deleteReturnAdmin = async (returnId) => {
        try {
            await deleteReturn(returnId);
            runInAction(() => {
                this.returns = this.returns.filter(returnItem => returnItem.id !== returnId);
                this.pendingReturns = this.pendingReturns.filter(
                    returnItem => returnItem.id !== returnId
                );
            });
        } catch (error) {
            console.error('Error deleting return:', error);
            throw error;
        }
    }

    createInvoice = async (orderId) => {
        try {
            this.isLoadingInvoice = true;
            const data = await createInvoice(orderId);
            runInAction(() => {
                this.currentInvoice = data.invoice;
                this.getOrderInvoices(orderId);
            });
            return data.invoice;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        } finally {
            runInAction(() => {
                this.isLoadingInvoice = false;
            });
        }
    }

    getAllInvoices = async () => {
        try {
            const data = await getAllInvoice();
            return data;
        } catch (error) {
            console.error('Error getting all invoices:', error);
            throw error;
        }
    }

    deleteInvoice = async (id) => {
        try {
            await deleteInvoice(id);
        } catch (error) {
            console.error('Error deleting invoice:', error);
            throw error;
        }
    }

    getOrderInvoices = async (orderId) => {
        try {
            this.isLoadingOrderInvoices = true;
            const data = await getOrderInvoices(orderId);
            runInAction(() => {
                this.orderInvoices = data;
            });
            return data;
        } catch (error) {
            console.error('Error getting order invoices:', error);
            throw error;
        } finally {
            runInAction(() => {
                this.isLoadingOrderInvoices = false;
            });
        }
    }

    setIsInvoiceVisible = (value) => {
        this.isInvoiceVisible = value;
    }

    setCurrentInvoice = (invoice) => {
        this.currentInvoice = invoice;
    }
}
