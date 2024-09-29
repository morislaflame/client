// components/Reviews.js

import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Card, Button, Form, Modal, Spinner } from 'react-bootstrap';
import Slider from 'react-slick';
import CommentList from '../CommentList/CommentList';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Reviews = observer(() => {
    const { review, user } = useContext(Context);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [reviewImages, setReviewImages] = useState([]);

    useEffect(() => {
        review.loadReviews();
    }, []);

    const openReviewModal = (reviewToEdit = null) => {
        if (reviewToEdit) {
            setEditMode(true);
            setCurrentReview(reviewToEdit);
            setNewReviewText(reviewToEdit.text);
            setNewReviewRating(reviewToEdit.rating);
        } else {
            setEditMode(false);
            setNewReviewText('');
            setNewReviewRating(5);
            setReviewImages([]);
        }
        setShowReviewModal(true);
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setCurrentReview(null);
    };

    const handleCreateOrEditReview = async () => {
        try {
            if (editMode) {
                await review.editReview(currentReview.id, newReviewText, newReviewRating);
            } else {
                await review.addReview(newReviewText, newReviewRating, reviewImages);
            }
            setNewReviewText('');
            setNewReviewRating(5);
            setReviewImages([]);
            closeReviewModal();
        } catch (error) {
            alert('Ошибка при сохранении отзыва: ' + (error.response?.data?.message || error.message));
        }
    };

    const loadMoreReviews = () => {
        review.loadMoreReviews();
    };

    if (review.loading && review.reviews.length === 0) {
        return <Spinner animation="border" />;
    }

    // Обновленные настройки слайдера
    const sliderSettings = {
        dots: true,
        infinite: false, // Слайдер не бесконечный
        speed: 500,
        slidesToShow: 7, // Показывать 7 отзывов одновременно
        // slidesToScroll: 1,
        autoplay: false, // Отключаем автопрокрутку
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                },
            },
        ],
    };

    // Добавляем кнопку "Загрузить ещё" как последний элемент слайдера
    const reviewsWithLoadMore = [
        ...review.reviews,
        { id: 'loadMore', isLoadMoreButton: true },
    ];

    return (
        <div className="mt-4" style={{ width: '100%', overflow: 'hidden' }}>
            <h2>Отзывы</h2>
            {user.isAuth && (
                <Button variant="primary" onClick={() => openReviewModal()}>Написать отзыв</Button>
            )}
            <div className="mt-3" style={{ maxWidth: '100%' }}>
                <Slider {...sliderSettings} className="slider">
                    {reviewsWithLoadMore.map((rev) => {
                        if (rev.isLoadMoreButton) {
                            return (
                                <div key="loadMore" style={{ padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {review.hasMoreReviews ? (
                                        <Button variant="secondary" onClick={loadMoreReviews}>Загрузить ещё</Button>
                                    ) : (
                                        <p>Больше отзывов нет</p>
                                    )}
                                </div>
                            );
                        } else {
                            return (
                                <div key={rev.id} style={{ padding: '0 10px' }}>
                                    <Card className="mb-3" style={{ height: '400px', overflow: 'hidden' }}>
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
                                        <Card.Footer style={{ overflowY: 'auto', maxHeight: '150px' }}>
                                            <CommentList review={rev} />
                                        </Card.Footer>
                                        {(user.user.id === rev.userId || user.user.role === 'ADMIN') && (
                                            <Button variant="link" onClick={() => openReviewModal(rev)}>Редактировать</Button>
                                        )}
                                    </Card>
                                </div>
                            );
                        }
                    })}
                </Slider>
            </div>

            {/* Модальное окно для создания/редактирования отзыва */}
            <Modal show={showReviewModal} onHide={closeReviewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Редактировать отзыв' : 'Написать отзыв'}</Modal.Title>
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
                        {!editMode && (
                            <Form.Group controlId="formReviewImages">
                                <Form.Label>Изображения</Form.Label>
                                <Form.Control
                                    type="file"
                                    multiple
                                    onChange={(e) => setReviewImages(Array.from(e.target.files))}
                                />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeReviewModal}>Отмена</Button>
                    <Button variant="primary" onClick={handleCreateOrEditReview}>
                        {editMode ? 'Сохранить' : 'Отправить'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default Reviews;
