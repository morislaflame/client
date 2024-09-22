import {makeAutoObservable, action, runInAction } from "mobx";
import { fetchUsers, getUserByEmail, changeUserRole, deleteUser, getUserById, fetchMyInfo } from "../http/userAPI";

import { fetchUserExchangeRequests, createExchangeRequest } from "../http/exchangeAPI"; // Добавьте необходимые методы

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._users = [];
        this._exchangeRequests = [];
        this._userInfo = null
        this._loading = true
        makeAutoObservable(this, 
            {
                setUsers: action,
                fetchAllUsers: action,
                updateUserRole: action,
                removeUser: action,
                setExchangeRequests: action, 
                loadUserInfo: action,
                updateUserInfo: action,
                setUserInfo: action,
                setLoading: action,
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

    setUserInfo(userInfo) {
        this._userInfo = userInfo;
    }
    setLoading(loading) {
        this._loading = loading;
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

    // Метод для загрузки информации о пользователе
    async loadUserInfo() {
        this.setLoading(true);
        try {
            const data = await fetchMyInfo(); // Предполагается, что у вас есть этот API вызов
            runInAction(() => {
                this._userInfo = data;
                this.setLoading(false);
            });
        } catch (error) {
            console.error('Ошибка при загрузке информации о пользователе:', error);
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
}




