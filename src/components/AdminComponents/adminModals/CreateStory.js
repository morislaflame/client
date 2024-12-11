import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Context } from '../../../index';

const CreateStory = ({ show, onHide }) => {
  const [coverImg, setCoverImg] = useState(null);
  const [mainContent, setMainContent] = useState(null);

  const [coverImgFileList, setCoverImgFileList] = useState([]);
  const [mainContentFileList, setMainContentFileList] = useState([]);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { admin } = useContext(Context);

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

  const addStory = async (values) => {
    setLoading(true);
    try {
      if (!coverImg) {
        message.error('Choose story cover');
        return;
      }
      if (!mainContent) {
        message.error('Choose story content (photo or video)');
        return;
      }

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('link', values.link || '');
      formData.append('coverImg', coverImg);

      // Проверяем тип файла основного содержимого
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

      if (allowedImageTypes.includes(mainContent.type)) {
        formData.append('img', mainContent);
      } else if (allowedVideoTypes.includes(mainContent.type)) {
        formData.append('video', mainContent);
      } else {
        message.error('Invalid content format. Only images or videos are allowed.');
        return;
      }

      // Используем метод из AdminStore
      await admin.createStory(formData);

      message.success('Story successfully created');
      onHide();
      form.resetFields();
      setCoverImg(null);
      setMainContent(null);
      setCoverImgFileList([]);
      setMainContentFileList([]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error('Error creating story: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      centered
      title="Add story"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={addStory}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter story title' }]}
        >
          <Input placeholder="Enter story title" />
        </Form.Item>

        <Form.Item
          name="link"
          label="Link"
        >
          <Input placeholder="Enter link (optional)" />
        </Form.Item>

        <Form.Item
          label="Story cover"
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
            <Button icon={<UploadOutlined />}>Choose image</Button>
          </Upload>
          {!coverImg && <div style={{ color: 'red' }}>Please choose story cover</div>}
        </Form.Item>

        <Form.Item
          label="Main content (photo or video)"
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
            <Button icon={<UploadOutlined />}>Choose photo or video</Button>
          </Upload>
          {!mainContent && <div style={{ color: 'red' }}>Please choose story content</div>}
        </Form.Item>

        <Form.Item>
          <Button onClick={onHide} style={{ marginRight: 8 }}>
            Close
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateStory;
