import React, { useEffect, useState, useContext } from "react";
import { AppStoreContext } from "../../provider/AppStoreProvider";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";

const NewsLayout = () => {
  const {
    chosen_post_category,
    setChosenPostCategory,
    posts,
    setPosts,
    setPost,
  } = useContext(AppStoreContext);
  const [post_categories, setPostCategories] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [per_page, setPerPage] = useState(0);
  const [next_page_url, setNextPageUrl] = useState(null);
  const [latest_posts, setLatestPosts] = useState(null);
  const [most_viewed_posts, setMostViewedPosts] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    setIsLoadingMore(false);
    if (chosen_post_category) {
      axios
        .all([
          axios.get(
            `${process.env.REACT_APP_API_ENDPOINT}/posts/post_category/${chosen_post_category.id}`
          ),
          axios.get(
            `${process.env.REACT_APP_API_ENDPOINT}/posts/latest/${chosen_post_category.id}`
          ),
          axios.get(
            `${process.env.REACT_APP_API_ENDPOINT}/posts/most_viewed/${chosen_post_category.id}`
          ),
        ])
        .then(
          axios.spread((res1, res2, res3) => {
            setIsLoading(false);
            setPosts(res1.data.data);
            setTotal(res1.data.total);
            setPerPage(res1.data.per_page);
            setNextPageUrl(res1.data.next_page_url);
            // latest
            setLatestPosts(res2.data);
            // most viewed
            setMostViewedPosts(res3.data);
          })
        );
    } else {
      axios
        .all([
          axios.get(`${process.env.REACT_APP_API_ENDPOINT}/posts`),
          axios.get(`${process.env.REACT_APP_API_ENDPOINT}/posts/latest`),
          axios.get(`${process.env.REACT_APP_API_ENDPOINT}/posts/most_viewed`),
        ])
        .then(
          axios.spread((res1, res2, res3) => {
            setIsLoading(false);
            setPosts(res1.data.data);
            setTotal(res1.data.total);
            setPerPage(res1.data.per_page);
            setNextPageUrl(res1.data.next_page_url);
            // latest
            setLatestPosts(res2.data);
            // most viewed
            setMostViewedPosts(res3.data);
          })
        );
    }
  }, [chosen_post_category]);

  const handleLoadMore = (next_page_url) => {
    setIsLoadingMore(true);
    axios.get(next_page_url).then((res) => {
      setIsLoadingMore(false);
      setPosts((prev) => {
        return [...prev, ...res.data.data];
      });
      setNextPageUrl(res.data.data.next_page_url);
    });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/post/categories`)
      .then((res) => {
        setPostCategories(res.data);
      });
    document.querySelector("#main-top").style.position = "relative";
    return () => {
      if (document.querySelector("#main-top")) {
        document.querySelector("#main-top").style.position = "sticky";
      }
    };
  }, []);
  return (
    <section id="main" class="news">
      <div class="container">
        {post_categories && post_categories.length > 0 && (
          <ul class="news-menu">
            {post_categories.map((item) => {
              return (
                <li class="news-menu__item">
                  <Link
                    onClick={() => setChosenPostCategory(item)}
                    aria-current="page"
                    class={`news-menu__link${
                      chosen_post_category &&
                      chosen_post_category.slug === item.slug
                        ? " active"
                        : ""
                    }`}
                    to={`/tin-tuc/${item.slug}`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        <div class="row">
          {isLoading && <Loader fixed={true} />}
          <div class="col-9">
            <Outlet />
            {posts && (
              <div class="view_more">
                <div style={{ margin: 0 }}>
                  <div id="results-hits">
                    1 - {posts.length} trong {total} Bài viết
                  </div>
                  {next_page_url && (
                    <div class="view-btn">
                      <button
                        onClick={() => handleLoadMore(next_page_url)}
                        id="view-more"
                      >
                        {isLoadingMore ? (
                          " đang tải..."
                        ) : (
                          <>
                            Xem thêm{" "}
                            {total - posts.length > per_page
                              ? per_page
                              : total - posts.length}{" "}
                            Bài viết
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div class="col-3">
            {latest_posts && (
              <div class="card news-section">
                <div class="card-header">
                  <h2 class="card-title">Mới nhất</h2>
                </div>
                <div class="card-body">
                  <ul class="news-mostView">
                    {latest_posts.map((item, index) => {
                      return (
                        <li>
                          <span>{index + 1}</span>
                          <Link
                            onClick={() => setPost(item)}
                            to={`/tin-tuc/bai-viet/${item.slug}`}
                          >
                            <p>{item.title}</p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
            {most_viewed_posts && (
              <div class="card news-section">
                <div class="card-header">
                  <h2 class="card-title">Xem nhiều</h2>
                </div>
                <div class="card-body">
                  <ul class="news-mostView">
                    {most_viewed_posts.map((item, index) => {
                      return (
                        <li>
                          <span>{index + 1}</span>
                          <Link
                            onClick={() => setPost(item)}
                            to={`/tin-tuc/bai-viet/${item.slug}`}
                          >
                            <p>{item.title}</p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLayout;
