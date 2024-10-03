import React, { useEffect, useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { HiMiniPencilSquare, HiMiniTrash } from "react-icons/hi2";
import { message, Image, Card, Button, Form, Modal, Spin, Upload, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './CommentList.module.css';

const { Meta } = Card;

const CommentList = observer(({ review }) => {
    const { review: reviewStore, user } = useContext(Context);
    const reviewId = review.id;
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [commentImages, setCommentImages] = useState([]);

    useEffect(() => {
        if (reviewStore && typeof reviewStore.loadComments === 'function') {
            reviewStore.loadComments(reviewId);
        } else {
            console.error('Метод loadComments не найден в reviewStore');
        }

        return () => {
            commentImages.forEach(img => URL.revokeObjectURL(img));
        };
    }, [reviewId, reviewStore]);

    const openCommentModal = (commentToEdit = null) => {
        if (commentToEdit) {
            setEditMode(true);
            setCurrentComment(commentToEdit);
            setNewCommentText(commentToEdit.text);
        } else {
            setEditMode(false);
            setNewCommentText('');
            setCommentImages([]);
        }
        setShowCommentModal(true);
    };

    const closeCommentModal = () => {
        setShowCommentModal(false);
        setCurrentComment(null);
    };

    const handleCreateOrEditComment = async () => {
        if (!newCommentText.trim()) {
            message.warning('Комментарий не может быть пустым.');
            return;
        }

        try {
            if (editMode) {
                if (typeof reviewStore.editComment === 'function') {
                    await reviewStore.editComment(currentComment.id, reviewId, newCommentText, commentImages);
                    message.success('Комментарий успешно изменен');
                } else {
                    console.error('Метод editComment не найден в reviewStore');
                    message.error('Ошибка при редактировании комментария.');
                }
            } else {
                if (typeof reviewStore.addComment === 'function') {
                    await reviewStore.addComment(reviewId, newCommentText, commentImages);
                    message.success('Спасибо за ваш комментарий!');
                } else {
                    console.error('Метод addComment не найден в reviewStore');
                    message.error('Ошибка при добавлении комментария.');
                }
            }
            setNewCommentText('');
            setCommentImages([]);
            closeCommentModal();
        } catch (error) {
            console.error('Error when saving a comment:', error);
            message.error('Ошибка при сохранении комментария: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteComment = async (id) => {
        Modal.confirm({
            title: 'Вы уверены, что хотите удалить этот комментарий?',
            okText: 'Да',
            cancelText: 'Нет',
            onOk: async () => {
                try {
                    if (typeof reviewStore.removeComment === 'function') {
                        await reviewStore.removeComment(id);
                        message.success('Комментарий успешно удален');
                    } else {
                        console.error('Метод removeComment не найден в reviewStore');
                        message.error('Ошибка при удалении комментария.');
                    }
                } catch (error) {
                    console.error('Ошибка при удалении комментария:', error);
                    message.error('Ошибка при удалении комментария: ' + (error.response?.data?.message || error.message));
                }
            },
        });
    };

    const loadMoreComments = () => {
        if (typeof reviewStore.loadMoreComments === 'function') {
            reviewStore.loadMoreComments(reviewId);
        } else {
            console.error('Метод loadMoreComments не найден в reviewStore');
        }
    };

    const commentData = reviewStore.comments[reviewId] || {
        items: [],
        page: 1,
        limit: reviewStore.commentLimit,
        loading: false,
        hasMore: true,
    };

    if (reviewStore.loadingComments && commentData.items.length === 0) {
        return (
            <div className={styles.spinner_container}>
                <Spin tip="Загрузка комментариев..." />
            </div>
        );
    }

    return (
        <div className={styles.comments}>
            {commentData.items.map((comment) => (
                <Card key={comment.id} className={styles.comment_card} hoverable>
                    <Meta
                        avatar={<strong>{comment.user.email}</strong>}
                        title={new Date(comment.createdAt).toLocaleString()}
                        description={
                            <div className={styles.comment_content}>
                                <span className={styles.comment_text}>{comment.text}</span>
                                {comment.images && comment.images.length > 0 && (
                                    <div className={styles.rev_images}>
                                        <Image.PreviewGroup>
                                            {comment.images.map((img) => (
                                                <Image
                                                    key={img.id}
                                                    src={`${process.env.REACT_APP_API_URL}/${img.img}`}
                                                    alt="Comment"
                                                    className={styles.rev_img}
                                                    width={100}
                                                    style={{ marginRight: '10px', cursor: 'pointer' }}
                                                />
                                            ))}
                                        </Image.PreviewGroup>
                                    </div>
                                )}
                            </div>
                        }
                    />
                    {(user.user.id === comment.userId || user.user.role === 'ADMIN') && (
                        <div className={styles.action_buttons}>
                            <Button
                                type="link"
                                icon={<HiMiniPencilSquare />}
                                onClick={() => openCommentModal(comment)}
                                className={styles.edit_btn}
                            />
                            <Button
                                type="link"
                                danger
                                icon={<HiMiniTrash />}
                                onClick={() => handleDeleteComment(comment.id)}
                                className={styles.delete_btn}
                            />
                        </div>
                    )}
                </Card>
            ))}
            {commentData.hasMore && (
                <div className="text-center">
                    <Button type="default" onClick={loadMoreComments} className={styles.load_btn}>
                        Загрузить больше
                    </Button>
                </div>
            )}
            {user.isAuth && (
                <>
                    <Button type="primary" onClick={() => openCommentModal()} className={styles.leave_btn}>
                        Оставить комментарий
                    </Button>

                    {/* Модальное окно для создания/редактирования комментария */}
                    <Modal
                        title={editMode ? 'Редактировать комментарий' : 'Написать комментарий'}
                        visible={showCommentModal}
                        onCancel={closeCommentModal}
                        footer={[
                            <Button key="back" onClick={closeCommentModal}>
                                Отмена
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleCreateOrEditComment}>
                                {editMode ? 'Сохранить' : 'Отправить'}
                            </Button>,
                        ]}
                        centered
                        destroyOnClose
                    >
                        <Form layout="vertical">
                            <Form.Item label="Текст комментария">
                                <Input.TextArea
                                    rows={3}
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    placeholder="Ваш комментарий..."
                                />
                            </Form.Item>
                            {!editMode && (
                                <Form.Item label="Изображения">
                                    <Upload
                                        listType="picture-card"
                                        multiple
                                        beforeUpload={() => false}
                                        onChange={({ fileList }) => {
                                            const images = fileList.map(file => {
                                                if (file.originFileObj) {
                                                    return URL.createObjectURL(file.originFileObj);
                                                }
                                                return file.url;
                                            });
                                            setCommentImages(images);
                                        }}
                                        accept="image/*"
                                    >
                                        {commentImages.length >= 8 ? null : (
                                            <div>
                                                <UploadOutlined />
                                                <div style={{ marginTop: 8 }}>Загрузить</div>
                                            </div>
                                        )}
                                    </Upload>
                                    {commentImages.length > 0 && (
                                        <div className={styles.selected_images}>
                                            {commentImages.map((img, index) => (
                                                <Image
                                                    key={index}
                                                    src={img}
                                                    alt={`Selected ${index + 1}`}
                                                    width={100}
                                                    style={{ marginRight: '10px', cursor: 'pointer' }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </Form.Item>
                            )}
                        </Form>
                    </Modal>
                </>
            )}
        </div>
    );
});

export default CommentList;
