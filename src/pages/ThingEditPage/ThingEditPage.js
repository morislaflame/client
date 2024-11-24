import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchModelProductById, fetchCountries, fetchAdultPlatforms } from '../../http/modelProductAPI';
import { updateModelProduct } from '../../http/sellerAPI';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Button, Form, Input, InputNumber, Select, Upload, message, Checkbox } from 'antd';
import { MAIN_ROUTE } from '../../utils/consts';
import styles from './ThingEditPage.module.css';
import BackButton from '../../components/UI/BackButton/BackButton';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const ThingEditPage = observer(() => {
  const { id } = useParams();
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [model, setModel] = useState({
    name: '',
    priceUSD: '',
    countryId: '',
    adultPlatformIds: [],
    info: {},
    images: [],
  });

  const [countries, setCountries] = useState([]);
  const [adultPlatforms, setAdultPlatforms] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
const [loading, setLoading] = useState(false); // Добавляем состояние для загрузки


useEffect(() => {
  const loadData = async () => {
    const data = await fetchModelProductById(id);
    const adultPlatformIds = data.adultPlatforms ? data.adultPlatforms.map(adultPlatform => adultPlatform.id) : [];
    setModel({ ...data, adultPlatformIds });
    form.setFieldsValue({
      name: data.name,
      priceUSD: data.priceUSD,
      countryId: data.countryId,
      adultPlatformIds: adultPlatformIds,
      ...data.info,
    });
  };

  loadData();
  fetchCountries().then(data => setCountries(data));
  fetchAdultPlatforms().then(data => setAdultPlatforms(data));
}, [id, form]);


const handleValuesChange = (changedValues, allValues) => {
  setModel(prevModel => ({
    ...prevModel,
    ...allValues,
    info: { ...prevModel.info, ...allValues },
  }));
};


  const handleImageChange = ({ fileList }) => {
    setNewImages(fileList);
  };

  const handleRemoveImage = (imageId) => {
    setImagesToRemove([...imagesToRemove, imageId]);
    setModel({
      ...model,
      images: model.images.filter(image => image.id !== imageId),
    });
  };

  const handleSubmit = async () => {
    setLoading(true); // Устанавливаем состояние загрузки в true
    try {
      const values = await form.validateFields();
  
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('priceUSD', values.priceUSD);
      formData.append('countryId', values.countryId);
      formData.append('adultPlatformIds', JSON.stringify(values.adultPlatformIds));
      formData.append('info', JSON.stringify(model.info));
      formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
  
      newImages.forEach(file => {
        formData.append('img', file.originFileObj);
      });
  
      await updateModelProduct(id, formData);
      message.success('Товар успешно обновлён');
      navigate(`/thing/${id}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error('Ошибка при обновлении товара: ' + errorMessage);
    } finally {
      setLoading(false); // Возвращаем состояние загрузки в false
    }
  };
  

  if (!user.isAuth || user.user.role !== 'ADMIN') {
    navigate(MAIN_ROUTE);
    return null;
  }

  const infoFields = [
    { name: 'age', label: 'Age' },
    { name: 'smartphone', label: 'Smartphone' },
    { name: 'percent', label: '% For Her' },
    { name: 'time', label: 'Time Per Day' },
    { name: 'english', label: 'English Skills' },
    { name: 'content', label: 'Content' },
    { name: 'contract', label: 'Contract Signed' },
    { name: 'start', label: 'When She Can Start' },
    { name: 'socialmedia', label: 'Social Media Set Up' },
    { name: 'tiktok', label: 'Willing To Do TikTok' },
    { name: 'cblocked', label: 'Does She Need Any Countries Blocked' },
    { name: 'ofverif', label: 'OF Verified' },
    { name: 'link', label: 'Link' },
    { name: 'girlmsg', label: 'Girl Message', as: 'textarea' },
  ];

  return (
    <div className={styles.edit_page}>
      <div className={styles.topic_back}>
        <BackButton />
        <h2>Editing</h2>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Имя"
          rules={[{ required: true, message: 'Введите имя модели!' }]}
        >
          <Input placeholder="Введите имя модели" />
        </Form.Item>

        <Form.Item
          name="priceUSD"
          label="Цена"
          rules={[{ required: true, message: 'Введите цену модели!' }]}
        >
          <InputNumber
            min={0}
            placeholder="Введите цену модели"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="countryId"
          label="Страна"
          rules={[{ required: true, message: 'Выберите страну модели!' }]}
        >
          <Select placeholder="Выберите страну">
            {countries.map(country => (
              <Option key={country.id} value={country.id}>
                {country.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="adultPlatformIds"
          label="Платформы"
          rules={[{ required: true, message: 'Выберите хотя бы один платформу!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Выберите платформы"
            onChange={(value) =>
              setModel(prevModel => ({ ...prevModel, adultPlatformIds: value }))
            }
          >
            {adultPlatforms.map(adultPlatform => (
              <Option key={adultPlatform.id} value={adultPlatform.id}>
                {adultPlatform.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {infoFields.map(field => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
          >
            {field.as === 'textarea' ? (
              <Input.TextArea rows={4} placeholder={`Введите ${field.label}`} />
            ) : (
              <Input placeholder={`Введите ${field.label}`} />
            )}
          </Form.Item>
        ))}

        <h3>Изображения</h3>
        <div className={styles.existingImages}>
          {model.images.map(image => (
            <div key={image.id} className={styles.photo}>
              <img
                src={process.env.REACT_APP_API_URL + image.img}
                alt="Текущее изображение"
                className={styles.photos}
              />
              <Button
                danger
                onClick={() => handleRemoveImage(image.id)}
                style={{ marginTop: '10px' }}
              >
                Удалить
              </Button>
            </div>
          ))}
        </div>

        <Form.Item label="Добавить новые изображения">
          <Upload
            listType="picture"
            multiple
            beforeUpload={() => false}
            onChange={handleImageChange}
            fileList={newImages}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Загрузить изображения</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Сохранить изменения
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default ThingEditPage;
