import React, { useEffect, useContext } from "react";
import { AppStoreContext } from "../../provider/AppStoreProvider";
import parse from "html-react-parser";
import axios from "axios";
import "./New.css";

const New = () => {
  const { post } = useContext(AppStoreContext);
  console.log(post);
  useEffect(() => {
    window.scrollTo(0, 0);
    axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/posts/increment_view/${post.id}`
    );
    if (document.querySelector(".news .view_more")) {
      document.querySelector(".news .view_more").style.display = "none";
    }
    return () => {
      if (document.querySelector(".news .view_more")) {
        document.querySelector(".news .view_more").style.display = "block";
      }
    };
  }, []);
  return (
    <div class="post-container">
      <div class="post-wrap">
        <div
          style={{ display: "none" }}
          class="data__title post__title"
          data-id="159037"
          data-cate="thu-thuat"
        ></div>
        <h1 class="post__title show" data-id="159037" data-cate="thu-thuat">
          {post.title}
        </h1>
        <div class="post__user border-bottom">
          <span class="author-avatar">
            {post.author.picture ? (
              <img
                src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${post.author.picture}`}
              />
            ) : (
              <img src="/images/avatar.png" />
            )}
          </span>
          <div>
            <span class="author-name">{post.author.name}</span>
            <div class="author-info">
              <span class="post-time">{post.created_at}</span>
            </div>
          </div>
        </div>
        <h2 class="post__des">{post.description}</h2>
        <div class="post__content">{parse(post.content)}</div>
      </div>
    </div>
  );
};

export default New;
