import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppStoreContext } from "./AppStoreProvider";
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { setShoppingCart } = useContext(AppStoreContext);
  const [isLogginChecked, setIsLogginChecked] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUser({ ...res.data.user });
        setIsLogginChecked(true);
        setShoppingCart(
          res.data.shopping_cart.map((item) => {
            item.isUpdate = false;
            item.purchase = false;
            return item;
          })
        );
      })
      .catch((err) => {
        setIsLogginChecked(true);
      });
  }, []);
  return (
    <AuthContext.Provider
      value={{ isLogginChecked, setIsLogginChecked, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
