import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Card, Button, Form, Modal, Spinner } from 'react-bootstrap';
import Slider from 'react-slick';
import CommentList from '../CommentList/CommentList';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { HiMiniPencilSquare } from "react-icons/hi2";
import { message } from 'antd';
import styles from './Reviews.module.css'
import StarRating from '../StarRating/StarRating';

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
            message.error('Error when saving a review: ' + (error.response?.data?.message || error.message));
        }
    };

    const loadMoreReviews = () => {
        review.loadMoreReviews();
    };

    if (review.loading && review.reviews.length === 0) {
        return <Spinner animation="border" />;
    }

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        autoplay: false,
        arrows: true,
        centerMode: true,
        centerPadding: "20px",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const reviewsWithLoadMore = [
        ...review.reviews,
        { id: 'loadMore', isLoadMoreButton: true },
    ];

    return (
        <div className={styles.reviews} style={{ width: '100%', overflow: 'hidden' }}>
            <div className={styles.review_header}>
                <h2>Reviews</h2>
                {user.isAuth && (
                    <button variant="primary" onClick={() => openReviewModal()}>Leave a feedback</button>
                )}
            </div>
            <div style={{ maxWidth: '100%' }}>
                <Slider {...sliderSettings} className="slider">
                    {reviewsWithLoadMore.map((rev) => {
                        if (rev.isLoadMoreButton) {
                            return (
                                <div key="loadMore" className={styles.loadmore}>
                                    {review.hasMoreReviews ? (
                                        <Button variant="secondary" onClick={loadMoreReviews}>Load more</Button>
                                    ) : (
                                        <p>There are no further reviews</p>
                                    )}
                                </div>
                            );
                        } else {
                            return (
                                <div className={styles.reviews_list} key={rev.id}>
                                    <Card className={styles.review_card}>
                                        <div className={styles.review_main}>
                                            <Card.Header className={styles.review_top}>
                                                <div className={styles.name_time}>
                                                    <strong>{rev.user.email}</strong> 
                                                    <span>{new Date(rev.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div className={styles.edit_button}>
                                                    {(user.user.id === rev.userId || user.user.role === 'ADMIN') && (
                                                        <Button variant="dark" onClick={() => openReviewModal(rev)}><HiMiniPencilSquare /></Button>
                                                    )}
                                                </div>
                                                <span> <StarRating rating={rev.rating}/> </span>
                                            </Card.Header>
                                            <Card.Body className={styles.review_body}>
                                                <Card.Text>{rev.text}</Card.Text>
                                                <div className={styles.rev_images}>
                                                    {rev.images && rev.images.map((img) => (
                                                        <img key={img.id} src={`${process.env.REACT_APP_API_URL}/${img.img}`} alt="Review" className={styles.rev_img} />
                                                    ))}
                                                </div>
                                            </Card.Body>
                                        </div>
                                        
                                        <Card.Footer className={styles.rev_footer}>
                                            <CommentList review={rev} />
                                        </Card.Footer>
                                        
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
                    <Modal.Title>{editMode ? 'Edit review' : 'Write review'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formReviewText">
                            <Form.Label>Text</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newReviewText}
                                onChange={(e) => setNewReviewText(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formReviewRating">
                            <Form.Label>Evaluation</Form.Label>
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
                                <Form.Label>Images</Form.Label>
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
                        {editMode ? 'Save' : 'Send'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default Reviews;
