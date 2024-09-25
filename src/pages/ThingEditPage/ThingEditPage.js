import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOneThing, updateThing, fetchTypes, fetchBrands } from '../../http/thingAPI';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Button, Form } from 'react-bootstrap';
import { message } from 'antd';
import { MAIN_ROUTE } from '../../utils/consts';
import styles from './ThingEditPage.module.css'
import BackButton from '../../components/BackButton/BackButton';

const ThingEditPage = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, thing: thingStore } = useContext(Context);

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
      // Извлекаем brandIds из data.brands
      const brandIds = data.brands ? data.brands.map(brand => brand.id.toString()) : [];
      setThing({ ...data, brandIds });
    });
    fetchTypes().then(data => setTypes(data));
    fetchBrands().then(data => setBrands(data));
  }, [id]);

  const handleInputChange = (e) => {
    setThing({ ...thing, [e.target.name]: e.target.value });
  };

  const handleInfoChange = (e) => {
    setThing({ ...thing, info: { ...thing.info, [e.target.name]: e.target.value } });
  };

  const handleBrandChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setThing({ ...thing, brandIds: value });
  };

  const handleImageChange = (e) => {
    setNewImages(prevImages => [...prevImages, ...Array.from(e.target.files)]);
  };

  const handleRemoveImage = (imageId) => {
    setImagesToRemove([...imagesToRemove, imageId]);
    setThing({
      ...thing,
      images: thing.images.filter(image => image.id !== imageId),
    });
  };

  const removeNewImage = (index) => {
    setNewImages(prevImages => prevImages.filter((file, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Проверка полей (можно добавить более подробную валидацию)
      if (!thing.name.trim()) {
        return message.error("Введите имя товара!");
      }

      if (!thing.price || thing.price <= 0) {
        return message.error("Введите корректную цену товара!");
      }

      if (!thing.typeId) {
        return message.error("Выберите тип товара!");
      }

      if (thing.brandIds.length === 0) {
        return message.error("Выберите хотя бы один бренд!");
      }

      const formData = new FormData();

      formData.append('name', thing.name);
      formData.append('price', thing.price);
      formData.append('typeId', thing.typeId);
      formData.append('brandIds', JSON.stringify(thing.brandIds));
      formData.append('info', JSON.stringify(thing.info));
      formData.append('imagesToRemove', JSON.stringify(imagesToRemove));

      newImages.forEach(file => {
        formData.append('img', file);
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
      <BackButton/>
      <h2>Редактирование товара</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='name'>
          <Form.Label>Название</Form.Label>
          <Form.Control
            type='text'
            name='name'
            value={thing.name}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId='price'>
          <Form.Label>Цена</Form.Label>
          <Form.Control
            type='number'
            name='price'
            value={thing.price}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId='typeId'>
          <Form.Label>Тип</Form.Label>
          <Form.Control
            as='select'
            name='typeId'
            value={thing.typeId}
            onChange={handleInputChange}
          >
            <option value=''>Выберите тип</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='brandIds'>
          <Form.Label>Бренды</Form.Label>
          <Form.Control
            as='select'
            multiple
            name='brandIds'
            value={thing.brandIds}
            onChange={handleBrandChange}
          >
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <h3>Информация о товаре</h3>
        {infoFields.map(field => (
          <Form.Group controlId={field.name} key={field.name}>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              as={field.as || 'input'}
              type='text'
              name={field.name}
              value={thing.info[field.name] || ''}
              onChange={handleInfoChange}
            />
          </Form.Group>
        ))}

        <h3>Изображения</h3>
        <div className='existing-images'>
          {thing.images.map(image => (
            <div key={image.id} className={styles.photo}>
              <img src={process.env.REACT_APP_API_URL + image.img} alt='Текущее изображение' className={styles.photos}/>
              <Button variant='outline-danger' onClick={() => handleRemoveImage(image.id)}>
                Удалить
              </Button>
            </div>
          ))}
        </div>

        <Form.Group controlId='newImages'>
          <Form.Label>Добавить новые изображения</Form.Label>
          <Form.Control
            type='file'
            name='img'
            multiple
            onChange={handleImageChange}
          />
        </Form.Group>

        <div className="mt-3">
          <h6>Выбранные новые изображения:</h6>
          {newImages.map((file, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center">
              <span>{file.name}</span>
              <Button variant="outline-danger" onClick={() => removeNewImage(index)}>Удалить</Button>
            </div>
          ))}
        </div>

        <Button variant='primary' type='submit' className="mt-3">
          Сохранить изменения
        </Button>
      </Form>
    </div>
  );
});

export default ThingEditPage;
