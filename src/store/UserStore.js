import {makeAutoObservable, action} from "mobx";
import { fetchUsers, getUserByEmail, changeUserRole, deleteUser } from "../http/userAPI";

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._users = [];
        makeAutoObservable(this, 
            {
                setUsers: action,
                fetchAllUsers: action,
                updateUserRole: action,
                removeUser: action
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

    async searchUserByEmail(email) {
        try {
            const user = await getUserByEmail(email);
            return user;
        } catch (error) {
            console.error("Error fetching user by email:", error);
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

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }
}