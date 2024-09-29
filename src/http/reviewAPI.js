import { $authHost, $host } from "./index";

// Получение всех отзывов с пагинацией
export const fetchReviews = async (page = 1, limit = 10) => {
    const { data } = await $host.get('api/reviews', { params: { page, limit } });
    return data;
};

// Создание нового отзыва
export const createReview = async (text, rating, images = []) => {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('rating', rating);
    images.forEach((image) => {
        formData.append('images', image);
    });

    const { data } = await $authHost.post('api/reviews', formData);
    return data;
};

// Обновление отзыва
export const updateReview = async (id, text, rating) => {
    const { data } = await $authHost.put(`api/reviews/${id}`, { text, rating });
    return data;
};

// Удаление отзыва
export const deleteReview = async (id) => {
    const { data } = await $authHost.delete(`api/reviews/${id}`);
    return data;
};

// Получение комментариев к отзыву с пагинацией
export const fetchCommentsByReview = async (reviewId, page = 1, limit = 10) => {
    const { data } = await $host.get(`api/comments/review/${reviewId}`, {
        params: {
            page,
            limit,
        },
    });
    return data;
};

// Создание нового комментария
export const createComment = async (reviewId, text, images = []) => {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('reviewId', reviewId);
    images.forEach((image) => {
        formData.append('images', image);
    });

    const { data } = await $authHost.post('api/comments', formData);
    return data;
};

// Обновление комментария
export const updateComment = async (id, text) => {
    const { data } = await $authHost.put(`api/comments/${id}`, { text });
    return data;
};

// Удаление комментария
export const deleteComment = async (id) => {
    const { data } = await $authHost.delete(`api/comments/${id}`);
    return data;
};
