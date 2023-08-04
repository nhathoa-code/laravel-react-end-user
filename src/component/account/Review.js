import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../loader/Loader";
import "./Review.css";

const Review = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/reviews`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setReviews(res.data);
      });
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {!loading ? (
        <>
          {reviews.length > 0 ? (
            <>
              <div
                style={{ boxShadow: "none", marginTop: "0" }}
                class="boxReview p-2 mt-3"
              >
                <div class="boxReview-comment my-2">
                  {reviews.map((review) => {
                    return (
                      <>
                        <div class="boxReview-comment-item mb-4">
                          <div class="boxReview-comment-item-title is-flex is-justify-content-space-between is-align-items-center">
                            <p class="date-time">{review.created_at}</p>
                          </div>
                          <div className="review">
                            <div
                              style={{ margin: "0", flex: "1" }}
                              class="boxReview-comment-item-review my-2 p-2"
                            >
                              <div class="item-review-rating is-flex is-align-items-center">
                                <strong>Đánh giá: </strong>
                                <div>
                                  {[1, 2, 3, 4, 5].map((item) => {
                                    return (
                                      <div class="icon is-active">
                                        <div class="icon is-active">
                                          <svg
                                            enable-background="new 0 0 15 15"
                                            viewBox="0 0 15 15"
                                            x="0"
                                            y="0"
                                            class="shopee-svg-icon shopee-rating-stars__hollow-star icon-rating"
                                          >
                                            <polygon
                                              fill={
                                                review.star >= item
                                                  ? "#f59e0b"
                                                  : "none"
                                              }
                                              points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              stroke-miterlimit="10"
                                            ></polygon>
                                          </svg>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              <div class="item-review-comment my-1 is-flex is-justify-content-space-between is-flex-direction-column">
                                <div class="comment-content">
                                  <p>
                                    <strong>Nhận xét : </strong>
                                    {review.content}
                                  </p>
                                </div>
                                <div class="comment-image is-flex">
                                  {review.hasOwnProperty("images") && (
                                    <>
                                      {review.images.map((item) => {
                                        return (
                                          <a
                                            // href="https://customer.cps.onl/storage/reviews/13816/d5c6c31fd1.png"
                                            class="spotlight"
                                          >
                                            <img
                                              src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item}`}
                                              style={{ height: "80px" }}
                                              loading="lazy"
                                              class="image"
                                            />
                                          </a>
                                        );
                                      })}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="product-review">
                              <img
                                style={{ width: "100px" }}
                                src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${review.product.image}`}
                              />
                              <p className="product-review-name">
                                {review.product.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <p>Không có đánh giá nào!</p>
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Review;
