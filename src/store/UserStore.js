import {makeAutoObservable, action, runInAction } from "mobx";
import { 
    fetchUsers, 
    getUserByEmail, 
    changeUserRole, 
    deleteUser, 
    getUserById, 
    fetchMyInfo, 
    fetchMyPurchasedThings, 
    telegramAuth, 
    createThingAsSeller, 
    fetchSellerThings, 
    updateThingAsSeller, 
    deleteThingAsSeller, 
    fetchPendingThings, 
    approveThing, 
    rejectThing, 
    deleteThingAsAdmin 
} from "../http/userAPI";

import { fetchUserExchangeRequests, createExchangeRequest } from "../http/NonUsedAPI/exchangeAPI"; // Добавьте необходимые методы

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._users = [];
        this._exchangeRequests = [];
        this._userInfo = null
        this._loading = true
        this._purchasedThings = [];
        this._sellerThings = [];
        this._pendingThings = [];
        makeAutoObservable(this, 
            {
                setIsAuth: action,
                setUser: action,
                setUsers: action,
                fetchAllUsers: action,
                updateUserRole: action,
                removeUser: action,
                setExchangeRequests: action, 
                loadUserInfo: action,
                updateUserInfo: action,
                setUserInfo: action,
                setLoading: action,
                loadPurchasedThings: action,
                setSellerThings: action,
                setPendingThings: action,
                fetchSellerThings: action,
                createThing: action,
                updateThing: action,
                deleteThing: action,
                fetchPendingThings: action,
                approveThing: action,
                rejectThing: action,
                deleteThingAsAdmin: action,
                logout: action,
            }
        )
    }

    setIsAuth(bool) {
        console.log("Setting isAuth:", bool);  // Логируем изменение статуса аутентификации
        this._isAuth = bool
    }
    setUser(user) {
        console.log("Setting user:", user);  // Логируем изменение данных пользователя
        this._user = user
    }

    setUsers(users) {
        this._users = users;
    }

    setExchangeRequests(exchangeRequests) {
        this._exchangeRequests = exchangeRequests;
    }

    setPurchasedThings(purchasedThings) {
        this._purchasedThings = purchasedThings;
    }

    setUserInfo(userInfo) {
        this._userInfo = userInfo;
    }
    setLoading(loading) {
        this._loading = loading;
    }
    setSellerThings(things) {
        this._sellerThings = things;
    }
    setPendingThings(things) {
        this._pendingThings = things;
    }


    logout() {
        console.log("Logging out");  // Логируем выход из аккаунта
        this._isAuth = false;
        this._user = {};
        localStorage.removeItem('token');  // Удаляем токен из локального хранилища
    }

    async fetchAllUsers() {
        try {
            const users = await fetchUsers();
            this.setUsers(users);
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    }


    // Добавьте новый метод
    async telegramLogin(initData) {
        try {
            const data = await telegramAuth(initData);
            runInAction(() => {
                this.setUser(data);
                this.setIsAuth(true);
            });
        } catch (error) {
            console.error("Error during Telegram authentication:", error);
        }
    }


    // Метод для загрузки информации о пользователе
    async loadUserInfo() {
        this.setLoading(true);
        try {
            const data = await fetchMyInfo(); 
            runInAction(() => {
                this._userInfo = data;
                this.setLoading(false);
            });
        } catch (error) {
            console.error('Error loading user info:', error);
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    async loadPurchasedThings() {
        this.setLoading(true);
        try {
          const data = await fetchMyPurchasedThings();
          runInAction(() => {
            this._purchasedThings = data;
            this.setLoading(false);
          });
        } catch (error) {
          console.error('Error loading purchased things:', error);
          runInAction(() => {
            this.setLoading(false);
          });
        }
      }
    // Метод для обновления информации о пользователе после действия
    updateUserInfo(updatedData) {
        this._userInfo = { ...this._userInfo, ...updatedData };
    }

    async fetchExchangeRequests() {
        try {
            const exchangeRequests = await fetchUserExchangeRequests();
            runInAction(() => {
                this.setExchangeRequests(exchangeRequests);
            });
        } catch (error) {
            console.error("Error fetching exchange requests:", error);
        }
    }

    async createExchangeRequest(orderThingId, newThingId, userComment) {
        try {
            const exchangeRequest = await createExchangeRequest(orderThingId, newThingId, userComment);
            runInAction(() => {
                this._exchangeRequests.push(exchangeRequest);
            });
            return exchangeRequest;
        } catch (error) {
            console.error("Error creating exchange request:", error);
            throw error;
        }
    }

    async searchUserByEmail(email) {
        try {
            const user = await getUserByEmail(email);
            return user;
        } catch (error) {
            console.error("Error fetching user by email:", error);
        }
    }

    async getUserById(id) {
        try {
            const user = await getUserById(id);
            return user;
        } catch (error) {
            console.error("Error fetching user by id:", error);
        }
    }

    async updateUserRole(userId, newRole) {
        try {
            const result = await changeUserRole(userId, newRole);
            this.fetchAllUsers();  // Обновляем пользователей после изменения роли
            return result;
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    }

    async removeUser(userId) {
        try {
            const result = await deleteUser(userId);
            this.fetchAllUsers();  // Обновляем пользователей после удаления
            return result;
        } catch (error) {
            console.error("Error removing user:", error);
        }
    }

    async fetchSellerThings() {
        try {
            const data = await fetchSellerThings();
            runInAction(() => {
                this.setSellerThings(data);
            });
        } catch (error) {
            console.error("Error fetching seller things:", error);
        }
    }

    async createThing(formData) {
        try {
            const data = await createThingAsSeller(formData);
            runInAction(() => {
                this._sellerThings.push(data.thing);
            });
            return data;
        } catch (error) {
            console.error("Error creating thing:", error);
            throw error;
        }
    }

    async updateThing(thingId, formData) {
        try {
            const data = await updateThingAsSeller(thingId, formData);
            runInAction(() => {
                const index = this._sellerThings.findIndex(thing => thing.id === thingId);
                if (index !== -1) {
                    this._sellerThings[index] = data.thing;
                }
            });
            return data;
        } catch (error) {
            console.error("Error updating thing:", error);
            throw error;
        }
    }

    async deleteThing(thingId) {
        try {
            await deleteThingAsSeller(thingId);
            runInAction(() => {
                this._sellerThings = this._sellerThings.filter(thing => thing.id !== thingId);
            });
        } catch (error) {
            console.error("Error deleting thing:", error);
            throw error;
        }
    }


    async fetchPendingThings() {
        try {
            const data = await fetchPendingThings();
            runInAction(() => {
                this.setPendingThings(data);
            });
        } catch (error) {
            console.error("Error fetching pending things:", error);
        }
    }

    async approveThing(thingId) {
        try {
            await approveThing(thingId);
            runInAction(() => {
                this._pendingThings = this._pendingThings.filter(thing => thing.id !== thingId);
            });
        } catch (error) {
            console.error("Error approving thing:", error);
        }
    }

    async rejectThing(thingId, rejectionReason) {
        try {
            await rejectThing(thingId, rejectionReason);
            runInAction(() => {
                this._pendingThings = this._pendingThings.filter(thing => thing.id !== thingId);
            });
        } catch (error) {
            console.error("Error rejecting thing:", error);
        }
    }

    async deleteThingAsAdmin(thingId) {
        try {
            await deleteThingAsAdmin(thingId);
            runInAction(() => {
                this._pendingThings = this._pendingThings.filter(thing => thing.id !== thingId);
            });
        } catch (error) {
            console.error("Error deleting thing as admin:", error);
        }
    }

    get users() {
        return this._users;
    }

    get exchangeRequests() {
        return this._exchangeRequests;
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    get userInfo() {
        return this._userInfo;
    }
    get loading() {
        return this._loading;
    }
    get purchasedThings() {
        return this._purchasedThings;
      }

    get sellerThings() {
        return this._sellerThings;
    }
    get pendingThings() {
        return this._pendingThings;
    }
}

