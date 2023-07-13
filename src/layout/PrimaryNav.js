import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import parse from "html-react-parser";
import { AppStoreContext } from "../provider/AppStoreProvider";
import { Link } from "react-router-dom";
import { Skeleton } from "@mui/material";

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}

const PrimaryNav = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { categories, setCategories, setChosenPostCategory } =
    useContext(AppStoreContext);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/all_categories`)
      .then((res) => {
        console.log(res.data);
        setIsLoading(false);
        // setCategories(res.data);
        setCategories(() => {
          return array_move(res.data, 7, 3);
        });
      });
  }, []);

  console.log(categories);

  return (
    <div id="block_nav_primary">
      <div className="container_12 primary_nav">
        <div
          style={{ backgroundColor: "#041e3a" }}
          className="grid_12 primary_nav"
        >
          {isLoading ? (
            <Skeleton height={36} />
          ) : (
            <nav class="fs-menu">
              <div class="f-wrap">
                <ul class="fs-mnul clearfix">
                  {categories.map((item, index) => {
                    return (
                      <li key={index}>
                        <Link
                          to={`/${
                            item.slug === "pc-&-linh-kien"
                              ? "may-tinh-de-ban"
                              : item.slug
                          }`}
                          title={item.name}
                        >
                          {parse(item.icon)}
                          {item.name}
                        </Link>
                        {(item.hasOwnProperty("brands") ||
                          item.hasOwnProperty("attributes") ||
                          item.hasOwnProperty("children")) && (
                          <>
                            <div class="fs-mnsub">
                              <div class="fs-mnbox">
                                {item.hasOwnProperty("children") && (
                                  <div class="fs-mntd fs-mntd1">
                                    <ul class="fs-mnsul fs-mnsul3 clearfix">
                                      {item.children.map((child) => {
                                        return (
                                          <li>
                                            <Link
                                              to={`${
                                                item.slug === "pc-&-linh-kien"
                                                  ? ""
                                                  : item.slug
                                              }/${child.slug}`}
                                              title={child.name}
                                              onclick="ga('send', 'event', 'Header ', 'Click Navigation Hover', 'Router');"
                                            >
                                              {child.name}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                      {item.slug === "pc-&-linh-kien" && (
                                        <div
                                          style={{
                                            marginTop: "20px",
                                            width: "30%",
                                          }}
                                        >
                                          <Link to={"/build-pc"}>
                                            <p
                                              style={{
                                                fontSize: "13px",
                                                color: "#3d3d3d",
                                              }}
                                            >
                                              Xây dựng máy tính
                                            </p>
                                            <img
                                              style={{ width: "100%" }}
                                              src="https://www.gamespot.com/a/uploads/original/1551/15511094/3667472-gaming-pc-build-2020--how-to-build-a-gaming-pc-from-scratch-promothumb2.jpg"
                                            />
                                          </Link>
                                        </div>
                                      )}
                                    </ul>
                                  </div>
                                )}

                                {item.hasOwnProperty("brands") && (
                                  <div class="fs-mntd fs-mntd1">
                                    <p class="fs-mnstit">Hãng sản xuất</p>
                                    <ul class="fs-mnsul fs-mnsul3 clearfix">
                                      {item.brands.map((b) => {
                                        return (
                                          <li style={{ marginBottom: "10px" }}>
                                            <Link
                                              to={`/${item.slug}?hãng-sản-xuất=${b.id}`}
                                              title={b.name}
                                              onclick="ga('send', 'event', 'Header ', 'Click Navigation Hover ', 'Apple (iPhone)');"
                                            >
                                              <img
                                                style={{
                                                  width: "70px",
                                                  height: "auto",
                                                }}
                                                src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${b.image}`}
                                              />
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                )}
                                {item.hasOwnProperty("attributes") && (
                                  <>
                                    {item.attributes.map((attr) => {
                                      return (
                                        <div class="fs-mntd fs-mntd2">
                                          <p class="fs-mnstit">{attr.name}</p>
                                          <ul class="fs-mnsul fs-mnsul1 clearfix">
                                            {attr.values.map((val) => {
                                              return (
                                                <li>
                                                  <Link
                                                    to={`/${
                                                      item.slug
                                                    }?${attr.name.replace(
                                                      /[ ]+/g,
                                                      "-"
                                                    )}=${val.id}`}
                                                    title="Dưới 2 triệu"
                                                    onclick="ga('send', 'event', 'Header ', 'Click Navigation Hover ', 'Dưới 2 triệu');"
                                                  >
                                                    {val.value}
                                                  </Link>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>
                                      );
                                    })}
                                  </>
                                )}

                                <div class="fs-mntd fs-mntd3">
                                  <p class="fs-mnstit">Bán chạy nhất</p>
                                  <ul class="fs-mnsprod">
                                    {item.top_sold_products.map((item) => {
                                      return (
                                        <li class="clearfix">
                                          <Link
                                            class="fs-mnspimg"
                                            to={`/products/${item.slug}`}
                                          >
                                            <img
                                              alt={item.name}
                                              width="80"
                                              height="80"
                                              loading="lazy"
                                              src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                            />
                                          </Link>
                                          <div>
                                            <span>
                                              <Link
                                                to={`/products/${item.slug}`}
                                              >
                                                {item.name}
                                              </Link>
                                            </span>
                                            <p>
                                              {new Intl.NumberFormat({
                                                style: "currency",
                                              }).format(
                                                item.price -
                                                  item.discounted_price
                                              )}{" "}
                                              ₫
                                            </p>
                                          </div>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                                {/* <div class="fs-mntd fs-mntd4">
                                  <a
                                    target="_blank"
                                    href="https://fptshop.com.vn/dien-thoai/samsung-galaxy-s22"
                                    title="H4_Samsung"
                                  >
                                  <img
                                    data-src="https://images.fpt.shop/unsafe/fit-in/248x248/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/4/2/638160311337772781_20_07_2022_6 [Converted]-01 1.png"
                                    alt="H4_Samsung"
                                    width="248"
                                    height="248"
                                    loading="lazy"
                                    src="https://images.fpt.shop/unsafe/fit-in/248x248/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/4/2/638160311337772781_20_07_2022_6 [Converted]-01 1.png"
                                  />
                                  </a>
                                </div> */}
                              </div>
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrimaryNav;
