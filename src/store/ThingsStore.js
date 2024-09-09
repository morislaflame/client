import { makeAutoObservable, action, runInAction } from "mobx";
import { fetchBasket, addToBasket, removeFromBasket, clearBasket } from "../http/basketAPI";

export default class ThingStore {
    constructor() {
        this._types = []
        this._brands = []
        this._things = []
        this._selectedType = {}
        this._selectedBrands = [];
        this._page = 1
        this._totalCount = 0
        this._limit = 6
        this._basket = []
        this._priceRange = { min: 0, max: 10000 }; // Добавляем диапазон цен

        makeAutoObservable(this, {
            addToBasket: action,
            removeFromBasket: action,
            clearBasket: action,
            loadBasket: action,
            resetBasket: action // Добавим метод для сброса корзины
        });
    }

    async loadBasket() {
        const basketData = await fetchBasket();
        runInAction(() => {
            this._basket = basketData.basket_things || [];
        });
    }

    async addToBasket(thingId) {
        const basketThing = await addToBasket(thingId);
        runInAction(() => {
            this._basket.push(basketThing);
        });
    }

    async removeFromBasket(thingId) {
        await removeFromBasket(thingId);
        runInAction(() => {
            this._basket = this._basket.filter(item => item.thingId !== thingId);
        });
    }

    async clearBasket() {
        await clearBasket();
        runInAction(() => {
            this._basket = [];
        });
    }


    setTypes(types) {
        this._types = types
    }

    setBrands(brands) {
        this._brands = brands
    }

    setThings(things) {
        this._things = things;
        this._things.forEach(thing => {
            thing.type = this._types.find(type => type.id === thing.typeId);
        });
    }

    setSelectedType(type) {
        this.setPage(1)
        this._selectedType = type
    }

    setSelectedBrands(brands) {
        this.setPage(1);
        this._selectedBrands = brands;
    }

    setPage(page) {
        this._page = page
    }

    setTotalCount(count) {
        this._totalCount = count
    }

    setPriceRange(priceRange) {
        this._priceRange = priceRange;
        this.setPage(1); // Сбрасываем страницу при фильтрации
        console.log("Price range set in store:", priceRange); // Логируем новый диапазон цен
    }

    resetBasket() {
        this._basket = [];
    }

    // Геттеры для корзины
    get basket() {
        return this._basket;
    }

    get totalBasketAmount() {
        return this._basket.reduce((sum, item) => sum + item.thing.price, 0);
    }

    get types() {
        return this._types
    }

    get brands() {
        return this._brands
    }

    get things() {
        return this._things
    }

    get selectedType() {
        return this._selectedType
    }

    get selectedBrands() {
        return this._selectedBrands;
    }

    get totalCount() {
        return this._totalCount
    }

    get page() {
        return this._page
    }

    get limit() {
        return this._limit
    }

    get priceRange() {
        return this._priceRange;
    }
}
