// EditSellerModel.js

import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, message, Row, Col } from 'antd';
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
    { name: 'cblocked', label: 'Blocked Countries', required: true },
    { name: 'ofverif', label: 'OF Verified', required: true },
    { name: 'link', label: 'Link' },
    { name: 'girlmsg', label: 'Girl Message', as: 'textarea' },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [modelData, countriesData, platformsData] = await Promise.all([
          seller.myModelProducts.find((t) => t.id === Number(id)),
          fetchCountries(),
          fetchAdultPlatforms()
        ]);

        if (!modelData) {
          throw new Error('Model not found');
        }

        const adultPlatformIds = modelData.adultPlatforms.map((platform) => platform.id);
        setModel({...modelData, adultPlatformIds});
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
        console.error('Error loading data:', error);
        setError(error.message || 'Error loading data');
        message.error('Failed to load model data');
        navigate(SELLER_ACCOUNT_ROUTE);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, form, navigate, seller.myModelProducts]);

  const handleValuesChange = (changedValues, allValues) => {
    try {
      setModel((prevModel) => ({
        ...prevModel,
        ...allValues,
        info: { ...prevModel.info, ...allValues },
      }));
    } catch (error) {
      console.error('Error handling form changes:', error);
      message.error('Error updating form values');
    }
  };

  const handleImageChange = ({ fileList }) => {
    try {
      // Check file size (max 5MB)
      const isLt5M = fileList.every(file => file.size / 1024 / 1024 < 5);
      
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return;
      }

      // Check file type
      const isValidType = fileList.every(file => {
        const isValidFormat = file.type === 'image/jpeg' || 
                            file.type === 'image/png' || 
                            file.type === 'image/webp';
        if (!isValidFormat) {
          message.error('You can only upload JPG/PNG/WebP files!');
        }
        return isValidFormat;
      });

      if (isValidType) {
        setNewImages(fileList);
      }
    } catch (error) {
      console.error('Error handling image change:', error);
      message.error('Error processing image');
    }
  };

  const handleRemoveImage = (imageId) => {
    try {
      setImagesToRemove([...imagesToRemove, imageId]);
      setModel({
        ...model,
        images: model.images.filter((image) => image.id !== imageId),
      });
    } catch (error) {
      console.error('Error removing image:', error);
      message.error('Error removing image');
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const values = await form.validateFields();

      // Check required fields
      const requiredFields = [
        'name',
        'priceUSD',
        'countryId',
        'adultPlatformIds',
        ...infoFields.filter(field => field.required).map(field => field.name)
      ];

      const missingFields = requiredFields.filter(field => !values[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Check if there's at least one image
      if (model.images.length === 0 && newImages.length === 0) {
        throw new Error('At least one image is required');
      }

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('priceUSD', values.priceUSD);
      formData.append('countryId', values.countryId);
      formData.append('adultPlatformIds', JSON.stringify(values.adultPlatformIds));
      
      // Collect all info fields
      const infoData = {};
      infoFields.forEach(field => {
        infoData[field.name] = values[field.name];
      });
      formData.append('info', JSON.stringify(infoData));
      
      formData.append('imageIdsToRemove', JSON.stringify(imagesToRemove));

      newImages.forEach((file) => {
        formData.append('img', file.originFileObj);
      });

      await seller.updateProduct(id, formData);
      message.success('Model updated successfully');
      navigate(SELLER_ACCOUNT_ROUTE);
    } catch (error) {
      console.error('Error updating model:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      message.error('Error updating model: ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <div className="container">
        <TopicBack title="Error" />
        <div className={styles.errorContainer}>
          <h2>An error occurred:</h2>
          <p>{error}</p>
          <Button onClick={() => navigate(SELLER_ACCOUNT_ROUTE)}>
            Return to Account
          </Button>
        </div>
      </div>
    );
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
          name="priceUSD"
          label="Price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber min={0} placeholder="Enter price" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="countryId"
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
          name="adultPlatformIds"
          label="Platforms"
          rules={[{ required: true, message: 'Please select at least one platform' }]}
        >
          <Select mode="multiple" placeholder="Select platforms">
            {adultPlatforms.map((platform) => (
              <Option key={platform.id} value={platform.id}>
                {platform.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          {infoFields.map((field) => (
            <Col span={12} key={field.name}>
              <Form.Item
                name={field.name}
                label={field.label}
                rules={field.required ? [{ required: true, message: `Please enter ${field.label}` }] : []}
              >
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
                src={`${process.env.REACT_APP_API_URL}${image.img}`}
                alt="Current Image"
                className={styles.photos}
              />
              <Button
                danger
                onClick={() => handleRemoveImage(image.id)}
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
              accept="image/jpeg,image/png,image/webp"
            >
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>
        </div>

        <div className={styles.confirm_btn_container}>
          <Button
            className={styles.confirm_btn}
            type="ghost"
            onClick={handleSubmit}
            loading={submitting}
            disabled={loading || submitting}
          >
            {submitting ? 'Updating...' : 'Update Model'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditSellerModel;
