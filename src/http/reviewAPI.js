import { $authHost, $host } from "./index";

// Получение всех отзывов с пагинацией
export const fetchReviews = async (page = 1, limit = 10) => {
    const { data } = await $host.get('api/review', { params: { page, limit } });
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

    const { data } = await $authHost.post('api/review', formData);
    return data;
};

// Обновление отзыва
export const updateReview = async (id, text, rating) => {
    const { data } = await $authHost.put(`api/review/${id}`, { text, rating });
    return data;
};

// Удаление отзыва
export const deleteReview = async (id) => {
    const { data } = await $authHost.delete(`api/review/${id}`);
    return data;
};



