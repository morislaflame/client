import React, { useEffect, useState, useContext } from 'react';
import { Card, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { HiMiniPencilSquare, HiMiniTrash } from "react-icons/hi2";
import { message, Image } from 'antd';
import styles from './CommentList.module.css';

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
            console.error('Method loadComments not found in reviewStore');
        }
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
            message.warning('Comment cannot be empty.');
            return;
        }

        try {
            if (editMode) {
                if (typeof reviewStore.editComment === 'function') {
                    await reviewStore.editComment(currentComment.id, reviewId, newCommentText);
                    message.success('Comment successfully edited');
                } else {
                    console.error('Method editComment not found in reviewStore');
                    message.error('Error editing comment.');
                }
            } else {
                if (typeof reviewStore.addComment === 'function') {
                    await reviewStore.addComment(reviewId, newCommentText, commentImages);
                    message.success('Thank you for your feedback!');
                } else {
                    console.error('Method addComment not found in reviewStore');
                    message.error('Error adding comment.');
                }
            }
            setNewCommentText('');
            setCommentImages([]);
            closeCommentModal();
        } catch (error) {
            console.error('Error when saving a comment:', error);
            message.error('Error saving comment: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteComment = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
        if (confirmDelete) {
            try {
                if (typeof reviewStore.removeComment === 'function') {
                    await reviewStore.removeComment(id);
                    message.success('Comment successfully deleted');
                } else {
                    console.error('Method removeComment not found in reviewStore');
                    message.error('Error deleting comment.');
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
                message.error('Error deleting comment: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const loadMoreComments = () => {
        if (typeof reviewStore.loadMoreComments === 'function') {
            reviewStore.loadMoreComments(reviewId);
        } else {
            console.error('Method loadMoreComments not found in reviewStore');
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
        return <Spinner animation="border" />;
    }

    return (
        <div className={styles.comments}>
            {commentData.items.map((comment) => (
                <Card key={comment.id} className={styles.comment_card}>
                    <Card.Body className={styles.comment_body}>
                        <div className={styles.name_comm}>
                            <strong>{comment.user.email}</strong>
                            <span className={styles.comment_text}>
                                {comment.text}
                            </span>
                            <div className={styles.rev_images}>
                                {comment.images && comment.images.length > 0 ? (
                                    comment.images.map((img) => (
                                        <Image
                                            key={img.id}
                                            src={`${process.env.REACT_APP_API_URL}/${img.img}`}
                                            alt="Comment"
                                            className={styles.rev_img}
                                            width={100}
                                            style={{ marginRight: '10px', cursor: 'pointer' }}
                                        />
                                    ))
                                ) : (
                                    <p>No images</p>
                                )}
                            </div>
                        </div>
                        <div className={styles.edit_button}>
                            {(user.user.id === comment.userId || user.user.role === 'ADMIN') && (
                                <>
                                    <Button
                                        variant="dark"
                                        onClick={() => openCommentModal(comment)}
                                        className={styles.edit_btn}
                                    >
                                        <HiMiniPencilSquare />
                                    </Button>
                                    <Button
                                        variant="dark"
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className={styles.delete_btn}
                                    >
                                        <HiMiniTrash />
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            ))}
            {commentData.hasMore && (
                <div className="text-center">
                    <Button variant="secondary" onClick={loadMoreComments} className={styles.load_btn}>
                        Load more
                    </Button>
                </div>
            )}
            {user.isAuth && (
                <>
                    <Button variant="dark" onClick={() => openCommentModal()} className={styles.leave_btn}>
                        Leave a comment
                    </Button>

                    {/* Modal window for creating/editing a comment */}
                    <Modal
                        className={styles.rev_modal}
                        dialogClassName={styles.rev_modal_dialog}
                        contentClassName={styles.rev_modal_content}
                        show={showCommentModal}
                        onHide={closeCommentModal}
                    >
                        <Modal.Header className={styles.rev_modal_header} closeButton>
                            <Modal.Title>{editMode ? 'Edit comment' : 'Write a comment'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={styles.rev_modal_body}>
                            <Form className={styles.rev_form}>
                                <Form.Group controlId="formCommentText" className={styles.rev_modal_input}>
                                    {/* Optional label or placeholder */}
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Your comment..."
                                        rows={3}
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                    />
                                </Form.Group>

                                {!editMode && (
                                    <Form.Group controlId="formCommentImages">
                                        {/* Images uploader component or input */}
                                        {/* If you have an ImageUploader component similar to Reviews, use it here */}
                                        {/* For now, we can keep the Form.Control for file input */}
                                        <Form.Control
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                const images = files.map(file => URL.createObjectURL(file));
                                                setCommentImages(images);
                                            }}
                                        />
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
                                    </Form.Group>
                                )}
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={closeCommentModal} className={styles.cancel_btn}>Cancel</button>
                            <button onClick={handleCreateOrEditComment} className={styles.save_btn}>
                                {editMode ? 'Save' : 'Send'}
                            </button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </div>
    );
});

export default CommentList;
