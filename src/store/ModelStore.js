// store/ModelStore.js

import { makeAutoObservable, runInAction, action } from "mobx";
import { 
    fetchModelProducts, 
    fetchModelProductById, 
    fetchPriceRange, 
    fetchAdultPlatforms, 
    fetchCountries,
} from "../http/modelProductAPI";
import { 
    fetchBasket, 
    addToBasket, 
    removeFromBasket, 
    clearBasket, 
    applyPromoCode, 
    removePromoCode, 
} from "../http/basketAPI";
import { fetchUserPromoCodes } from "../http/userAPI"; // Предполагается, что такая функция существует

export default class ModelStore {
    // Состояния
    modelProducts = [];
    modelProduct = {};
    priceRange = { min: 0, max: 10000 };
    adultPlatforms = [];
    countries = [];
    page = 1;
    totalCount = 0;
    limit = 20;
    basket = [];
    promoCode = null;
    discount = 0;
    userPromoCodes = [];

    // Загрузка состояний
    isLoadingModelProducts = false;
    isLoadingModelProduct = false;
    isLoadingPriceRange = false;
    isLoadingAdultPlatforms = false;
    isLoadingCountries = false;
    isLoadingBasket = false;
    isLoadingPromoCodes = false;
    isLoadingUserPromoCodes = false;

    constructor() {
        makeAutoObservable(this, {
            // Методы, которые должны быть действиями
            loadModelProducts: action,
            loadModelProductById: action,
            loadPriceRange: action,
            loadAdultPlatforms: action,
            loadCountries: action,
            loadBasket: action,
            addToBasket: action,
            removeFromBasket: action,
            clearBasket: action,
            applyPromoCode: action,
            removePromoCode: action,
            loadUserPromoCodes: action,
        });
    }

    // Загрузка списка модельных продуктов
    loadModelProducts = async (typeId, brandIds, page = 1, limit = 20, minPrice = 0, maxPrice = 10000) => {
        this.isLoadingModelProducts = true;
        try {
            const data = await fetchModelProducts(typeId, brandIds, page, limit, minPrice, maxPrice);
            runInAction(() => {
                this.modelProducts = data.items || [];
                this.totalCount = data.totalCount || 0;
                this.page = page;
                this.limit = limit;
            });
        } catch (error) {
            console.error("Error fetching model products:", error);
        } finally {
            runInAction(() => {
                this.isLoadingModelProducts = false;
            });
        }
    };

    // Загрузка отдельного модельного продукта по ID
    loadModelProductById = async (modelProductId) => {
        this.isLoadingModelProduct = true;
        try {
            const data = await fetchModelProductById(modelProductId);
            runInAction(() => {
                this.modelProduct = data;
            });
        } catch (error) {
            console.error("Error fetching model product by ID:", error);
        } finally {
            runInAction(() => {
                this.isLoadingModelProduct = false;
            });
        }
    };

    // Загрузка диапазона цен
    loadPriceRange = async () => {
        this.isLoadingPriceRange = true;
        try {
            const data = await fetchPriceRange();
            runInAction(() => {
                this.priceRange = data;
            });
        } catch (error) {
            console.error("Error fetching price range:", error);
        } finally {
            runInAction(() => {
                this.isLoadingPriceRange = false;
            });
        }
    };

    // Загрузка платформ для взрослых
    loadAdultPlatforms = async () => {
        this.isLoadingAdultPlatforms = true;
        try {
            const data = await fetchAdultPlatforms();
            runInAction(() => {
                this.adultPlatforms = data;
            });
        } catch (error) {
            console.error("Error fetching adult platforms:", error);
        } finally {
            runInAction(() => {
                this.isLoadingAdultPlatforms = false;
            });
        }
    };

    // Загрузка стран
    loadCountries = async () => {
        this.isLoadingCountries = true;
        try {
            const data = await fetchCountries();
            runInAction(() => {
                this.countries = data;
            });
        } catch (error) {
            console.error("Error fetching countries:", error);
        } finally {
            runInAction(() => {
                this.isLoadingCountries = false;
            });
        }
    };

    // Загрузка корзины
    loadBasket = async () => {
        this.isLoadingBasket = true;
        try {
            const data = await fetchBasket();
            runInAction(() => {
                this.basket = data.items || [];
                this.promoCode = data.promoCode || null;
                this.discount = data.discount || 0;
            });
        } catch (error) {
            console.error('Error loading basket:', error);
        } finally {
            runInAction(() => {
                this.isLoadingBasket = false;
            });
        }
    };

    // Добавление товара в корзину
    addToBasket = async (modelProductId) => {
        try {
            await addToBasket(modelProductId);
            await this.loadBasket();
        } catch (error) {
            console.error('Error adding to basket:', error);
            throw error;
        }
    };

    // Удаление товара из корзины
    removeFromBasket = async (basketItemId) => {
        try {
            await removeFromBasket(basketItemId);
            runInAction(() => {
                this.basket = this.basket.filter(item => item.id !== basketItemId);
            });
        } catch (error) {
            console.error('Error removing from basket:', error);
        }
    };

    // Очистка корзины
    clearBasket = async () => {
        try {
            await clearBasket();
            runInAction(() => {
                this.basket = [];
                this.promoCode = null;
                this.discount = 0;
            });
        } catch (error) {
            console.error('Error clearing basket:', error);
        }
    };

    // Применение промокода
    applyPromoCode = async (code) => {
        try {
            const data = await applyPromoCode(code);
            runInAction(() => {
                this.promoCode = data.promoCode;
                this.discount = data.discount;
            });
            await this.loadBasket(); // Обновляем данные корзины
            return { success: true };
        } catch (error) {
            console.error('Error applying promo code:', error);
            const message = error.response?.data?.message || 'Error applying promo code';
            return { success: false, message };
        }
    };

    // Удаление промокода
    removePromoCode = async () => {
        try {
            await removePromoCode();
            runInAction(() => {
                this.promoCode = null;
                this.discount = 0;
            });
            await this.loadBasket();
        } catch (error) {
            console.error('Error removing promo code:', error);
        }
    };

    // Загрузка пользовательских промокодов
    loadUserPromoCodes = async () => {
        this.isLoadingUserPromoCodes = true;
        try {
            const promoCodes = await fetchUserPromoCodes();
            runInAction(() => {
                this.userPromoCodes = promoCodes;
            });
        } catch (error) {
            console.error('Error loading user promo codes:', error);
        } finally {
            runInAction(() => {
                this.isLoadingUserPromoCodes = false;
            });
        }
    };

    // Проверка, находится ли товар в корзине
    isItemInBasket = (modelProductId) => {
        return this.basket.some(item => item.id === Number(modelProductId));
    };

    // Геттеры

    get getModelProducts() {
        return this.modelProducts;
    }

    get getModelProduct() {
        return this.modelProduct;
    }

    get getPriceRange() {
        return this.priceRange;
    }

    get getAdultPlatforms() {
        return this.adultPlatforms;
    }

    get getCountries() {
        return this.countries;
    }

    get getPage() {
        return this.page;
    }

    get getTotalCount() {
        return this.totalCount;
    }

    get getLimit() {
        return this.limit;
    }

    get getBasket() {
        return this.basket;
    }

    get getPromoCode() {
        return this.promoCode;
    }

    get getDiscount() {
        return this.discount;
    }

    get getUserPromoCodes() {
        return this.userPromoCodes;
    }

    get getTotalPrice() {
        const total = this.basket.reduce((sum, item) => sum + item.price, 0);
        const discountedTotal = total - this.discount;
        return discountedTotal >= 0 ? discountedTotal : 0;
    }

    // Сеттеры (если необходимы)
    setPage = (page) => {
        this.page = page;
    };

    setTotalCount = (count) => {
        this.totalCount = count;
    };

    setLimit = (limit) => {
        this.limit = limit;
    };

    setPriceRange = (priceRange) => {
        this.priceRange = priceRange;
        this.setPage(1);
    };
}
