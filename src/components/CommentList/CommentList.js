// components/CommentList/CommentList.js

import React, { useEffect, useState, useContext } from 'react';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import CommentPagination from '../Pagination/CommentPagination';

const CommentList = observer(({ reviewId }) => {
    const { review, user } = useContext(Context);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
    const [commentImages, setCommentImages] = useState([]);

    const commentData = review.comments[reviewId] || {
        items: [],
        page: 1,
        limit: review.commentLimit,
        totalCount: 0,
    };

    useEffect(() => {
        review.loadComments(reviewId, commentData.page, commentData.limit);
    }, [reviewId, commentData.page]);

    const openCommentModal = () => setShowCommentModal(true);
    const closeCommentModal = () => setShowCommentModal(false);

    const handleCreateComment = async () => {
        try {
            await review.addComment(reviewId, newCommentText, commentImages);
            setNewCommentText('');
            setCommentImages([]);
            closeCommentModal();
        } catch (error) {
            alert('Ошибка при создании комментария: ' + (error.response?.data?.message || error.message));
        }
    };

    const setCommentPage = (page) => {
        review.setCommentPage(reviewId, page);
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
                            <img key={img.id} src={`${process.env.REACT_APP_API_URL}/${img.img}`} alt="Comment" style={{ maxWidth: '100px', marginRight: '10px' }} />
                        ))}
                    </Card.Body>
                </Card>
            ))}
            <CommentPagination
                totalCount={commentData.totalCount}
                limit={commentData.limit}
                page={commentData.page}
                setPage={setCommentPage}
            />
            {user.isAuth && (
                <>
                    <Button variant="link" onClick={openCommentModal}>Оставить комментарий</Button>

                    {/* Модальное окно для создания комментария */}
                    <Modal show={showCommentModal} onHide={closeCommentModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Написать комментарий</Modal.Title>
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
                                <Form.Group controlId="formCommentImages">
                                    <Form.Label>Изображения</Form.Label>
                                    <Form.Control
                                        type="file"
                                        multiple
                                        onChange={(e) => setCommentImages(Array.from(e.target.files))}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeCommentModal}>Отмена</Button>
                            <Button variant="primary" onClick={handleCreateComment}>Отправить</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </div>
    );
});

export default CommentList;
