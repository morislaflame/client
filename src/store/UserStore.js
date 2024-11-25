import {makeAutoObservable, action, runInAction } from "mobx";
import {  
    fetchMyInfo, 
    fetchMyPurchasedThings,
    telegramAuth,
    becomeSeller
} from "../http/userAPI";


export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._users = [];
        this._userInfo = null
        this._loading = true
        this._purchasedThings = [];
        makeAutoObservable(this, 
            {
                setIsAuth: action,
                setUser: action,
                setUsers: action,
                loadUserInfo: action,
                updateUserInfo: action,
                setUserInfo: action,
                setLoading: action,
                loadPurchasedThings: action,
                logout: action,
                becomeSeller: action,
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

    setPurchasedThings(purchasedThings) {
        this._purchasedThings = purchasedThings;
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

    // Добавляем новый метод
    async becomeSeller(sellerData) {
        this.setLoading(true);
        try {
            const data = await becomeSeller(sellerData);
            runInAction(() => {
                // Обновляем роль пользователя и токен
                this.setUser({ ...this._user, role: 'SELLER' });
                this.updateUserInfo(data);
                this.setLoading(false);
            });
            return data;
        } catch (error) {
            console.error('Error becoming seller:', error);
            runInAction(() => {
                this.setLoading(false);
            });
            throw error;
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

    get userInfo() {
        return this._userInfo;
    }
    get loading() {
        return this._loading;
    }
    get purchasedThings() {
        return this._purchasedThings;
      }
}

