import 'intl';
import 'intl/locale-data/jsonp/en';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react"
import { Platform, Pressable, SafeAreaView, ScrollView, Text, View, StyleSheet, Alert, } from "react-native"
import { Button, Colors, Menu, useTheme, TextInput, Divider } from "react-native-paper";
import { Formik } from "formik";
import * as yup from "yup";
import { PreferencesContext } from "../../PreferencesContext";
import ProcessingIndicator from "../../components/ProcessingIndicator";
import DropDown from "react-native-paper-dropdown";
import Toastbar from "../../components/Toastbar";
import { MessageModel } from "../../services/Model/MessageModel";
import { SaveTeamUsers } from '../../services/UserService';
import { PaymentCheckoutResource } from '../../services/Model/PaymentModel';
import { getUserTeams } from '../../services/DashboardService';
import { TeamModel } from '../../services/Model/TeamModel';
import { checkoutStripePayment } from '../../services/PaymentService';


const initialState = {
    cardholderName: "",
    cardAddress: "",
    email: "",
    cardNumber: "",
    cvc: "",
};

export const Paymentcreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const [profileData, setProfileData] = useState(initialState);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2022);
    const [subscription, setSubscription] = useState(100);
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [openMonth, setOpenMonth] = React.useState(false);
    const [openYear, setOpenYear] = React.useState(false);
    const [openSubscription, setOpenSubscription] = React.useState(false);
    const [teamName, setTeamName] = React.useState("");


    const [monthItems, setMonthItems] = useState([
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ]);
    const [yearItems, setYearItems] = useState([
        { value: 2022, label: "2022" },
        { value: 2023, label: "2023" },
        { value: 2024, label: "2024" },
        { value: 2025, label: "2025" },
        { value: 2026, label: "2026" },
        { value: 2027, label: "2027" },
        { value: 2028, label: "2028" },
        { value: 2029, label: "2029" },
        { value: 2030, label: "2030" },
    ]);

    const [subscriptionItems, setsubscriptionItems] = useState([
        { value: 100, label: "Unlimited Film $100/year" },
    ]);


    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

    useLayoutEffect(() => {
        const init = async () => {
            let responseUserTeams = await getUserTeams(userContext.userInfo.userId);
            if (responseUserTeams) {
                let result: TeamModel[] = JSON.parse(JSON.stringify(responseUserTeams));
                let name = result.filter(c => c.teamId === userContext.userInfo.teamId)[0].teamName;
                setTeamName(name);
            }
        }
        init();
    });


    const validateSchema = yup.object({
        cardholderName: yup.string().trim().required("Cardholder Name is required."),
        cardAddress: yup.string().trim().required("Card Address is required."),
        email: yup.string().trim().email("Invalid email address.").required("Email is required."),
        cardNumber: yup.string().trim().required("Card Number is required."),
        cvc: yup.string().trim().required("CVC Number is required.")
    });

    const makePaymentHandler = async (values: any) => {


        Alert.alert(
            "Payment Confirmation",
            `You are renewing the subscription of ${teamName} for ${subscriptionItems.filter(c => c.value == subscription)[0].label}. Do you want to proceed?`
            , [
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            var data: PaymentCheckoutResource = new PaymentCheckoutResource;
                            data.Address = values.cardAddress;
                            data.CVC = values.cvc;
                            data.amount = subscription;
                            data.cardNumber = values.cardNumber;
                            data.cardholderName = values.cardholderName;
                            data.email = values.email;
                            data.expirationMonth = month;
                            data.expirationYear = year;
                            data.teamId = userContext.userInfo.teamId;
                            data.userId = userContext.userInfo.userId;
                            data.type = "S";  //hard coded S for stripe
                            var result = await checkoutStripePayment(data);
                            if (result.status == "200") {
                                setNotification({ type: "success", text: "Payment Successful" });
                                navigation.navigate("Dashboard");
                            }
                        } catch (error) {
                            setNotification({ type: "success", text: "Something went" });
                        }
                        // setNotification({ type: "success", text: "" });
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                },
            ]
        )

    }



    return (
        isFocused && (

            <SafeAreaView style={styles.container}>

                {

                    isSubmitting && isSubmitting == true ? (
                        <View style={styles.processingIndicator}>
                            <ProcessingIndicator isLoading={isSubmitting} indicatorColor={theme.colors.text} />
                        </View>
                    ) :
                        (
                            <>
                                <ScrollView style={{ height: 'auto', marginTop: "5%" }}>
                                    <View style={[{ flex: 1, padding: 20, paddingTop: 0 }]}>

                                        <Formik
                                            enableReinitialize={true}
                                            initialValues={profileData}
                                            validationSchema={validateSchema}
                                            onSubmit={(values) => makePaymentHandler(values)}

                                        >
                                            {(props) => (
                                                <>
                                                    <View  >
                                                        <TextInput
                                                            error={
                                                                props.touched.cardholderName && props.errors.cardholderName
                                                                    ? true
                                                                    : false
                                                            }
                                                            mode="flat"
                                                            // autoComplete='cardholderName'
                                                            onChangeText={props.handleChange("cardholderName")}
                                                            value={props.values.cardholderName}
                                                            placeholder=""
                                                            placeholderTextColor={theme.colors.placeholder}
                                                            label="Cardholder Name *"
                                                            autoCapitalize="none"
                                                            keyboardType="default"
                                                            returnKeyType="next"
                                                            activeUnderlineColor={Colors.blue700}
                                                            onSubmitEditing={() => {
                                                                props.cardAddress.focus()
                                                            }}
                                                            onBlur={props.handleBlur("cardholderName")}
                                                            blurOnSubmit={false}
                                                        />
                                                        <Text style={{ color: theme.colors.error }}>
                                                        </Text>

                                                        <TextInput
                                                            ref={(input: any) => {
                                                                props.cardAddress = input;
                                                            }}
                                                            error={
                                                                props.touched.cardAddress && props.errors.cardAddress
                                                                    ? true
                                                                    : false
                                                            }
                                                            mode="flat"
                                                            // autoComplete='cardAddress'
                                                            onChangeText={props.handleChange("cardAddress")}
                                                            value={props.values.cardAddress}
                                                            placeholder=""
                                                            placeholderTextColor={theme.colors.placeholder}
                                                            label="Card Address *"
                                                            autoCapitalize="none"
                                                            keyboardType="default"
                                                            returnKeyType="next"
                                                            activeUnderlineColor={Colors.blue700}
                                                            onSubmitEditing={() => {
                                                                props.email.focus()
                                                            }}
                                                            onBlur={props.handleBlur("cardAddress")}
                                                            blurOnSubmit={false}
                                                        />

                                                        <Text style={{ color: theme.colors.error }}>
                                                            {/* {props.touched.email && props.errors.email} */}
                                                        </Text>

                                                        <TextInput
                                                            ref={(input: any) => {
                                                                props.email = input;
                                                            }}
                                                            error={
                                                                props.touched.email && props.errors.email
                                                                    ? true
                                                                    : false
                                                            }
                                                            mode="flat"
                                                            autoComplete='email'
                                                            onChangeText={props.handleChange("email")}
                                                            value={props.values.email}
                                                            placeholder="email@examples.com"
                                                            placeholderTextColor={theme.colors.placeholder}
                                                            label="Email Address *"
                                                            autoCapitalize="none"
                                                            keyboardType="email-address"
                                                            returnKeyType="next"
                                                            activeUnderlineColor={Colors.blue700}
                                                            onSubmitEditing={() => {
                                                                props.cardNumber.focus()
                                                            }}
                                                            onBlur={props.handleBlur("email")}
                                                            blurOnSubmit={false}
                                                        />


                                                        <Text style={{ color: theme.colors.error }}>
                                                        </Text>


                                                        <TextInput
                                                            ref={(input: any) => {
                                                                props.cardNumber = input;
                                                            }}
                                                            error={
                                                                props.touched.cardNumber && props.errors.cardNumber
                                                                    ? true
                                                                    : false
                                                            }
                                                            mode="flat"
                                                            // autoComplete='cardNumber'
                                                            onChangeText={props.handleChange("cardNumber")}
                                                            value={props.values.cardNumber}
                                                            placeholder=""
                                                            placeholderTextColor={theme.colors.placeholder}
                                                            label="Card Number *"
                                                            autoCapitalize="none"
                                                            keyboardType="default"
                                                            returnKeyType="next"
                                                            maxLength={30}
                                                            activeUnderlineColor={Colors.blue700}
                                                            // onSubmitEditing={() => {
                                                            //     props.email.focus()
                                                            // }}
                                                            onBlur={props.handleBlur("cardNumber")}
                                                            blurOnSubmit={false}
                                                        />
                                                        <Text style={{ color: theme.colors.error }}>
                                                            {/* {props.touched.lastName && props.errors.lastName} */}
                                                        </Text>

                                                        <DropDown
                                                            label={"Card Month *"}
                                                            mode={"flat"}
                                                            visible={openMonth}
                                                            showDropDown={() => setOpenMonth(true)}
                                                            onDismiss={() => setOpenMonth(false)}
                                                            value={month}
                                                            setValue={setMonth}
                                                            list={monthItems}
                                                            activeColor={userTeamColor}
                                                            theme={theme}
                                                        />

                                                        <Text style={{ color: theme.colors.error }}>
                                                        </Text>

                                                        <View style={{
                                                            flex: 1, flexDirection: "row", justifyContent: "space-between"
                                                        }}>
                                                            <View style={{ width: "45%" }}>
                                                                <TextInput
                                                                    ref={(input: any) => {
                                                                        props.cvc = input;
                                                                    }}
                                                                    error={
                                                                        props.touched.cvc && props.errors.cvc
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    mode="flat"
                                                                    // autoComplete='cvc'
                                                                    onChangeText={props.handleChange("cvc")}
                                                                    value={props.values.cvc}
                                                                    placeholder=""
                                                                    placeholderTextColor={theme.colors.placeholder}
                                                                    label="Card CVC *"
                                                                    autoCapitalize="none"
                                                                    keyboardType="phone-pad"
                                                                    returnKeyType="next"
                                                                    activeUnderlineColor={Colors.blue700}
                                                                    // onSubmitEditing={() => {
                                                                    //     props.email.focus()
                                                                    // }}
                                                                    onBlur={props.handleBlur("cvc")}
                                                                    blurOnSubmit={false}
                                                                />

                                                            </View>

                                                            <View style={{ width: "45%" }}>
                                                                <DropDown
                                                                    label={"Card Year *"}
                                                                    mode={"flat"}
                                                                    visible={openYear}
                                                                    showDropDown={() => setOpenYear(true)}
                                                                    onDismiss={() => setOpenYear(false)}
                                                                    value={year}
                                                                    setValue={setYear}
                                                                    list={yearItems}
                                                                    activeColor={userTeamColor}
                                                                    theme={theme}
                                                                />
                                                            </View>


                                                        </View>


                                                        <Text style={{ color: theme.colors.error }}>
                                                        </Text>


                                                        <DropDown
                                                            label={"Subscription *"}
                                                            mode={"flat"}
                                                            visible={openSubscription}
                                                            showDropDown={() => setOpenSubscription(true)}
                                                            onDismiss={() => setOpenSubscription(false)}
                                                            value={subscription}
                                                            setValue={setSubscription}
                                                            list={subscriptionItems}
                                                            activeColor={userTeamColor}
                                                            theme={theme}
                                                        />






                                                        <Text style={{ color: theme.colors.error }}>
                                                        </Text>

                                                    </View>

                                                    <View style={[styles.buttonContainter, { backgroundColor: theme.colors.background }]} >
                                                        <Button
                                                            disabled={isSubmitting}
                                                            loading={isSubmitting}
                                                            mode="contained"
                                                            onPress={props.handleSubmit}
                                                            style={{ backgroundColor: userTeamColor, width: '100%', paddingVertical: 10 }}
                                                        >
                                                            <Text style={{ color: 'white' }}>Buy Now</Text>
                                                        </Button>

                                                    </View>
                                                </>
                                            )}
                                        </Formik>
                                    </View>
                                </ScrollView >
                                <Toastbar message={message} onClose={() => setNotification({ type: "", text: "" })} />
                            </>
                        )
                }
            </SafeAreaView>

        )

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 0, margin: 0,
    },
    buttonContainter:
    {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    processingIndicator: {
        flex: 1,
        justifyContent: 'center',
    },
    datePicker: {
        height: "100%",
        width: Platform.OS == "android" ? "100%" : 180,
        borderWidth: 0,
    },
    dateIcon: {
        position: 'absolute',
        right: 10,
        top: 16,

    },
    datePickerContainer: {
        height: 60,
        // borderColor: '#cccccc',
        // borderRadius: 6,
        // borderWidth: 1,
        paddingLeft: 8,
        backgroundColor: '#ffffff',
    },
})