// components/CommentList/CommentList.js

import React, { useEffect, useState, useContext } from 'react';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';

const CommentList = observer(({ review }) => {
    const { review: reviewStore, user } = useContext(Context);
    const reviewId = review.id;
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [commentImages, setCommentImages] = useState([]);

    // Получаем данные комментариев для данного отзыва
    const commentData = reviewStore.comments[reviewId] || {
        items: [],
        page: 1,
        limit: reviewStore.commentLimit,
        loading: false,
        hasMore: true,
    };

    useEffect(() => {
        // Загружаем комментарии при монтировании компонента
        reviewStore.loadComments(reviewId);
    }, [reviewId]);

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
        try {
            if (editMode) {
                await reviewStore.editComment(currentComment.id, reviewId, newCommentText);
            } else {
                await reviewStore.addComment(reviewId, newCommentText, commentImages);
            }
            setNewCommentText('');
            setCommentImages([]);
            closeCommentModal();
        } catch (error) {
            alert('Ошибка при сохранении комментария: ' + (error.response?.data?.message || error.message));
        }
    };

    const loadMoreComments = () => {
        reviewStore.loadMoreComments(reviewId);
    };

    return (
        <div>
            {commentData.items.map((comment) => (
                <Card key={comment.id} className="mb-2">
                    <Card.Body>
                        <Card.Text>
                            <strong>{comment.user.email}</strong>: {comment.text}
                        </Card.Text>
                        {comment.images && comment.images.map((img) => (
                            <img
                                key={img.id}
                                src={`${process.env.REACT_APP_API_URL}/${img.img}`}
                                alt="Comment"
                                style={{ maxWidth: '100px', marginRight: '10px' }}
                            />
                        ))}
                    </Card.Body>
                    {(user.user.id === comment.userId || user.user.role === 'ADMIN') && (
                        <Button variant="link" onClick={() => openCommentModal(comment)}>Редактировать</Button>
                    )}
                </Card>
            ))}
            {commentData.hasMore && (
                <div className="text-center">
                    <Button variant="link" onClick={loadMoreComments}>Загрузить ещё комментарии</Button>
                </div>
            )}
            {user.isAuth && (
                <>
                    <Button variant="link" onClick={() => openCommentModal()}>Оставить комментарий</Button>

                    {/* Модальное окно для создания/редактирования комментария */}
                    <Modal show={showCommentModal} onHide={closeCommentModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{editMode ? 'Редактировать комментарий' : 'Написать комментарий'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formCommentText">
                                    <Form.Label>Текст комментария</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                    />
                                </Form.Group>
                                {!editMode && (
                                    <Form.Group controlId="formCommentImages">
                                        <Form.Label>Изображения</Form.Label>
                                        <Form.Control
                                            type="file"
                                            multiple
                                            onChange={(e) => setCommentImages(Array.from(e.target.files))}
                                        />
                                    </Form.Group>
                                )}
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeCommentModal}>Отмена</Button>
                            <Button variant="primary" onClick={handleCreateOrEditComment}>
                                {editMode ? 'Сохранить' : 'Отправить'}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </div>
    );
});

export default CommentList;
