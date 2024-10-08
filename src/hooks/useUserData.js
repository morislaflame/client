// hooks/useUserData.js
import { useEffect, useState } from 'react';
import { getUserById, fetchMyInfo } from '../http/userAPI';
import { message } from 'antd';

const useUserData = (id) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let data;
        if (id) {
          data = await getUserById(id);
        } else {
          data = await fetchMyInfo();
        }
        console.log('полученные данные', data);
        setUserData(data);
      } catch (error) {
        message.error('Ошибка при получении данных пользователя:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  return { userData, loading };
};

export default useUserData;
