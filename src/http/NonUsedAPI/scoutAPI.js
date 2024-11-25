import { $authHost } from "./index";

// Получение списка всех скаутов
export const fetchScouts = async () => {
    const { data } = await $authHost.get('api/scouts');
    return data;
};

// Создание нового скаута (если потребуется)
export const createScout = async (scout) => {
    const { data } = await $authHost.post('api/scouts', scout);
    return data;
};

// Обновление скаута (если потребуется)
export const updateScout = async (id, scout) => {
    const { data } = await $authHost.put(`api/scouts/${id}`, scout);
    return data;
};

// Удаление скаута (если потребуется)
export const deleteScout = async (id) => {
    const { data } = await $authHost.delete(`api/scouts/${id}`);
    return data;
};
