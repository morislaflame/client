// components/Reviews.js

import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Card, Button, Form, Modal, Spinner } from 'react-bootstrap';
import ReviewPagination from '../Pagination/ReviewPagination';
import CommentList from '../CommentList/CommentList';

const Reviews = observer(() => {
    const { review, user } = useContext(Context);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [reviewImages, setReviewImages] = useState([]);

    useEffect(() => {
        review.loadReviews(review.page, review.limit);
    }, [review.page]);

    const openReviewModal = () => setShowReviewModal(true);
    const closeReviewModal = () => setShowReviewModal(false);

    const handleCreateReview = async () => {
        try {
            await review.addReview(newReviewText, newReviewRating, reviewImages);
            setNewReviewText('');
            setNewReviewRating(5);
            setReviewImages([]);
            closeReviewModal();
        } catch (error) {
            alert('Ошибка при создании отзыва: ' + (error.response?.data?.message || error.message));
        }
    };

    if (review.loading) {
        return <Spinner animation="border" />;
    }

    return (
        <div className="container mt-4">
            <h2>Отзывы</h2>
            {user.isAuth && (
                <Button variant="primary" onClick={openReviewModal}>Написать отзыв</Button>
            )}
            <div className="mt-3">
                {review.reviews.map((rev) => (
                    <Card key={rev.id} className="mb-3">
                        <Card.Header>
                            <strong>{rev.user.email}</strong> - {new Date(rev.createdAt).toLocaleString()}
                            <span style={{ float: 'right' }}>Рейтинг: {rev.rating}</span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>{rev.text}</Card.Text>
                            {rev.images && rev.images.map((img) => (
                                <img key={img.id} src={`${process.env.REACT_APP_API_URL}/${img.img}`} alt="Review" style={{ maxWidth: '100px', marginRight: '10px' }} />
                            ))}
                        </Card.Body>
                        <Card.Footer>
                            <CommentList reviewId={rev.id} />
                        </Card.Footer>
                    </Card>
                ))}
            </div>
            <ReviewPagination
                totalCount={review.totalCount}
                limit={review.limit}
                page={review.page}
                setPage={(page) => review.setPage(page)}
            />

            {/* Модальное окно для создания отзыва */}
            <Modal show={showReviewModal} onHide={closeReviewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Написать отзыв</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formReviewText">
                            <Form.Label>Текст отзыва</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newReviewText}
                                onChange={(e) => setNewReviewText(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formReviewRating">
                            <Form.Label>Рейтинг</Form.Label>
                            <Form.Control
                                as="select"
                                value={newReviewRating}
                                onChange={(e) => setNewReviewRating(e.target.value)}
                            >
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <option key={rating} value={rating}>{rating}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formReviewImages">
                            <Form.Label>Изображения</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={(e) => setReviewImages(Array.from(e.target.files))}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeReviewModal}>Отмена</Button>
                    <Button variant="primary" onClick={handleCreateReview}>Отправить</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default Reviews;
