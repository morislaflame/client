import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { Card, Button, Form, Modal, Spinner } from 'react-bootstrap';
import Slider from 'react-slick';
import CommentList from '../CommentList/CommentList';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { HiMiniPencilSquare } from "react-icons/hi2";
import { message, Image } from 'antd'; // Импортируем Image из antd
import styles from './Reviews.module.css'
import StarRating from '../StarRating/StarRating';
import { HiMiniTrash } from "react-icons/hi2";
import StarRatingInput from '../StarRatingInput/StarRatingInput';
import ImageUploader from '../ImageUploader/ImageUploader';
import ExpandableText from '../ExpandableText/ExpandableText';

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
    }, [review]);

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
                message.success('Review changed');
            } else {
                await review.addReview(newReviewText, newReviewRating, reviewImages);
                message.success('Thanks for your feedback!');
            }
            setNewReviewText('');
            setNewReviewRating(5);
            setReviewImages([]);
            closeReviewModal();
        } catch (error) {
            message.error('Error when saving a review: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteReview = async (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот отзыв?');
        if (confirmDelete) {
            try {
                await review.removeReview(id);
                message.success('Отзыв успешно удален');
            } catch (error) {
                message.error('Ошибка при удалении отзыва: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const loadMoreReviews = () => {
        review.loadMoreReviews();
    };

    if (review.loading && review.reviews.length === 0) {
        return <Spinner animation="border" />;
    }

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        autoplay: false,
        arrows: true,
        centerMode: true,
        centerPadding: "20px",
        swipeToSlide: true,
        focusOnSelect: true,
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
                                                        <>
                                                            <Button variant="dark" onClick={() => openReviewModal(rev)}><HiMiniPencilSquare /></Button>
                                                            <Button variant="dark" onClick={() => handleDeleteReview(rev.id)}><HiMiniTrash /></Button>
                                                        </>
                                                    )}
                                                </div>
                                                <span> <StarRating rating={rev.rating}/> </span>
                                            </Card.Header>
                                            <Card.Body className={styles.review_body}>
                                                <ExpandableText text={rev.text} maxHeight={100} style={{width: '70%'}}/>
                                                <div className={styles.rev_images}>
                                                    {rev.images && rev.images.map((img) => (
                                                        <Image
                                                            key={img.id}
                                                            src={`${process.env.REACT_APP_API_URL}/${img.img}`}
                                                            alt="Review"
                                                            className={styles.rev_img}
                                                            width={100} // Установите подходящий размер
                                                            style={{ cursor: 'pointer' }}
                                                            placeholder={<Spinner animation='border'/>}
                                                        />
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
            <Modal 
                className={styles.rev_modal} 
                dialogClassName={styles.rev_modal_dialog}
                contentClassName={styles.rev_modal_content}
                show={showReviewModal} onHide={closeReviewModal}>
                <Modal.Header className={styles.rev_modal_header}>
                    <Modal.Title>{editMode ? 'Edit feedback' : 'Write feedback'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.rev_modal_body}>
                    <Form className={styles.rev_form}>
                        <Form.Group controlId="formReviewRating" className={styles.rev_modal_stars}>
                            <StarRatingInput rating={newReviewRating} setRating={setNewReviewRating} />
                        </Form.Group>
                        <Form.Group controlId="formReviewText" className={styles.rev_modal_input}>
                            {/* <Form.Label>Text</Form.Label> */}
                            <div className='skelet'></div>
                            <Form.Control
                                as="textarea"
                                placeholder="Your experience using our service"
                                rows={3}
                                value={newReviewText}
                                onChange={(e) => setNewReviewText(e.target.value)}
                            />
                        </Form.Group>
                        

                        {!editMode && (
                            <Form.Group controlId="formReviewImages">
                                {/* <Form.Label>Images</Form.Label> */}
                                <ImageUploader images={reviewImages} setImages={setReviewImages} />
                            </Form.Group>
                        )}

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={closeReviewModal} className={styles.cancel_btn}>Cancel</button>
                    <button onClick={handleCreateOrEditReview} className={styles.save_btn}>
                        {editMode ? 'Save' : 'Send'}
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default Reviews;
