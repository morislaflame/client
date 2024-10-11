// store/ThingStore.js

import { makeAutoObservable, action, runInAction } from "mobx";
import { fetchBasket, addToBasket, removeFromBasket, clearBasket, applyPromoCode, removePromoCode } from "../http/basketAPI";
import { fetchUserPromoCodes } from "../http/userAPI";

export default class ThingStore {
    constructor() {
        this._types = [];
        this._brands = [];
        this._things = [];
        this._selectedType = {};
        this._selectedBrands = [];
        this._page = 1;
        this._totalCount = 0;
        this._limit = 20;
        this._basket = [];
        this._priceRange = { min: 0, max: 10000 };

        // New properties for promo codes
        this._promoCode = null; // Applied promo code
        this._discount = 0; // Discount amount from promo code
        this._userPromoCodes = []; // User's personal promo codes

        makeAutoObservable(this, {
            addToBasket: action,
            removeFromBasket: action,
            clearBasket: action,
            loadBasket: action,
            applyPromoCode: action,
            removePromoCode: action,
            loadUserPromoCodes: action,
        });
    }

    // Load basket from server
    async loadBasket() {
        try {
            const data = await fetchBasket();
            runInAction(() => {
                this._basket = data.items || [];
                this._promoCode = data.promoCode || null;
                this._discount = data.discount || 0;
            });
        } catch (error) {
            console.error('Ошибка при загрузке корзины:', error);
        }
    }

    // Add item to basket
    async addToBasket(thingId) {
        try {
            await addToBasket(thingId);
            await this.loadBasket();
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            throw error;
        }
    }
    

    // Remove item from basket
    async removeFromBasket(thingId) {
        try {
            await removeFromBasket(thingId);
            runInAction(() => {
                this._basket = this._basket.filter(item => item.id !== thingId);
            });
        } catch (error) {
            console.error('Ошибка при удалении из корзины:', error);
        }
    }

    // Clear basket
    async clearBasket() {
        try {
            await clearBasket();
            runInAction(() => {
                this._basket = [];
                this._promoCode = null;
                this._discount = 0;
            });
        } catch (error) {
            console.error('Ошибка при очистке корзины:', error);
        }
    }

    // Apply promo code
    async applyPromoCode(code) {
        try {
            const data = await applyPromoCode(code);
            runInAction(() => {
                this._promoCode = data.promoCode;
                this._discount = data.discount;
            });
            await this.loadBasket(); // Refresh basket data
            return { success: true };
        } catch (error) {
            console.error('Ошибка при применении промокода:', error);
            const message = error.response?.data?.message || 'Ошибка при применении промокода';
            return { success: false, message };
        }
    }

    // Remove promo code
    async removePromoCode() {
        try {
            await removePromoCode();
            runInAction(() => {
                this._promoCode = null;
                this._discount = 0;
            });
            await this.loadBasket();
        } catch (error) {
            console.error('Ошибка при удалении промокода:', error);
        }
    }

    // Load user's personal promo codes
    async loadUserPromoCodes() {
        try {
            const promoCodes = await fetchUserPromoCodes();
            runInAction(() => {
                this._userPromoCodes = promoCodes;
            });
        } catch (error) {
            console.error('Ошибка при загрузке промокодов пользователя:', error);
        }
    }

    isItemInBasket(thingId) {
        return this._basket.some(item => item.id === Number(thingId));
    }

    // Getters and setters

    get basket() {
        return this._basket;
    }

    get promoCode() {
        return this._promoCode;
    }

    get discount() {
        return this._discount;
    }

    get userPromoCodes() {
        return this._userPromoCodes;
    }

    get totalPrice() {
        const total = this._basket.reduce((sum, item) => sum + item.price, 0);
        const discountedTotal = total - this._discount;
        return discountedTotal >= 0 ? discountedTotal : 0;
    }

    // Existing methods and getters/setters
    setTypes(types) {
        this._types = types;
    }

    setBrands(brands) {
        this._brands = brands;
    }

    setThings(things) {
        this._things = things;
    }

    setSelectedType(type) {
        this.setPage(1);
        this._selectedType = type;
    }

    setSelectedBrands(brands) {
        this.setPage(1);
        this._selectedBrands = brands;
    }

    setPage(page) {
        this._page = page;
    }

    setTotalCount(count) {
        this._totalCount = count;
    }

    setPriceRange(priceRange) {
        this._priceRange = priceRange;
        this.setPage(1);
    }

    get types() {
        return this._types;
    }

    get brands() {
        return this._brands;
    }

    get things() {
        return this._things;
    }

    get selectedType() {
        return this._selectedType;
    }

    get selectedBrands() {
        return this._selectedBrands;
    }

    get totalCount() {
        return this._totalCount;
    }

    get page() {
        return this._page;
    }

    get limit() {
        return this._limit;
    }

    get priceRange() {
        return this._priceRange;
    }
}




