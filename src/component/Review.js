import React from "react";

const Review = ({ reviews, averageStar, product_name }) => {
  return (
    <div class="boxReview p-2 mt-3">
      <p style={{ fontSize: "1.25rem", marginBottom: "10px" }} class="">
        Đánh giá và nhận xét {product_name}
      </p>
      <div class="boxReview-review is-flex">
        <div class="boxReview-score is-flex is-justify-content-center is-align-items-center">
          <p class="title is-4 m-0 p-0">{averageStar}/5</p>
          <div class="shopee-rating-stars">
            <div style={{ margin: "5px 0" }} class="shopee-rating-stars__stars">
              {[1, 2, 3, 4, 5].map((item) => {
                return (
                  <div class="shopee-rating-stars__star-wrapper">
                    <div
                      class="shopee-rating-stars__lit"
                      style={
                        averageStar > item
                          ? { width: "100%" }
                          : item - averageStar < 1
                          ? {
                              width: `${(averageStar - (item - 1)) * 100}%`,
                            }
                          : { width: "0%" }
                      }
                    >
                      <svg
                        enable-background="new 0 0 15 15"
                        viewBox="0 0 15 15"
                        x="0"
                        y="0"
                        class="shopee-svg-icon shopee-rating-stars__primary-star icon-rating-solid"
                      >
                        <polygon
                          points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                        ></polygon>
                      </svg>
                    </div>
                    <svg
                      enable-background="new 0 0 15 15"
                      viewBox="0 0 15 15"
                      x="0"
                      y="0"
                      class="shopee-svg-icon shopee-rating-stars__hollow-star icon-rating"
                    >
                      <polygon
                        fill="none"
                        points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                      ></polygon>
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>
          <p>
            <strong>{reviews.length}</strong> đánh giá và nhận xét
          </p>
        </div>
        <div class="boxReview-star is-flex is-justify-content-space-evenly">
          {[5, 4, 3, 2, 1].map((item) => {
            let starsReviewed = reviews.filter(
              (Item) => Item.star === item
            ).length;
            return (
              <div class="rating-level is-flex is-align-items-center is-justify-content-space-evenly">
                <div class="star-count is-flex is-align-items-center">
                  <span>{item}</span>
                  <div class="is-active">
                    <svg
                      enable-background="new 0 0 15 15"
                      viewBox="0 0 15 15"
                      x="0"
                      y="0"
                      class="shopee-svg-icon shopee-rating-stars__hollow-star icon-rating"
                    >
                      <polygon
                        fill="#f59e0b"
                        points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                      ></polygon>
                    </svg>
                  </div>
                </div>
                <progress
                  max={`${reviews.length}`}
                  value={`${starsReviewed}`}
                  class="progress is-small m-0"
                ></progress>
                <span class="is-size-7">{starsReviewed} đánh giá</span>
              </div>
            );
          })}
        </div>
      </div>
      <div class="boxReview-comment my-2">
        {reviews.length > 0 ? (
          <>
            {reviews.map((review) => {
              return (
                <div class="boxReview-comment-item mb-4">
                  <div class="boxReview-comment-item-title is-flex is-justify-content-space-between is-align-items-center">
                    <div class="is-flex is-align-items-center">
                      <p class="mr-2 is-flex is-align-items-center is-justify-content-center name-letter">
                        {review.reviewer.name.charAt(0)}
                      </p>
                      <span class="name">{review.reviewer.name}</span>
                    </div>
                    <p class="date-time">{review.created_at}</p>
                  </div>
                  <div class="boxReview-comment-item-review my-2 p-2">
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
                                      review.star >= item ? "#f59e0b" : "none"
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
                </div>
              );
            })}
            {/* <div class="pages">
              <div class="select-device__pagination">
                <ul class="pagination pagination-space">
                  <li class="pagination-item active">
                    <a class="pagination-link">1</a>
                  </li>
                  <li class="pagination-item">
                    <a class="pagination-link">2</a>
                  </li>
                  <li class="pagination-item">
                    <a class="pagination-link">3</a>
                  </li>
                  <li class="pagination-item">
                    <a class="pagination-link">4</a>
                  </li>
                  <li class="pagination-item">
                    <a class="pagination-link">5</a>
                  </li>
                  <li class="pagination-item">
                    <a class="pagination-link">
                      <i class="cm-ic-angle-right"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div> */}
          </>
        ) : (
          <p style={{ margin: "20px 0" }}>
            Chưa có đánh giá nào cho sản phẩm này!
          </p>
        )}
      </div>
    </div>
  );
};

export default Review;
