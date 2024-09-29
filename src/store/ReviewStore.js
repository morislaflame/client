// store/ReviewStore.js

import { makeAutoObservable, runInAction } from "mobx";
import {
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
    fetchCommentsByReview,
    createComment,
    updateComment,
    deleteComment,
} from "../http/reviewAPI";

class ReviewStore {
    reviews = [];
    reviewPage = 1;
    reviewLimit = 5;
    reviewLoading = false;
    hasMoreReviews = true; // Флаг наличия дополнительных отзывов для загрузки

    comments = {}; // { [reviewId]: { items: [], page: 1, limit: 5, loading: false, hasMore: true } }
    commentLimit = 2;

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

    // Загрузка комментариев
    async loadComments(reviewId, page = 1, limit = this.commentLimit, append = false) {
        if (!this.comments[reviewId]) {
            this.comments[reviewId] = {
                items: [],
                page: 1,
                limit: this.commentLimit,
                loading: false,
                hasMore: true,
            };
        }

        if (this.comments[reviewId].loading || !this.comments[reviewId].hasMore) return;

        this.comments[reviewId].loading = true;
        try {
            const data = await fetchCommentsByReview(reviewId, page, limit);
            runInAction(() => {
                if (append) {
                    this.comments[reviewId].items = [...this.comments[reviewId].items, ...data.rows];
                } else {
                    this.comments[reviewId].items = data.rows;
                }
                this.comments[reviewId].page = page;
                this.comments[reviewId].hasMore = data.rows.length === limit;
            });
        } catch (error) {
            console.error('Ошибка при загрузке комментариев:', error);
        } finally {
            runInAction(() => {
                this.comments[reviewId].loading = false;
            });
        }
    }

    // Загрузка дополнительных комментариев (по кнопке "Загрузить ещё")
    async loadMoreComments(reviewId) {
        if (!this.comments[reviewId]) {
            await this.loadComments(reviewId);
            return;
        }
        const nextPage = this.comments[reviewId].page + 1;
        await this.loadComments(reviewId, nextPage, this.commentLimit, true);
    }

    // Добавление комментария
    async addComment(reviewId, text, images = []) {
        try {
            const newComment = await createComment(reviewId, text, images);
            runInAction(() => {
                if (!this.comments[reviewId]) {
                    this.comments[reviewId] = {
                        items: [],
                        page: 1,
                        limit: this.commentLimit,
                        loading: false,
                        hasMore: true,
                    };
                }
                this.comments[reviewId].items.unshift(newComment);
            });
        } catch (error) {
            console.error('Ошибка при создании комментария:', error);
            throw error;
        }
    }

    // Обновление комментария
    async editComment(id, reviewId, text) {
        try {
            const updatedComment = await updateComment(id, text);
            runInAction(() => {
                const commentList = this.comments[reviewId]?.items || [];
                const index = commentList.findIndex((comment) => comment.id === id);
                if (index !== -1) {
                    commentList[index] = updatedComment;
                }
            });
        } catch (error) {
            console.error('Ошибка при обновлении комментария:', error);
        }
    }

    // Удаление комментария
    async removeComment(id, reviewId) {
        try {
            await deleteComment(id);
            runInAction(() => {
                const commentList = this.comments[reviewId]?.items || [];
                this.comments[reviewId].items = commentList.filter((comment) => comment.id !== id);
            });
        } catch (error) {
            console.error('Ошибка при удалении комментария:', error);
        }
    }
}

export default ReviewStore;
