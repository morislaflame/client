import React, { useState } from 'react';
import { Modal, Button, Form, Input, Upload, message } from 'antd';
import { createStory } from '../../http/storyAPI';
import { UploadOutlined } from '@ant-design/icons';

const CreateStory = ({ show, onHide }) => {
  const [title, setTitle] = useState('');
  const [coverImg, setCoverImg] = useState(null);
  const [mainContent, setMainContent] = useState(null);

  const [coverImgFileList, setCoverImgFileList] = useState([]);
  const [mainContentFileList, setMainContentFileList] = useState([]);

  const [form] = Form.useForm();

  const handleCoverImgChange = (info) => {
    setCoverImgFileList(info.fileList);

    if (info.fileList.length > 0) {
      setCoverImg(info.fileList[0].originFileObj);
    } else {
      setCoverImg(null);
    }
  };

  const handleMainContentChange = (info) => {
    setMainContentFileList(info.fileList);

    if (info.fileList.length > 0) {
      setMainContent(info.fileList[0].originFileObj);
    } else {
      setMainContent(null);
    }
  };

  const addStory = async () => {
    try {
      await form.validateFields();

      if (!coverImg) {
        return message.error('Выберите обложку истории');
      }
      if (!mainContent) {
        return message.error('Выберите основное содержимое истории (фото или видео)');
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('coverImg', coverImg);

      // Проверяем тип файла основного содержимого
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

      if (allowedImageTypes.includes(mainContent.type)) {
        formData.append('img', mainContent);
      } else if (allowedVideoTypes.includes(mainContent.type)) {
        formData.append('video', mainContent);
      } else {
        return message.error('Неверный формат основного содержимого. Допустимы изображения или видео.');
      }

      await createStory(formData);
      message.success('История успешно создана');
      onHide();
      form.resetFields();
      setTitle('');
      setCoverImg(null);
      setMainContent(null);
      setCoverImgFileList([]);
      setMainContentFileList([]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error('Ошибка при создании истории: ' + errorMessage);
    }
  };

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      centered
      title="Добавить историю"
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="Заголовок"
          rules={[{ required: true, message: 'Пожалуйста, введите заголовок истории' }]}
        >
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              form.setFieldsValue({ title: e.target.value });
            }}
            placeholder="Введите заголовок"
          />
        </Form.Item>

        <Form.Item
          label="Обложка истории"
          required
        >
          <Upload
            beforeUpload={() => false}
            onChange={handleCoverImgChange}
            multiple={false}
            accept="image/*"
            fileList={coverImgFileList}
            onRemove={() => {
              setCoverImg(null);
              setCoverImgFileList([]);
            }}
          >
            <Button icon={<UploadOutlined />}>Выберите изображение</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Основное содержимое (фото или видео)"
          required
        >
          <Upload
            beforeUpload={() => false}
            onChange={handleMainContentChange}
            multiple={false}
            accept="image/*,video/*"
            fileList={mainContentFileList}
            onRemove={() => {
              setMainContent(null);
              setMainContentFileList([]);
            }}
          >
            <Button icon={<UploadOutlined />}>Выберите фото или видео</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button onClick={onHide} style={{ marginRight: 8 }}>
            Закрыть
          </Button>
          <Button type="primary" onClick={addStory}>
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateStory;
