import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Comment.css";
import Popup from "./popup/Popup";
import Loader from "./loader/Loader";

const CommentForm = ({
  name,
  product_id,
  comment_id,
  setModal,
  replied_item,
  setComments,
  setPopup,
}) => {
  const [processing, setProcessing] = useState(false);
  const style = {
    width: "calc(100% - 25px)",
    marginLeft: "auto",
  };

  useEffect(() => {
    const reply_form = document.querySelector("#comment-reply");
    reply_form.focus();
    reply_form.setSelectionRange(
      reply_form.value.length,
      reply_form.value.length
    );
  });

  const handleReply = () => {
    let commenter = localStorage.getItem("commenter");
    if (!commenter) {
      setModal(true);
    } else {
      if (document.querySelector("#comment-reply").value.length < 10) {
        return setPopup({
          message: "Bình luận của bạn quá ngắn!",
          btn2: "Đóng",
          action: () => {
            setPopup(null);
          },
        });
      }
      const data = {
        product_id: product_id,
        commenter: JSON.parse(localStorage.getItem("commenter")),
        content: document.querySelector("#comment-reply").value,
        reply_to: comment_id,
      };
      setProcessing(true);
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/comments`, data)
        .then((res) => {
          setProcessing(false);
          console.log(res.data);
          setPopup({
            message:
              "Bình luận của bạn sẽ được chúng tôi kiểm duyệt và trả lời trước khi hiển thị",
            btn2: "Đóng",
            action: () => {
              setPopup(null);
            },
          });
          document.querySelector("#comment-content").value = "";
          setComments((prev) => {
            replied_item.replied = false;
            return [...prev];
          });
        })
        .catch(() => {
          setProcessing(false);
        });
    }
  };

  return (
    <div
      style={style}
      class="comment-form-content is-flex is-justify-content-space-between"
    >
      {processing && <Loader fixed={true} />}
      <div class="textarea-comment">
        <textarea
          spellcheck="false"
          class="textarea"
          id="comment-reply"
          defaultValue={`@${name} `}
        ></textarea>{" "}
        <button onClick={handleReply} class="button">
          <div class="icon-paper-plane">
            <svg
              height="15"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"></path>
            </svg>
          </div>
          Gửi
        </button>
      </div>
    </div>
  );
};

const Comment = ({ product_id }) => {
  const [modal, setModal] = useState(false);
  const [commenter, setCommenter] = useState(undefined);
  const [comments, setComments] = useState([]);
  const [popup, setPopup] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleAddComment = () => {
    if (document.querySelector("#comment-content").value.length < 10) {
      return setPopup({
        message: "Bình luận của bạn quá ngắn!",
        btn2: "Đóng",
        action: () => {
          setPopup(null);
        },
      });
    }
    let commenter = localStorage.getItem("commenter");
    if (!commenter) {
      setModal(true);
    } else {
      const data = {
        product_id: product_id,
        commenter: JSON.parse(localStorage.getItem("commenter")),
        content: document.querySelector("#comment-content").value,
      };
      setProcessing(true);
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/comments`, data)
        .then((res) => {
          setProcessing(false);
          console.log(res.data);
          setPopup({
            message:
              "Bình luận của bạn sẽ được chúng tôi kiểm duyệt và trả lời trước khi hiển thị",
            btn2: "Đóng",
            action: () => {
              setPopup(null);
            },
          });
          document.querySelector("#comment-content").value = "";
        })
        .catch(() => {
          setProcessing(false);
        });
    }
  };

  useEffect(() => {
    const commenter = localStorage.getItem("commenter");
    if (commenter) {
      setCommenter(JSON.parse(localStorage.getItem("commenter")));
    }
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/comments?product_id=${product_id}`
      )
      .then((res) => {
        console.log(res.data);
        setComments(
          res.data.map((item) => {
            item.replied = false;
            if (item.hasOwnProperty("replies")) {
              item.replies = item.replies.map((item) => {
                item.replied = false;
                return item;
              });
            }
            return item;
          })
        );
      });
  }, []);

  const handleSaveCommenterInfo = (e) => {
    e.preventDefault();
    const formData = new FormData(
      document.querySelector("form#commenter-info")
    );
    const commenter_info = {
      Gender: formData.get("Gender"),
      Name: formData.get("Name"),
      Phone: formData.get("Phone"),
      Email: formData.get("Email"),
    };
    localStorage.setItem("commenter", JSON.stringify(commenter_info));
    setCommenter(commenter_info);
    setModal(false);
  };

  const commentReplied = (comment_id) => {
    setComments((prev) => {
      return [...prev].map((item) => {
        if (item.id === comment_id) {
          if (item.hasOwnProperty("replies")) {
            item.replies = item.replies.map((item) => {
              item.replied = false;
              return item;
            });
          }
          if (item.replied) {
            item.replied = false;
          } else {
            item.replied = true;
          }
          return item;
        } else {
          item.replied = false;
          if (item.hasOwnProperty("replies")) {
            item.replies = item.replies.map((item) => {
              item.replied = false;
              return item;
            });
          }
          return item;
        }
      });
    });
  };

  const replyReplied = (comment_id, reply_id) => {
    setComments((prev) => {
      return [...prev].map((item) => {
        if (item.id === comment_id) {
          item.replied = false;
          if (item.hasOwnProperty("replies")) {
            item.replies = item.replies.map((item) => {
              if (item.id === reply_id) {
                if (item.replied) {
                  item.replied = false;
                } else {
                  item.replied = true;
                }
                return item;
              } else {
                item.replied = false;
                return item;
              }
            });
          }
          return item;
        } else {
          item.replied = false;
          return item;
        }
      });
    });
  };

  const changeInfo = () => {
    let commenter = JSON.parse(localStorage.getItem("commenter"));
    setCommenter(commenter);
    setModal(true);
  };

  return (
    <>
      {processing && <Loader fixed={true} />}
      {popup && <Popup {...popup} />}
      {modal && (
        <div className="fpt-comment">
          <div
            class="modal modal-md js-modal open"
            id="comment-rate-invalid"
            data-animation="on"
          >
            <div class="modal-wrapper" tabindex="-1">
              <div class="modal-box">
                <div class="modal-header modal-title">
                  <div class="heading f-s-p-24 f-w-500">
                    Thông tin người gửi
                  </div>
                  <span
                    onClick={() => setModal(false)}
                    class="modal-close js-modal-close"
                  >
                    <i class="cm-ic-close-thin cm-ic-md"></i>
                  </span>
                </div>
                <form id="commenter-info" onSubmit={handleSaveCommenterInfo}>
                  <div class="modal-body">
                    <div class="flex flex-wrap">
                      <div class="radio radio-sm m-r-16">
                        <input
                          id="u1"
                          type="radio"
                          name="Gender"
                          value="Boy"
                          defaultChecked={
                            commenter && commenter.Gender === "Boy"
                              ? true
                              : false
                          }
                        />
                        <label class="label label-sm" for="u1">
                          <span class="label-text">Anh</span>
                        </label>
                      </div>
                      <div class="radio radio-sm m-r-16">
                        <input
                          id="u2"
                          type="radio"
                          name="Gender"
                          value="Girl"
                          defaultChecked={
                            commenter && commenter.Gender === "Girl"
                              ? true
                              : false
                          }
                        />
                        <label class="label label-sm" for="u2">
                          <span class="label-text">Chị</span>
                        </label>
                      </div>
                    </div>
                    <div class="flex flex-between flex-wrap m-t-8">
                      <div class="form-group cs-form--half m-b-8">
                        <input
                          class="form-input form-input-md"
                          name="Name"
                          type="text"
                          placeholder="Nhập họ và tên"
                          defaultValue={(commenter && commenter.Name) || ""}
                        />
                      </div>
                      <div class="form-group cs-form--half m-b-8">
                        <input
                          class="form-input form-input-md"
                          name="Phone"
                          type="text"
                          placeholder="Nhập số điện thoại"
                          defaultValue={(commenter && commenter.Phone) || ""}
                        />
                      </div>
                      <div class="form-group cs-form--full">
                        <input
                          class="form-input form-input-md"
                          name="Email"
                          type="text"
                          placeholder="Nhập email (để nhận thông báo phản hồi)"
                          defaultValue={(commenter && commenter.Email) || ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="submit" class="btn btn-primary btn-lg">
                      HOÀN TẤT
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div product-id="16520" class="comment-container">
        <div class="comment-form">
          <p id="total_comment" class="comment-form-title title is-5 p-0 mb-1">
            Hỏi và đáp
          </p>
          {commenter && (
            <div className="fpt-comment">
              <div class="flex flex-center-ver m-b-8">
                <div class="text-grayscale-800 f-s-p-16 m-r-8">
                  Người bình luận: <strong>{commenter.Name}</strong>
                </div>
                <a onClick={changeInfo} class="link link-xs link-icon">
                  <span class="ic m-r-4">
                    <i class="cm-ic-edit cm-ic-xs text-link"></i>
                  </span>
                  Thay đổi
                </a>
              </div>
            </div>
          )}
          <div class="comment-form-content is-flex is-justify-content-space-between">
            <div class="textarea-comment">
              <textarea
                id="comment-content"
                spellcheck="false"
                placeholder="Xin mời để lại câu hỏi"
                class="textarea"
              ></textarea>
              <button onClick={handleAddComment} class="button">
                <div class="icon-paper-plane">
                  <svg
                    height="15"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"></path>
                  </svg>
                </div>
                Gửi
              </button>
            </div>
          </div>
        </div>
        <div class="block-comment__box-list-comment">
          <div id="page_comment_list" class="list-comment">
            <hr />
            {comments.length > 0 ? (
              <>
                {comments.map((item) => {
                  const commenter = JSON.parse(item.commenter);
                  return (
                    <div class="item-comment">
                      <div class="item-comment__box-cmt">
                        <div class="box-cmt__box-info">
                          <div class="box-info">
                            <div class="box-info__avatar">
                              <span>{commenter.Name.charAt(0)}</span>
                            </div>
                            <p class="box-info__name">{commenter.Name}</p>
                          </div>
                          <div class="box-time-cmt">
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                              >
                                <path
                                  id="clock"
                                  d="M7.72,8.78,5.25,6.31V3h1.5v2.69L8.78,7.72ZM6,0a6,6,0,1,0,6,6A6,6,0,0,0,6,0ZM6,10.5A4.5,4.5,0,1,1,10.5,6,4.5,4.5,0,0,1,6,10.5Z"
                                  fill="#707070"
                                ></path>
                              </svg>
                            </div>
                            &nbsp;1 tuần trước
                          </div>
                        </div>
                        <div class="box-cmt__box-question">
                          <div class="content">
                            <p>{item.content}</p>
                          </div>
                          <button
                            onClick={() => {
                              commentReplied(item.id);
                            }}
                            class="btn-rep-cmt respondent"
                          >
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="12"
                                viewBox="0 0 12 10.8"
                              >
                                <path
                                  id="chat"
                                  d="M3.48,8.32V4.6H1.2A1.2,1.2,0,0,0,0,5.8V9.4a1.2,1.2,0,0,0,1.2,1.2h.6v1.8l1.8-1.8h3A1.2,1.2,0,0,0,7.8,9.4V8.308a.574.574,0,0,1-.12.013H3.48ZM10.8,1.6H5.4A1.2,1.2,0,0,0,4.2,2.8V7.6H8.4l1.8,1.8V7.6h.6A1.2,1.2,0,0,0,12,6.4V2.8a1.2,1.2,0,0,0-1.2-1.2Z"
                                  transform="translate(0 -1.6)"
                                  fill="#707070"
                                ></path>
                              </svg>
                            </div>
                            &nbsp;Trả lời
                          </button>
                        </div>
                        {item.replied && (
                          <CommentForm
                            name={commenter.Name}
                            setModal={setModal}
                            product_id={item.product_id}
                            comment_id={item.id}
                            replied_item={item}
                            setComments={setComments}
                            setPopup={setPopup}
                          />
                        )}
                        <div class="item-comment__box-rep-comment">
                          <div class="list-rep-comment">
                            {item.hasOwnProperty("replies") && (
                              <>
                                {item.replies.map((reply) => {
                                  const commenter = JSON.parse(reply.commenter);
                                  return (
                                    <div class="item-rep-comment">
                                      <div class="box-cmt__box-info">
                                        <div class="box-info">
                                          <div class="box-info__avatar">
                                            <span>
                                              {commenter.Name.charAt(0)}
                                            </span>
                                          </div>
                                          <p class="box-info__name">
                                            {commenter.Name}
                                          </p>
                                          {commenter.QTV && (
                                            <span class="box-info__tag">
                                              QTV
                                            </span>
                                          )}
                                        </div>
                                        <div class="box-time-cmt">
                                          <div>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="12"
                                              height="12"
                                              viewBox="0 0 12 12"
                                            >
                                              <path
                                                id="clock"
                                                d="M7.72,8.78,5.25,6.31V3h1.5v2.69L8.78,7.72ZM6,0a6,6,0,1,0,6,6A6,6,0,0,0,6,0ZM6,10.5A4.5,4.5,0,1,1,10.5,6,4.5,4.5,0,0,1,6,10.5Z"
                                                fill="#707070"
                                              ></path>
                                            </svg>
                                          </div>
                                          &nbsp;2 tuần trước
                                        </div>
                                      </div>
                                      <div class="box-cmt__box-question">
                                        {reply.content}
                                        <button
                                          onClick={() => {
                                            replyReplied(item.id, reply.id);
                                          }}
                                          class="btn-rep-cmt respondent"
                                        >
                                          <div>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="13"
                                              height="12"
                                              viewBox="0 0 12 10.8"
                                            >
                                              <path
                                                id="chat"
                                                d="M3.48,8.32V4.6H1.2A1.2,1.2,0,0,0,0,5.8V9.4a1.2,1.2,0,0,0,1.2,1.2h.6v1.8l1.8-1.8h3A1.2,1.2,0,0,0,7.8,9.4V8.308a.574.574,0,0,1-.12.013H3.48ZM10.8,1.6H5.4A1.2,1.2,0,0,0,4.2,2.8V7.6H8.4l1.8,1.8V7.6h.6A1.2,1.2,0,0,0,12,6.4V2.8a1.2,1.2,0,0,0-1.2-1.2Z"
                                                transform="translate(0 -1.6)"
                                                fill="#707070"
                                              ></path>
                                            </svg>
                                          </div>
                                          &nbsp;Trả lời
                                        </button>
                                      </div>
                                      {reply.replied && (
                                        <CommentForm
                                          name={commenter.Name}
                                          setModal={setModal}
                                          product_id={reply.product_id}
                                          comment_id={item.id}
                                          replied_item={reply}
                                          setComments={setComments}
                                          setPopup={setPopup}
                                        />
                                      )}
                                    </div>
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
              </>
            ) : (
              "Chưa có bình luận nào"
            )}
          </div>
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
        </div>
      </div>
    </>
  );
};

export default Comment;
