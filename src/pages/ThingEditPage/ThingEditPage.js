import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOneThing, updateThing, fetchTypes, fetchBrands } from '../../http/thingAPI';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Button, Form, Input, InputNumber, Select, Upload, message, Checkbox } from 'antd';
import { MAIN_ROUTE } from '../../utils/consts';
import styles from './ThingEditPage.module.css';
import BackButton from '../../components/BackButton/BackButton';
import { UploadOutlined } from '@ant-design/icons';
import { fetchScouts } from '../../http/scoutAPI';

const { Option } = Select;

const ThingEditPage = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const [form] = Form.useForm();

  const [thing, setThing] = useState({
    name: '',
    price: '',
    typeId: '',
    brandIds: [],
    info: {},
    images: [],
  });

  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [scouts, setScouts] = useState([]);
const [isScoutModel, setIsScoutModel] = useState(false);
const [loading, setLoading] = useState(false); // Добавляем состояние для загрузки


useEffect(() => {
  const loadData = async () => {
    const data = await fetchOneThing(id);
    const brandIds = data.brands ? data.brands.map(brand => brand.id) : [];
    setThing({ ...data, brandIds });
    form.setFieldsValue({
      name: data.name,
      price: data.price,
      typeId: data.typeId,
      brandIds: brandIds,
      ...data.info,
      isScoutModel: data.isScoutModel,
      scoutId: data.scoutId,
    });
    setIsScoutModel(data.isScoutModel); // Устанавливаем начальное значение
  };

  loadData();
  fetchTypes().then(data => setTypes(data));
  fetchBrands().then(data => setBrands(data));
  fetchScouts().then(data => setScouts(data)); // Загружаем список скаутов
}, [id, form]);


const handleValuesChange = (changedValues, allValues) => {
  if ('isScoutModel' in changedValues) {
    setIsScoutModel(changedValues.isScoutModel);
  }
  setThing(prevThing => ({
    ...prevThing,
    ...allValues,
    info: { ...prevThing.info, ...allValues },
  }));
};


  const handleImageChange = ({ fileList }) => {
    setNewImages(fileList);
  };

  const handleRemoveImage = (imageId) => {
    setImagesToRemove([...imagesToRemove, imageId]);
    setThing({
      ...thing,
      images: thing.images.filter(image => image.id !== imageId),
    });
  };

  const handleSubmit = async () => {
    setLoading(true); // Устанавливаем состояние загрузки в true
    try {
      const values = await form.validateFields();
  
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('price', values.price);
      formData.append('typeId', values.typeId);
      formData.append('brandIds', JSON.stringify(values.brandIds));
      formData.append('info', JSON.stringify(thing.info));
      formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
      formData.append('isScoutModel', values.isScoutModel);
  
      if (values.isScoutModel && values.scoutId) {
        formData.append('scoutId', values.scoutId);
      }
  
      newImages.forEach(file => {
        formData.append('img', file.originFileObj);
      });
  
      await updateThing(id, formData);
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
        <h2>Редактирование модели</h2>
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
          name="price"
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
          name="typeId"
          label="Страна"
          rules={[{ required: true, message: 'Выберите страну модели!' }]}
        >
          <Select placeholder="Выберите страну">
            {types.map(type => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="brandIds"
          label="Платформы"
          rules={[{ required: true, message: 'Выберите хотя бы один платформу!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Выберите платформы"
            onChange={(value) =>
              setThing(prevThing => ({ ...prevThing, brandIds: value }))
            }
          >
            {brands.map(brand => (
              <Option key={brand.id} value={brand.id}>
                {brand.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="isScoutModel"
          label="Модель является скаутской?"
          valuePropName="checked"
        >
          <Checkbox
            checked={isScoutModel}
            onChange={(e) => {
              setIsScoutModel(e.target.checked);
              form.setFieldsValue({ isScoutModel: e.target.checked });
              if (!e.target.checked) {
                form.setFieldsValue({ scoutId: null });
              }
            }}
          />
        </Form.Item>

        {isScoutModel && (
          <Form.Item
            name="scoutId"
            label="Выберите скаута"
            rules={[{ required: true, message: 'Пожалуйста, выберите скаута' }]}
          >
            <Select placeholder="Выберите скаута">
              {scouts.map(scout => (
                <Option value={scout.id} key={scout.id}>
                  {scout.username} (Комиссия: {scout.percentage}%)
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}


        <h3>Информация о модели</h3>
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
          {thing.images.map(image => (
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
