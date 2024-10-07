import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOneThing, updateThing, fetchTypes, fetchBrands } from '../../http/thingAPI';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Button, Form, Input, InputNumber, Select, Upload, message } from 'antd';
import { MAIN_ROUTE } from '../../utils/consts';
import styles from './ThingEditPage.module.css';
import BackButton from '../../components/BackButton/BackButton';
import { UploadOutlined } from '@ant-design/icons';

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

  useEffect(() => {
    fetchOneThing(id).then(data => {
      const brandIds = data.brands ? data.brands.map(brand => brand.id) : [];
      setThing({ ...data, brandIds });
      form.setFieldsValue({
        name: data.name,
        price: data.price,
        typeId: data.typeId,
        brandIds: brandIds,
        ...data.info,
      });
    });
    fetchTypes().then(data => setTypes(data));
    fetchBrands().then(data => setBrands(data));
  }, [id, form]);

  const handleValuesChange = (changedValues, allValues) => {
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
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('price', values.price);
      formData.append('typeId', values.typeId);
      formData.append('brandIds', JSON.stringify(values.brandIds));
      formData.append('info', JSON.stringify(thing.info));
      formData.append('imagesToRemove', JSON.stringify(imagesToRemove));

      newImages.forEach(file => {
        formData.append('img', file.originFileObj);
      });

      await updateThing(id, formData);
      message.success('Товар успешно обновлён');
      navigate(`/thing/${id}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error('Ошибка при обновлении товара: ' + errorMessage);
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
        <h2>Редактирование товара</h2>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Название"
          rules={[{ required: true, message: 'Введите имя товара!' }]}
        >
          <Input placeholder="Введите название товара" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Цена"
          rules={[{ required: true, message: 'Введите цену товара!' }]}
        >
          <InputNumber
            min={0}
            placeholder="Введите цену товара"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="typeId"
          label="Тип"
          rules={[{ required: true, message: 'Выберите тип товара!' }]}
        >
          <Select placeholder="Выберите тип">
            {types.map(type => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="brandIds"
          label="Бренды"
          rules={[{ required: true, message: 'Выберите хотя бы один бренд!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Выберите бренды"
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

        <h3>Информация о товаре</h3>
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
          <Button type="primary" htmlType="submit">
            Сохранить изменения
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default ThingEditPage;
