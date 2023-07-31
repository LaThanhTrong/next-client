import {Page, View, Text, Document, StyleSheet, Image} from '@react-pdf/renderer'
import { Font } from "@react-pdf/renderer"

Font.register({
    family: "Roboto",
    fonts: [
      { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 600 },
    ],
})

const styles = StyleSheet.create({
    grey: {
        color: "grey",
    },
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        fontFamily: "Roboto",
      },
    title: {
        fontSize: 24,
        textAlign: "center",
        fontFamily: "Roboto",
        color: 'grey',
        marginBottom: 8,
    },
    h2: {
        fontSize: 18,
        fontFamily: "Roboto",
        marginBottom: 6,
        padding: 3,
    },
    h3: {
        fontSize: 15,
        fontFamily: "Roboto",
        padding: 3,
    },
    text: {
        fontSize: 14,
        textAlign: "justify",
        fontFamily: "Roboto",
        padding: 3,
    },
    stext: {
        fontSize: 10,
        fontFamily: "Roboto",
        color: "grey",
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
        fontFamily: "Roboto",
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: "center",
        color: "grey",
        fontFamily: "Roboto",
    },
    table: {
        width: '100%',
    },
    bold: {
        fontWeight: 'bold',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        borderTop: '1px solid #EEE',
        paddingTop: 8,
        paddingBottom: 12,
        fontFamily: "Roboto",
    },
    line: {
        borderTop: '1px solid #EEE',
        width: '100%',
        marginBottom: '20px',
    },
    row1: {
        fontSize: 14,
        textAlign: 'left',
        width: '40%',
        fontFamily: "Roboto",
    },
    row2: {
        fontSize: 14,
        textAlign: 'left',
        width: '15%',
        fontFamily: "Roboto",
    },
    row3: {
        fontSize: 14,
        textAlign: 'left',
        width: '15%',
        fontFamily: "Roboto",
    },
    row4: {
        fontSize: 14,
        textAlign: 'left',
        width: '30%',
        fontFamily: "Roboto",
    },
    flex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    image: {
        width: '150px',
        height: 'auto',
    },
    hw: {
        width: '50%',
        padding: 10,
    },
})

const PDFFile = ({order}) => {
    let sum = 0
    let n = order.line_items.length
    for (let i = 0; i < n; i++) {
        sum += order.line_items[i].price_data.unit_amount
    }
    
    return (
        <Document>
            <Page style={styles.body}>
                <View style={styles.flex}>
                    <View>
                        <Image style={styles.image} src="/images/template/logo.png"></Image>
                    </View>
                    <View>
                        <Text style={styles.title}>Invoice</Text>
                        <Text style={styles.text}><Text style={styles.grey}>Date created: </Text>{(new Date(order.createdAt)).toLocaleString()}</Text>
                        <Text style={styles.text}><Text style={styles.grey}>Order ID: </Text>{order._id}</Text>
                        <Text style={styles.text}><Text style={styles.grey}>Status: </Text>{order.paid === true ? "Paid" : "Failed"}</Text>
                    </View>
                </View>

                <View style={styles.line}></View>

                <View style={styles.flex}>
                    <View style={styles.hw}>
                        <Text style={styles.h2}>From:</Text>
                        <Text style={styles.text}>Company name</Text>
                        <Text style={[styles.text, styles.grey]}>Mealies</Text>
                        <Text style={styles.text}>Email</Text>
                        <Text style={[styles.text, styles.grey]}>elle322002@gmail.com</Text>
                        <Text style={styles.text}>Address</Text>
                        <Text style={[styles.text, styles.grey]}>21 Tran Hung Dao, phuong An Cu, quan Ninh Kieu, thanh pho Can Tho</Text>
                        <Text style={styles.text}>Contact</Text>
                        <Text style={[styles.text, styles.grey]}>0901248021</Text>
                    </View>
                    <View style={styles.hw}>
                        <Text style={styles.h2}>To:</Text>
                        <Text style={styles.text}>Customer</Text>
                        <Text style={[styles.text, styles.grey]}>{order.name}</Text>
                        <Text style={styles.text}>Email</Text>
                        <Text style={[styles.text, styles.grey]}>{order.email}</Text>
                        <Text style={styles.text}>Address</Text>
                        <Text style={[styles.text, styles.grey]}>{order.address}</Text>
                        <Text style={styles.text}>Contact</Text>
                        <Text style={[styles.text, styles.grey]}>{order.phoneNumber}</Text>
                    </View>
                </View>

                <View style={styles.line}></View>

                <Text style={styles.h2}>My Order:</Text>
                <View style={styles.table}>
                    <View style={[styles.row, styles.grey]}>
                        <Text style={styles.row1}>Products</Text>
                        <Text style={styles.row2}>Quantity</Text>
                        <Text style={styles.row3}>Price</Text>
                        <Text style={styles.row4}>Total</Text>
                    </View>
                    {order.line_items.map((row, i) => (
                        <View key={i} style={styles.row} wrap={false}>
                            <Text style={styles.row1}>
                                <Text style={styles.bold}>{row.price_data?.product_data.name}</Text>
                            </Text>
                            <Text style={styles.row2}>{row.quantity}</Text>
                            <Text style={styles.row3}>đ{(row.price_data?.unit_amount).toLocaleString()}</Text>
                            <Text style={styles.row4}>
                                <Text style={styles.bold}>đ{(row.price_data?.unit_amount * row.quantity).toLocaleString()}</Text>
                            </Text>
                        </View>
                    ))}
                    <View style={styles.flex}>
                        <Text style={styles.h3}>Sub Total: </Text>
                        <Text style={[styles.text, styles.bold]}>đ{sum.toLocaleString()}</Text>
                    </View>
                    <View style={styles.flex}>
                        <Text style={styles.h3}>Shipping Fee: </Text>
                        <Text style={[styles.text, styles.bold]}>đ{
                            order.shippingFee ? order.shippingFee.toLocaleString() : "0"}
                        </Text>
                    </View>
                    <View style={styles.flex}>
                        <Text style={styles.h3}>Discount: </Text>
                        <Text style={[styles.text, styles.bold]}>đ{
                            order.discount_amount ? order.discount_amount.toLocaleString() : "0"}
                        </Text>
                    </View>
                    <View style={styles.flex}>
                        <Text style={styles.h2}>Total: </Text>
                        <Text style={[styles.text, styles.bold]}>đ{
                            (sum + (order.shippingFee ? order.shippingFee : 0) - (order.discount_amount ? order.discount_amount : 0)).toLocaleString()}
                        </Text>
                    </View>
                </View>
                
            </Page>
        </Document>
    );
}

export default PDFFile;