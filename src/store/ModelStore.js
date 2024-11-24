// store/ModelStore.js

import { makeAutoObservable, runInAction } from "mobx";
import {
    fetchBasket,
    addToBasket,
    removeFromBasket,
    clearBasket
} from "../http/basketAPI";

export default class ModelStore {
    countries = [];
    adultPlatforms = [];
    modelProducts = [];
    selectedCountry = {};
    selectedAdultPlatforms = [];
    page = 1;
    totalCount = 0;
    limit = 20;
    basket = [];
    priceRange = { min: 0, max: 10000 };

    constructor() {
        makeAutoObservable(this);
    }

    loadBasket = async () => {
        try {
            const data = await fetchBasket();
            runInAction(() => {
                this.basket = data || [];
            });
        } catch (error) {
            console.error('Error loading basket:', error);
        }
    }

    addToBasket = async (modelProductId) => {
        try {
            await addToBasket(modelProductId);
            await this.loadBasket();
        } catch (error) {
            console.error('Error adding to basket:', error);
        }
    }

    removeFromBasket = async (basketItemId) => {
        try {
            await removeFromBasket(basketItemId);
            runInAction(() => {
                this.basket = this.basket.filter(item => item.id !== basketItemId);
            });
        } catch (error) {
            console.error('Error removing from basket:', error);
        }
    }

    clearBasket = async () => {
        try {
            await clearBasket();
            await this.loadBasket();
        } catch (error) {
            console.error('Error clearing basket:', error);
        }
    }

    isItemInBasket(modelProductId) {
        return this.basket.some(item => item.modelProductId === Number(modelProductId));
    }
    

    // getters and setters

    setCountries(countries) {
        this.countries = countries;
    }

    setAdultPlatforms(adultPlatforms) {
        this.adultPlatforms = adultPlatforms;
    }

    setModelProducts(modelProducts) {
        this.modelProducts = modelProducts;
    }

    setSelectedCountry(country) {
        this.setPage(1);
        this.selectedCountry = country;
    }

    setSelectedAdultPlatforms(adultPlatforms) {
        this.setPage(1);
        this.selectedAdultPlatforms = adultPlatforms;
    }

    setPage(page) {
        this.page = page;
    }

    setTotalCount(count) {
        this.totalCount = count;
    }

    setPriceRange(priceRange) {
        this.setPage(1);
        this.priceRange = priceRange;
    }

    
}
