import React, { Fragment } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
  Link,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

const styles = StyleSheet.create({
  body: { fontFamily: "Roboto" },
  header: {
    margin: "20px auto",
  },
  logo: {
    backgroundColor: "#041e3a",
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    margin: "0 25px",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    // width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol1: {
    width: "30%",
  },
  tableCol2: {
    width: "25%",
  },
  tableCol3: {
    width: "20%",
  },
  tableCol4: {
    width: "25%",
  },

  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  image: {
    width: "100px",
    height: "100px",
  },
  footer: {
    margin: "15px 25px",
    flexDirection: "row",
  },
});

const PDF = ({ data }) => {
  let subtotal = 0;
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.logo}>VNH</Text>
        <Text style={styles.header}>Bảng giá sản phẩm</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol1, styles.tableCol]}>
              <Text style={styles.tableCell}>Tên sản phẩm</Text>
            </View>
            <View style={[styles.tableCol2, styles.tableCol]}>
              <Text style={styles.tableCell}>Đơn giá</Text>
            </View>
            <View style={[styles.tableCol3, styles.tableCol]}>
              <Text style={styles.tableCell}>Số lượng</Text>
            </View>
            <View style={[styles.tableCol4, styles.tableCol]}>
              <Text style={styles.tableCell}>Thành tiền</Text>
            </View>
          </View>
          {data.map((item) => {
            subtotal += item.quantity * (item.price - item.discounted_price);
            return (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol1, styles.tableCol]}>
                  <Link src={`http://localhost:3000/products/${item.slug}`}>
                    <Text style={styles.tableCell}>{item.name}</Text>
                  </Link>
                </View>
                <View style={[styles.tableCol2, styles.tableCol]}>
                  <Text style={styles.tableCell}>
                    {new Intl.NumberFormat({
                      style: "currency",
                    }).format(item.price - item.discounted_price)}
                    đ
                  </Text>
                </View>
                <View style={[styles.tableCol3, styles.tableCol]}>
                  <Text style={styles.tableCell}>{item.quantity}</Text>
                </View>
                <View style={[styles.tableCol4, styles.tableCol]}>
                  <Text style={styles.tableCell}>
                    {new Intl.NumberFormat({
                      style: "currency",
                    }).format(
                      item.quantity * (item.price - item.discounted_price)
                    )}
                    đ
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.footer}>
          <View style={{ width: "30%" }}>
            <Text>Tổng tiền</Text>
          </View>
          <View style={{ width: "70%", textAlign: "right" }}>
            <Text style={{ flex: 1 }}>
              {new Intl.NumberFormat({
                style: "currency",
              }).format(subtotal)}
              đ
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDF;
