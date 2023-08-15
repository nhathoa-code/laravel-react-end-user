import React, { useContext, useEffect, useState } from "react";
import { AppStoreContext } from "../../provider/AppStoreProvider";
import { useParams, Link } from "react-router-dom";
import "./NewsLayout.css";
import axios from "axios";

const NewsCategory = () => {
  const { chosen_post_category, posts, setPosts, setPost } =
    useContext(AppStoreContext);
  const { slug } = useParams("slug");

  return (
    <>
      {posts && posts.length > 0 && (
        <div class="news-section norPost">
          <div class="card">
            <div class="p20">
              {posts.map((item) => {
                return (
                  <div class="news__item">
                    <Link
                      onClick={() => setPost(item)}
                      to={`/tin-tuc/bai-viet/${item.slug}`}
                      class="news__item__img"
                    >
                      <img
                        src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.post_thumbnail}`}
                        alt={`${item.title}`}
                      />
                    </Link>
                    <div class="news-item__info">
                      <Link
                        class="news__item__cate"
                        to={`/tin-tuc/${item.post_category.slug}`}
                      >
                        {item.post_category.name}
                      </Link>
                      <Link
                        onClick={() => setPost(item)}
                        to={`/tin-tuc/bai-viet/${item.slug}`}
                      >
                        <h3 class="news__item__tit">{item.title}</h3>
                      </Link>
                      <div class="news__item__text">{item.description}</div>
                      <p class="news__item__user">
                        <span>
                          {item.author.picture ? (
                            <img
                              src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.author.picture}`}
                              alt=""
                            />
                          ) : (
                            <img src="/images/avatar.png" alt="" />
                          )}
                        </span>
                        <span>{item.author.name}</span>
                        <span>-</span>
                        <span>
                          <time
                            datetime="2023-07-04T13:54:00.000Z"
                            title="lúc 20:54:00 Thứ Ba, 4 tháng 7, 2023"
                          >
                            {item.created_at}
                          </time>
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsCategory;
