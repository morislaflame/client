import { $authHost, $host } from './index';

export const createStory = async (story) => {
    const { data } = await $authHost.post('api/story', story);
    return data;
};

export const fetchStories = async () => {
    const { data } = await $host.get('api/story');
    return data;
};