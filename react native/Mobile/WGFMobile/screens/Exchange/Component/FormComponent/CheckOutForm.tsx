import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, Platform, ScrollView, Alert } from "react-native";
import { Text, useTheme, TextInput, Colors, Button } from "react-native-paper";
import * as yup from "yup";
//import DatePicker from 'react-native-datepicker';
import Toastbar from "../../../../components/Toastbar";
import { MessageModel } from "../../../../services/Model/MessageModel";
import DropDown from "react-native-paper-dropdown";
import { PreferencesContext } from "../../../../PreferencesContext";
import { LockerIn, LockerOut } from "../../../../services/Model/ExchangeModel";
import { insertLockOut } from "../../../../services/ExchangeService";
import CustomDateTimePicker from '../../../../components/CustomDateTimePicker';

const initialState = {
    title: "",
    tags: "",
};

export default function CheckOutForm({ route }: { route: any }) {
    const navigation = useNavigation();
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [profileData, setProfileData] = useState(initialState);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());
    const [role, setRole] = useState(0);
    const [type, setType] = useState("");
    const [view, setView] = useState(0);
    const [openType, setOpenType] = useState(false);
    const [openView, setOpenView] = useState(false);
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const [date, setDate] = React.useState<Date | undefined>(undefined);

    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

    const [typeItems, setTypeItems] = useState([
        { label: 'Game', value: 'Game' },
        { label: 'Practice', value: 'Practice' },
        { label: 'Scout', value: 'Scout' },
        { label: 'Training', value: 'Training' },
        { label: 'Other', value: 'Other' }
    ]);

    const [viewItems, setViewItems] = useState([
        { label: 'Misc', value: 1 },
        { label: 'All Sports', value: 2 },
        { label: 'Football', value: 3 },
        { label: 'Volleyball', value: 4 },
    ]);

    async function init() {
        try {


        } catch (error) {

        }

    }

    useLayoutEffect(() => {
        const formdata = route.params;
        initialState.title = formdata.title;

        setDate(formdata.date);

    }, [route])


    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerShown: false,
        });
    });

    useEffect(() => {
        init();
    }, []);

    const validateSchema = yup.object({
        title: yup.string().trim().required("Title is required.")
    });

    function goBack() {
        navigation.getParent()?.setOptions({
            headerShown: true,
        });
        navigation.goBack();
    }

    const saveUserHandler = async (values: any) => {

        if (type === "" || view === 0) {
            return;
        }

        Alert.alert(
            "",
            "Are you sure you want to post this League Locker film to the specified location? Please note that it may take a few minutes for the physical video to be copied to your team.",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            let data: LockerOut = new LockerOut;

                            data.group = type;
                            data.view = view;
                            data.filmDate = date;
                            data.title = values.title;
                            data.filmTags = values.tags
                            data.userId = userContext.userInfo.userId;
                            data.teamId = userContext.userInfo.teamId;
                            data.filmGuid = route.params.filmGuid;
                            console.log(data);

                            var result = await insertLockOut(data);
                            navigation.goBack();
                        } catch (error) {
                            console.log(error);
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
        );




    }


    return <SafeAreaView style={styles.container}>
        <View style={[{
            // marginTop: 100,
        },
        {
            backgroundColor: theme.colors.background, width: '100%', padding: 20, marginTop: Platform.OS === "ios" ? 0 : 0, zIndex: 1,
            paddingTop: Platform.OS === "ios" ? 50 : 20,
            flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#cacaca',
        }
        ]}>
            <MaterialIcons name="arrow-back" size={24} style={{ color: theme.colors.text }} onPress={() => goBack()} />
            <Text style={{
                fontSize: 20,
                color: theme.colors.placeholder,
                paddingLeft: 6,
            }}
            >Get League Locker Film</Text>
        </View>
        {(isSubmitting) ? (
            <></>
        ) : (
            <>
                <ScrollView style={{ height: 'auto' }}>
                    <View style={[{ flex: 1, padding: 20 }]}>
                        <View style={{
                            flex: 1,
                            marginBottom: 20,
                        }}>

                            {/* <Divider style={{ borderWidth: 0.5, borderColor: theme.colors.disabled }} /> */}
                        </View>
                        <Formik
                            enableReinitialize={true}
                            initialValues={profileData}
                            validationSchema={validateSchema}
                            onSubmit={(values) => saveUserHandler(values)}

                        >
                            {(props) => (
                                <>
                                    <View  >
                                        <TextInput
                                            error={
                                                props.touched.title && props.errors.title
                                                    ? true
                                                    : false
                                            }
                                            mode="flat"
                                            //autoComplete='title'
                                            onChangeText={props.handleChange("title")}
                                            value={props.values.title}
                                            placeholder=""
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Title *"
                                            autoCapitalize="none"
                                            keyboardType="default"
                                            returnKeyType="next"
                                            activeUnderlineColor={Colors.blue700}
                                            // onSubmitEditing={() => {
                                            //     props.tags.focus()
                                            // }}
                                            onBlur={props.handleBlur("title")}
                                            blurOnSubmit={false}
                                        />
                                        <Text style={{ color: theme.colors.error }}>
                                            {/* {props.touched.title && props.errors.title} */}
                                        </Text>

                                        {/* <View>
                                            <View style={[styles.datePickerContainer, {
                                                backgroundColor: theme.dark ? theme.colors.background : "#e3e3e3",
                                                borderBottomWidth: 1,
                                                borderBottomColor: theme.colors.disabled,
                                            }]}> */}
                                        {/* <DatePicker
                                                    style={styles.datePicker}
                                                    date={date}
                                                    mode="date"
                                                    placeholder="Date"
                                                    format="YYYY-MM-DD"
                                                    minDate="2000-01-01"
                                                    maxDate="2090-06-01"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateIcon: styles.dateIcon,
                                                        dateInput: {
                                                            paddingTop: 20,
                                                            borderWidth: 0,
                                                            // paddingLeft: 0,
                                                            paddingRight: 265

                                                        },
                                                        dateText: {
                                                            color: theme.colors.text
                                                        },

                                                        placeholderText: {
                                                            // marginLeft: Platform.OS === "android" ? -84 : -50,
                                                            fontSize: 16,
                                                            color: theme.colors.placeholder
                                                        }
                                                        // ... You can check the source to find the other keys.
                                                    }}
                                                    onDateChange={(date: any) => { setDate(date) }}
                                                /> */}
                                        {/* </View>

                                        </View> */}

                                        <View >

                                            <CustomDateTimePicker
                                                label='Date (MM/DD/YYYY)'
                                                onChange={(d) => setDate(d)}
                                                value={new Date(route.params.date)}
                                            />

                                        </View>

                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>

                                        <DropDown

                                            label={"Type"}
                                            mode={"flat"}
                                            visible={openType}
                                            showDropDown={() => setOpenType(true)}
                                            onDismiss={() => setOpenType(false)}
                                            value={type}
                                            setValue={setType}
                                            list={typeItems}
                                            activeColor={userTeamColor}
                                            theme={theme}
                                        />

                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>

                                        <TextInput
                                            ref={(input: any) => {
                                                props.tags = input;
                                            }}
                                            error={
                                                props.touched.tags && props.errors.tags
                                                    ? true
                                                    : false
                                            }
                                            mode="flat"
                                            // autoComplete='tags'
                                            onChangeText={props.handleChange("tags")}
                                            value={props.values.tags}
                                            placeholder=""
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Tags"
                                            autoCapitalize="none"
                                            keyboardType="default"
                                            returnKeyType="next"
                                            activeUnderlineColor={Colors.blue700}
                                            onBlur={props.handleBlur("tags")}
                                            blurOnSubmit={false}
                                        />

                                        <Text style={{ color: theme.colors.error }}>
                                            {/* {props.touched.email && props.errors.email} */}
                                        </Text>


                                        <DropDown

                                            label={"View"}
                                            mode={"flat"}
                                            visible={openView}
                                            showDropDown={() => setOpenView(true)}
                                            onDismiss={() => setOpenView(false)}
                                            value={view}
                                            setValue={setView}
                                            list={viewItems}
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
                                            style={{
                                                backgroundColor: userTeamColor, width: '100%', paddingVertical: 10
                                            }}

                                        >
                                            <Text style={{ color: 'white' }}>Post Locker Film to Team</Text>
                                        </Button>

                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                </ScrollView >
                <Toastbar message={message} onClose={() => setNotification({ type: "", text: "" })} />
            </>
        )}

    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 0, margin: 0, marginTop: "10%"
    },
    buttonContainter: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    datePicker: {
        height: "100%",
        width: Platform.OS == "android" ? "100%" : 180,
        borderWidth: 0
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

});