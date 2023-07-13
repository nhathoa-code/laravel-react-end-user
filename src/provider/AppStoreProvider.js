import React, { createContext, useState } from "react";

export const AppStoreContext = createContext({});

export const AppStoreProvider = ({ children }) => {
  const [shopping_cart, setShoppingCart] = useState([]);
  const [chosenCoupon, setChosenCoupon] = useState(null);
  const [chosenFreeShip, setChosenFreeShip] = useState(null);
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState(null);
  const [products_to_compare, setProductsToCompare] = useState([]);
  const [productsCategories, setProductsCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [compareCat, setCompareCat] = useState();
  const [posts, setPosts] = useState(null);
  const [post, setPost] = useState(null);
  const [chosen_post_category, setChosenPostCategory] = useState(null);
  return (
    <AppStoreContext.Provider
      value={{
        shopping_cart,
        setShoppingCart,
        chosenCoupon,
        setChosenCoupon,
        chosenFreeShip,
        setChosenFreeShip,
        categories,
        setCategories,
        notifications,
        setNotifications,
        products_to_compare,
        setProductsToCompare,
        compareCat,
        setCompareCat,
        productsCategories,
        setProductsCategories,
        banners,
        setBanners,
        posts,
        setPosts,
        post,
        setPost,
        chosen_post_category,
        setChosenPostCategory,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
};
