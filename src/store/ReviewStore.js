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
    comments = {}; // { [reviewId]: { items: [], page: 1, limit: 5, totalCount: 0 } }
    reviewPage = 1;
    reviewLimit = 10;
    reviewTotalCount = 0;
    reviewLoading = false;
    commentLoading = {}; // { [reviewId]: boolean }
    commentLimit = 5; // Лимит для комментариев

    constructor() {
        makeAutoObservable(this);
    }

    // Загрузка отзывов
    async loadReviews(page = 1, limit = this.reviewLimit) {
        this.reviewLoading = true;
        try {
            const data = await fetchReviews(page, limit);
            runInAction(() => {
                this.reviews = data.rows;
                this.reviewTotalCount = data.count;
                this.reviewPage = page;
                this.reviewLimit = limit;
            });
        } catch (error) {
            console.error('Ошибка при загрузке отзывов:', error);
        } finally {
            runInAction(() => {
                this.reviewLoading = false;
            });
        }
    }

    // Добавление отзыва
    async addReview(text, rating, images = []) {
        try {
            const newReview = await createReview(text, rating, images);
            runInAction(() => {
                this.reviews.unshift(newReview);
                this.reviewTotalCount += 1;
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
                this.reviewTotalCount -= 1;
            });
        } catch (error) {
            console.error('Ошибка при удалении отзыва:', error);
        }
    }

    // Загрузка комментариев
    async loadComments(reviewId, page = 1, limit = this.commentLimit) {
        this.commentLoading[reviewId] = true;
        try {
            const data = await fetchCommentsByReview(reviewId, page, limit);
            runInAction(() => {
                this.comments[reviewId] = {
                    items: data.rows,
                    totalCount: data.count,
                    page,
                    limit,
                };
            });
        } catch (error) {
            console.error('Ошибка при загрузке комментариев:', error);
        } finally {
            runInAction(() => {
                this.commentLoading[reviewId] = false;
            });
        }
    }

    // Добавление комментария
    async addComment(reviewId, text, images = []) {
        try {
            const newComment = await createComment(reviewId, text, images);
            runInAction(() => {
                if (!this.comments[reviewId]) {
                    this.comments[reviewId] = {
                        items: [],
                        totalCount: 0,
                        page: 1,
                        limit: this.commentLimit,
                    };
                }
                this.comments[reviewId].items.push(newComment);
                this.comments[reviewId].totalCount += 1;
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
                this.comments[reviewId].totalCount -= 1;
            });
        } catch (error) {
            console.error('Ошибка при удалении комментария:', error);
        }
    }

    // Геттеры и сеттеры
    get page() {
        return this.reviewPage;
    }

    get limit() {
        return this.reviewLimit;
    }

    get totalCount() {
        return this.reviewTotalCount;
    }

    get loading() {
        return this.reviewLoading;
    }

    setPage(page) {
        this.reviewPage = page;
    }

    setReviewLimit(limit) {
        this.reviewLimit = limit;
    }

    setCommentPage(reviewId, page) {
        if (this.comments[reviewId]) {
            this.comments[reviewId].page = page;
        } else {
            this.comments[reviewId] = { items: [], page, limit: this.commentLimit, totalCount: 0 };
        }
    }

    setCommentLimit(limit) {
        this.commentLimit = limit;
    }
}

export default ReviewStore;
