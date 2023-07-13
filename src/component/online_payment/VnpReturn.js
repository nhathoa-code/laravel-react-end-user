import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import axios from "axios";

const VnpReturn = () => {
  const [processing, setProcessing] = useState(true);
  const [SignatureValid, setSignatureValid] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const obj = Object.fromEntries(params);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/check_vnpay${window.location.search}`
      )
      .then((res) => {
        const { secureHash, order_id } = res.data;
        if (secureHash === obj["vnp_SecureHash"]) {
          setSignatureValid(true);
          if (obj["vnp_ResponseCode"] === "00") {
            setTransactionSuccess(true);
          } else {
            setTransactionSuccess(false);
          }
        } else {
          setSignatureValid(false);
        }
        setProcessing(false);
      });
  }, []);

  return (
    <>
      {processing ? (
        <Loader />
      ) : SignatureValid ? (
        transactionSuccess ? (
          navigate(`/account/order/${obj.vnp_TxnRef}`)
        ) : (
          "Giao dịch không thành công"
        )
      ) : (
        "chữ ký không hợp lệ"
      )}
    </>
  );
};

export default VnpReturn;
