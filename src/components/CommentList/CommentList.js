import React, { useEffect, useState, useContext } from 'react';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { HiMiniPencilSquare } from "react-icons/hi2";
import { message } from 'antd';
import styles from './CommentList.module.css'

const CommentList = observer(({ review }) => {
    const { review: reviewStore, user } = useContext(Context);
    const reviewId = review.id;
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [commentImages, setCommentImages] = useState([]);

    const commentData = reviewStore.comments[reviewId] || {
        items: [],
        page: 1,
        limit: reviewStore.commentLimit,
        loading: false,
        hasMore: true,
    };

    useEffect(() => {
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
            message.error('Error when saving a comment: ' + (error.response?.data?.message || error.message));
        }
    };

    const loadMoreComments = () => {
        reviewStore.loadMoreComments(reviewId);
    };

    return (
        <div className={styles.comments}>
            {commentData.items.map((comment) => (
                <Card key={comment.id} className={styles.comment_card}>
                    <Card.Body className={styles.comment_body}>
                        
                        
                            <div className={styles.name_comm}>
                                <strong>{comment.user.email}</strong> {comment.text}
                                <div className={styles.rev_images}>
                                    {comment.images && comment.images.map((img) => (
                                        <img
                                            className={styles.rev_img}
                                            key={img.id}
                                            src={`${process.env.REACT_APP_API_URL}/${img.img}`}
                                            alt="Comment"
                                        />
                                    ))}
                                </div>
                            </div>
                        <div className={styles.edit_button}>
                            {(user.user.id === comment.userId || user.user.role === 'ADMIN') && (
                                <Button variant="dark" onClick={() => openCommentModal(comment)} style={{borderBottomRightRadius: 'calc(var(--index) * 1)'}}><HiMiniPencilSquare /></Button>
                            )}
                        </div>
                    </Card.Body>
                    
                </Card>
            ))}
            {commentData.hasMore && (
                <div className="text-center">
                    <Button variant="second" onClick={loadMoreComments} className={styles.load_btn}>Load more</Button>
                </div>
            )}
            {user.isAuth && (
                <>
                    <Button variant="dark" onClick={() => openCommentModal()} className={styles.leave_btn}>Leave a comment</Button>

                    {/* Модальное окно для создания/редактирования комментария */}
                    <Modal show={showCommentModal} onHide={closeCommentModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{editMode ? 'Edit comment' : 'Write a comment'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formCommentText">
                                    <Form.Label>Comment text</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                    />
                                </Form.Group>
                                {!editMode && (
                                    <Form.Group controlId="formCommentImages">
                                        <Form.Label>Images</Form.Label>
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
                                {editMode ? 'Save' : 'Send'}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </div>
    );
});

export default CommentList;
