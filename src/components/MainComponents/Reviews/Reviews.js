import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { HiMiniPencilSquare, HiMiniTrash } from "react-icons/hi2";
import { message, Image, Modal, Card, Button, Form, Input, Spin } from 'antd';
import styles from './Reviews.module.css';
import StarRating from '../../UI/StarRating/StarRating';
import StarRatingInput from '../../FuctionalComponents/StarRatingInput/StarRatingInput';
import ImageUploader from '../../FuctionalComponents/ImageUploader/ImageUploader';
import ExpandableText from '../../FuctionalComponents/ExpandableText/ExpandableText';

const { confirm } = Modal;
const { TextArea } = Input;

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
        confirm({
            title: 'Are you sure you want to delete this review?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await review.removeReview(id);
                    message.success('Review successfully deleted');
                } catch (error) {
                    message.error('Error deleting a review: ' + (error.response?.data?.message || error.message));
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const loadMoreReviews = () => {
        review.loadMoreReviews();
    };

    if (review.loading && review.reviews.length === 0) {
        return <Spin size="large" />;
    }

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        autoplay: false,
        arrows: false,
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
                    <button type="primary" onClick={() => openReviewModal()}>Leave a feedback</button>
                )}
            </div>
            <div style={{ maxWidth: '100%' }}>
                <Slider {...sliderSettings} className="slider">
                    {reviewsWithLoadMore.map((rev) => {
                        if (rev.isLoadMoreButton) {
                            return (
                                <div key="loadMore" className={styles.loadmore}>
                                    {review.hasMoreReviews ? (
                                        <Button style={{color: 'white', background: '#211F25', border: 'none'}} onClick={loadMoreReviews}>Load more</Button>
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
                                            <div className={styles.review_top}>
                                                <div className={styles.name_time}>
                                                    <strong>{rev.user.email || `@${rev.user.username}` || `Telegram ID: ${rev.user.telegramId}`}</strong> 
                                                    <span>{new Date(rev.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div className={styles.edit_button}>
                                                    {(user.user.id === rev.userId || user.user.role === 'ADMIN') && (
                                                        <>
                                                            <Button type="text" style={{color: 'white', background: '#6e6e6e66'}} onClick={() => openReviewModal(rev)}><HiMiniPencilSquare /></Button>
                                                            <Button type="text" style={{color: 'white', background: '#6e6e6e66'}} onClick={() => handleDeleteReview(rev.id)}><HiMiniTrash /></Button>
                                                        </>
                                                    )}
                                                </div>
                                                <span><StarRating rating={rev.rating}/></span>
                                            </div>
                                            <div className={styles.review_body}>
                                                <ExpandableText text={rev.text} maxHeight={100} style={{width: '70%'}}/>
                                                <div className={styles.rev_images}>
                                                    {rev.images && rev.images.map((img) => (
                                                        <Image
                                                            key={img.id}
                                                            src={`${process.env.REACT_APP_API_URL}/${img.img}`}
                                                            alt="Review"
                                                            className={styles.rev_img}
                                                            width={100}
                                                            style={{ cursor: 'pointer' }}
                                                            placeholder={<Spin />}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            );
                        }
                    })}
                </Slider>
            </div>

            <Modal 
                title={editMode ? 'Edit feedback' : 'Write feedback'}
                open={showReviewModal}
                onCancel={closeReviewModal}
                footer={[
                    <Button key="cancel" onClick={closeReviewModal}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleCreateOrEditReview}>
                        {editMode ? 'Save' : 'Send'}
                    </Button>
                ]}
            >
                <Form layout="vertical">
                    <Form.Item>
                        <StarRatingInput value={newReviewRating} onChange={setNewReviewRating} />
                    </Form.Item>
                    <Form.Item>
                        <TextArea
                            rows={4}
                            placeholder="Your experience using our service"
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                        />
                    </Form.Item>
                    
                    {!editMode && (
                        <Form.Item>
                            <ImageUploader images={reviewImages} setImages={setReviewImages} />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
});

export default Reviews;
