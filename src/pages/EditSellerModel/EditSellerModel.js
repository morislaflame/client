// EditSellerModel.js

import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, message, Spin, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCountries, fetchAdultPlatforms } from '../../http/modelProductAPI';
import { Context } from '../../index';
import styles from './EditSellerModel.module.css';
import { SELLER_ACCOUNT_ROUTE } from '../../utils/consts';
import TopicBack from '../../components/FuctionalComponents/TopicBack/TopicBack';
import LoadingIndicator from '../../components/UI/LoadingIndicator/LoadingIndicator';

const { Option } = Select;

const EditSellerModel = () => {
  const { id } = useParams();
  const { seller } = useContext(Context);
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [model, setModel] = useState(null);
  const [countries, setCountries] = useState([]);
  const [adultPlatforms, setAdultPlatforms] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [loading, setLoading] = useState(true);

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
    { name: 'cblocked', label: 'Blocked Countries' },
    { name: 'ofverif', label: 'OF Verified' },
    { name: 'link', label: 'Link' },
    { name: 'girlmsg', label: 'Girl Message', as: 'textarea' },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const modelData = seller.myModelProducts.find((t) => t.id === Number(id));
        const adultPlatformIds = modelData ? modelData.adultPlatforms.map((platform) => platform.id) : [];
        if (!modelData) {
          message.error('Model not found');
          navigate(SELLER_ACCOUNT_ROUTE);
          return;
        }
        setModel({...modelData, adultPlatformIds});
        form.setFieldsValue({
          name: modelData.name,
          priceUSD: modelData.priceUSD, // Изменено
          countryId: modelData.countryId, // Изменено
          adultPlatformIds: adultPlatformIds, // Изменено
          ...modelData.info, // Устанавливаем значения info
        });

        const countriesData = await fetchCountries();
        setCountries(countriesData);

        const adultPlatformsData = await fetchAdultPlatforms();
        setAdultPlatforms(adultPlatformsData);

        setLoading(false);
      } catch (error) {
        message.error('Error loading data');
        setLoading(false);
      }
    };

    loadData();
  }, [id, form, navigate, seller.myModelProducts]);

  const handleValuesChange = (changedValues, allValues) => {
    setModel((prevModel) => ({
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
      images: model.images.filter((image) => image.id !== imageId),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('priceUSD', values.priceUSD); // Изменено
      formData.append('countryId', values.countryId); // Изменено
      formData.append('adultPlatformIds', JSON.stringify(values.adultPlatformIds)); // Изменено
      formData.append('info', JSON.stringify(model.info));
      formData.append('imageIdsToRemove', JSON.stringify(imagesToRemove));

      newImages.forEach((file) => {
        formData.append('img', file.originFileObj);
      });

      await seller.updateProduct(id, formData);
      message.success('Model updated successfully');
      navigate(SELLER_ACCOUNT_ROUTE);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error('Error updating model: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !model) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container">
        <TopicBack title="Edit Model" />
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Model Name"
          rules={[{ required: true, message: 'Please enter model name' }]}
        >
          <Input placeholder="Enter model name" />
        </Form.Item>
        <Form.Item
          name="priceUSD" // Изменено
          label="Price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber min={0} placeholder="Enter price" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="countryId" // Изменено
          label="Country"
          rules={[{ required: true, message: 'Please select country' }]}
        >
          <Select placeholder="Select country">
            {countries.map((country) => (
              <Option key={country.id} value={country.id}>
                {country.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="adultPlatformIds" // Изменено
          label="Platforms"
          rules={[{ required: true, message: 'Please select at least one platform' }]}
        >
          <Select mode="multiple" placeholder="Select platforms">
            {adultPlatforms.map((adultPlatform) => (
              <Option key={adultPlatform.id} value={adultPlatform.id}>
                {adultPlatform.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          {infoFields.map((field) => (
            <Col span={12} key={field.name}>
              <Form.Item name={field.name} label={field.label}>
                {field.as === 'textarea' ? (
                  <Input.TextArea rows={4} placeholder={`Enter ${field.label}`} />
                ) : (
                  <Input placeholder={`Enter ${field.label}`} />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>

        <div className={styles.existingImages}>
          {model.images.map((image) => (
            <div key={image.id} className={styles.photo}>
              <img
                src={`${process.env.REACT_APP_API_URL}${image.img}`} // Изменено
                alt="Current Image"
                className={styles.photos}
              />
              <Button
                danger
                onClick={() => handleRemoveImage(image.id)}
                style={{ marginTop: '10px' }}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <div className={styles.addImages}>
          <Form.Item label="Add New Images">
            <Upload
              listType="picture"
              multiple
              beforeUpload={() => false}
              onChange={handleImageChange}
              fileList={newImages}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>
        </div>

        
      </Form>
      <div className={styles.confirm_btn_container}>
          <button 
            className={styles.confirm_btn} 
            type="submit"
            loading={loading}
          >
            Update Model
          </button>
        </div>
    </div>
  );
};

export default EditSellerModel;
