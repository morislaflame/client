import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchModelProductById, fetchCountries, fetchAdultPlatforms } from '../../../http/modelProductAPI';
import { updateModelProduct } from '../../../http/sellerAPI';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import { Button, Form, Input, InputNumber, Select, Upload, message } from 'antd';
import { MAIN_ROUTE } from '../../../utils/consts';
import styles from './ModelEditPage.module.css';
import TopicBack from '../../../components/FuctionalComponents/TopicBack/TopicBack';
import { UploadOutlined } from '@ant-design/icons';
import LoadingIndicator from '../../../components/UI/LoadingIndicator/LoadingIndicator';

const { Option } = Select;

const ModelEditPage = observer(() => {
  const { id } = useParams();
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        const [modelData, countriesData, platformsData] = await Promise.all([
          fetchModelProductById(id),
          fetchCountries(),
          fetchAdultPlatforms()
        ]);

        const adultPlatformIds = modelData.adultPlatforms 
          ? modelData.adultPlatforms.map(platform => platform.id) 
          : [];

        setModel({ ...modelData, adultPlatformIds });
        setCountries(countriesData);
        setAdultPlatforms(platformsData);

        form.setFieldsValue({
          name: modelData.name,
          priceUSD: modelData.priceUSD,
          countryId: modelData.countryId,
          adultPlatformIds: adultPlatformIds,
          ...modelData.info,
        });

      } catch (error) {
        console.error('Error loading initial data:', error);
        setError(error.response?.data?.message || 'Error loading initial data');
        message.error('Error loading initial data');
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id, form]);

  const handleValuesChange = (changedValues, allValues) => {
    try {
      setModel(prevModel => ({
        ...prevModel,
        ...allValues,
        info: { ...prevModel.info, ...allValues },
      }));
    } catch (error) {
      console.error('Error handling values change:', error);
      message.error('Error updating form values');
    }
  };

  const handleImageChange = ({ fileList }) => {
    try {
      // Проверка размера файла (например, максимум 5MB)
      const isLt5M = fileList.every(file => file.size / 1024 / 1024 < 5);
      
      if (!isLt5M) {
        message.error('Image must be less than 5MB!');
        return;
      }

      // Проверка типа файла
      const isValidType = fileList.every(file => {
        const isJpgOrPng = file.type === 'image/jpeg' || 
                            file.type === 'image/png' || 
                            file.type === 'image/webp';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG/WebP files!');
        }
        return isJpgOrPng;
      });

      if (isValidType) {
        setNewImages(fileList);
      }
    } catch (error) {
      console.error('Error handling image change:', error);
      message.error('Error handling image change');
    }
  };

  const handleRemoveImage = (imageId) => {
    try {
      setImagesToRemove([...imagesToRemove, imageId]);
      setModel({
        ...model,
        images: model.images.filter(image => image.id !== imageId),
      });
    } catch (error) {
      console.error('Error removing image:', error);
      message.error('Error removing image');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const values = await form.validateFields();

      // Проверка обязательных полей
      const requiredFields = [
        'name',
        'priceUSD',
        'countryId',
        'adultPlatformIds'
      ];

      const missingFields = requiredFields.filter(field => !values[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in the required fields: ${missingFields.join(', ')}`);
      }

      // Проверка наличия хотя бы одного изображения
      if (model.images.length === 0 && newImages.length === 0) {
        throw new Error('You must add at least one image');
      }

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
      message.success('Model updated successfully');
      navigate(`/thing/${id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      message.error('Error updating model: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user.isAuth || user.user.role !== 'ADMIN') {
    navigate(MAIN_ROUTE);
    return null;
  }

  if (initialLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <div className="container">
        <TopicBack title="Error" />
        <div className={styles.errorContainer}>
          <h2>An error occurred:</h2>
          <p>{error}</p>
          <Button onClick={() => navigate(MAIN_ROUTE)}>Return to main page</Button>
        </div>
      </div>
    );
  }

  const infoFields = [
    { name: 'age', label: 'Age', required: true },
    { name: 'smartphone', label: 'Smartphone', required: true },
    { name: 'percent', label: '% For Her', required: true },
    { name: 'time', label: 'Time Per Day', required: true },
    { name: 'english', label: 'English Skills', required: true },
    { name: 'content', label: 'Content', required: true },
    { name: 'contract', label: 'Contract Signed', required: true },
    { name: 'start', label: 'When She Can Start', required: true },
    { name: 'socialmedia', label: 'Social Media Set Up', required: true },
    { name: 'tiktok', label: 'Willing To Do TikTok', required: true },
    { name: 'cblocked', label: 'Does She Need Any Countries Blocked', required: true },
    { name: 'ofverif', label: 'OF Verified', required: true },
    { name: 'link', label: 'Link' },
    { name: 'girlmsg', label: 'Girl Message', as: 'textarea' },
  ];

  return (
    <div className="container">
      <TopicBack title="Editing" />
      
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Enter the model name!' }]}
        >
          <Input placeholder="Enter the model name" />
        </Form.Item>

        <Form.Item
          name="priceUSD"
          label="Price"
          rules={[{ required: true, message: 'Enter the model price!' }]}
        >
          <InputNumber
            min={0}
            placeholder="Enter the model price"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="countryId"
          label="Country"
          rules={[{ required: true, message: 'Select the model country!' }]}
        >
          <Select placeholder="Select the country">
            {countries.map(country => (
              <Option key={country.id} value={country.id}>
                {country.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="adultPlatformIds"
          label="Platforms"
          rules={[{ required: true, message: 'Select at least one platform!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select platforms"
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
            rules={field.required ? [{ required: true, message: `Please fill in the field ${field.label}` }] : []}
          >
            {field.as === 'textarea' ? (
              <Input.TextArea rows={4} placeholder={`Enter ${field.label}`} />
            ) : (
              <Input placeholder={`Enter ${field.label}`} />
            )}
          </Form.Item>
        ))}

        <h3>Images</h3>
        <div className={styles.existingImages}>
          {model.images.map(image => (
            <div key={image.id} className={styles.photo}>
              <img
                src={process.env.REACT_APP_API_URL + image.img}
                alt="Current image"
                className={styles.photos}
              />
              <Button
                danger
                onClick={() => handleRemoveImage(image.id)}
                style={{ marginTop: '10px' }}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>

        <Form.Item label="Add new images">
          <Upload
            listType="picture"
            multiple
            beforeUpload={() => false}
            onChange={handleImageChange}
            fileList={newImages}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Upload images</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            disabled={loading || initialLoading}
          >
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default ModelEditPage;
