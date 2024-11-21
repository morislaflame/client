// store/ReviewStore.js

import { makeAutoObservable, runInAction } from "mobx";
import {
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
} from "../http/reviewAPI";

class ReviewStore {
    reviews = [];
    reviewPage = 1;
    reviewLimit = 5;
    reviewLoading = false;
    hasMoreReviews = true; // Флаг наличия дополнительных отзывов для загрузки


    constructor() {
        makeAutoObservable(this);
    }

    // Загрузка отзывов
    async loadReviews(page = 1, limit = this.reviewLimit, append = false) {
        if (this.reviewLoading) return;
        this.reviewLoading = true;
        try {
            const data = await fetchReviews(page, limit);
            runInAction(() => {
                if (append) {
                    this.reviews = [...this.reviews, ...data.rows];
                } else {
                    this.reviews = data.rows;
                }
                this.reviewPage = page;
                this.hasMoreReviews = data.rows.length === limit;
            });
        } catch (error) {
            console.error('Ошибка при загрузке отзывов:', error);
        } finally {
            runInAction(() => {
                this.reviewLoading = false;
            });
        }
    }

    // Загрузка дополнительных отзывов (по кнопке "Загрузить ещё")
    async loadMoreReviews() {
        if (this.reviewLoading || !this.hasMoreReviews) return;
        const nextPage = this.reviewPage + 1;
        await this.loadReviews(nextPage, this.reviewLimit, true);
    }

    // Добавление отзыва
    async addReview(text, rating, images = []) {
        try {
            const newReview = await createReview(text, rating, images);
            runInAction(() => {
                this.reviews.unshift(newReview);
            });
        } catch (error) {
            console.error('Ошибка при создании отзыва:', error);
            throw error;
        }
    }

    // Обновление отзыва
    async editReview(id, text, rating) {
        try {
            const updatedReview = await updateReview(id, text, rating);
            runInAction(() => {
                const index = this.reviews.findIndex((review) => review.id === id);
                if (index !== -1) {
                    this.reviews[index] = updatedReview;
                }
            });
        } catch (error) {
            console.error('Ошибка при обновлении отзыва:', error);
        }
    }

    // Удаление отзыва
    async removeReview(id) {
        try {
            await deleteReview(id);
            runInAction(() => {
                this.reviews = this.reviews.filter((review) => review.id !== id);
            });
        } catch (error) {
            console.error('Ошибка при удалении отзыва:', error);
        }
    }

}

export default ReviewStore;
