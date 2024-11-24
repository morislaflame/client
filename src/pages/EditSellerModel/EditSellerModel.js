import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, message, Spin, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTypes, fetchBrands } from '../../http/thingAPI';
import { Context } from '../../index';
import styles from './EditSellerModel.module.css';
import { SELLER_ACCOUNT_ROUTE } from '../../utils/consts';
import BackButton from '../../components/UI/BackButton/BackButton';
import LoadingIndicator from '../../components/UI/LoadingIndicator/LoadingIndicator';

const { Option } = Select;

const EditSellerModel = () => {
  const { id } = useParams();
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [thing, setThing] = useState(null);
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
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
        const thingData = user.sellerThings.find((t) => t.id === Number(id));
        if (!thingData) {
          message.error('Model not found');
          navigate(SELLER_ACCOUNT_ROUTE);
          return;
        }
        setThing(thingData);
        form.setFieldsValue({
          name: thingData.name,
          price: thingData.price,
          typeId: thingData.typeId,
          brandIds: thingData.brands.map((brand) => brand.id),
          ...thingData.info, // Устанавливаем значения info
        });

        const typesData = await fetchTypes();
        setTypes(typesData);

        const brandsData = await fetchBrands();
        setBrands(brandsData);

        setLoading(false);
      } catch (error) {
        message.error('Error loading data');
        setLoading(false);
      }
    };

    loadData();
  }, [id, form, navigate, user.sellerThings]);

  const handleValuesChange = (changedValues, allValues) => {
    setThing((prevThing) => ({
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
      images: thing.images.filter((image) => image.id !== imageId),
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

      newImages.forEach((file) => {
        formData.append('img', file.originFileObj);
      });

      await user.updateThing(id, formData);
      message.success('Model updated successfully');
      navigate(SELLER_ACCOUNT_ROUTE);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error('Error updating model: ' + errorMessage);
    }
  };

  if (loading || !thing) {
    return <LoadingIndicator />;
  }

  return (
    <div className={styles.editModel}>
        <div className={styles.topic_back}>
            <BackButton />
            <h2>Edit Model</h2>
        </div>
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
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber min={0} placeholder="Enter price" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="typeId"
          label="Country"
          rules={[{ required: true, message: 'Please select country' }]}
        >
          <Select placeholder="Select country">
            {types.map((type) => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="brandIds"
          label="Platforms"
          rules={[{ required: true, message: 'Please select at least one platform' }]}
        >
          <Select mode="multiple" placeholder="Select platforms">
            {brands.map((brand) => (
              <Option key={brand.id} value={brand.id}>
                {brand.name}
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
          {thing.images.map((image) => (
            <div key={image.id} className={styles.photo}>
              <img
                src={process.env.REACT_APP_API_URL + image.img}
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

        <div className={styles.confirm_btn_container}>
            <button 
                className={styles.confirm_btn} 
                type="submit"
            >
                Update Model
            </button>
        </div>
      </Form>
    </div>
  );
};

export default EditSellerModel;
