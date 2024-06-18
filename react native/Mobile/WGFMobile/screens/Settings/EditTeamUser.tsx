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
//import DatePicker from 'react-native-datepicker';
import { DeleteTeamUsers, InviteTeamUsers, UpdateTeamUsers } from '../../services/UserService';
import { color } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomDateTimePicker from '../../components/CustomDateTimePicker';


const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    // date: "",
    teamRole: "",

};

export const EditTeamUser = () => {
    const navigation = useNavigation();
    const route = useRoute()
    const isFocused = useIsFocused();
    const [menuVisible, setMenuVisible] = React.useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const [profileData, setProfileData] = useState(initialState);
    const [openRole, setOpenRole] = useState(false);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());
    const [role, setRole] = useState(0);
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [open, setOpen] = React.useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateButtonText, setDateButtonText] = useState("User Expires");

    const [roleItems, setRoleItems] = useState([
        { label: 'Administrator', value: 1 },
        { label: 'Coach', value: 2 },
        { label: 'Athelete', value: 3 },
        { label: 'Parent', value: 4 },
        { label: 'Referee', value: 5 },
        { label: 'Media', value: 6 }
    ]);


    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

    function deleteUserHandler() {
        return Alert.alert(
            "Remove User",
            `Are you sure you want to remove ${initialState.email}?`,
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        await DeleteTeamUsers(route.params?.params?.userId);
                        setNotification({ type: "success", text: "User removed." });
                        navigation.navigate("Users");
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

    function resendInviteHandler() {
        return Alert.alert(
            "Resend Invitation",
            `Are you sure you want to resend an invitation?`,
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        let data = {
                            "UserId": route.params?.params.userId ?? 0,
                            "TeamId": 0,
                            "EmailAddress": route.params?.params.emailAddress
                        };
                        await InviteTeamUsers(data);
                        setNotification({ type: "success", text: "Invitation sent successfully." });
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

    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerShown: false,
        });

    });

    useLayoutEffect(() => {
        const routedData = route.params?.params;
        initialState.firstName = routedData?.firstName;
        initialState.lastName = routedData?.lastName;
        initialState.email = routedData?.emailAddress;
        initialState.mobile = routedData?.phone;
        if (routedData?.dateExpired != null) {
            // setDate(new Date(routedData?.dateExpired));
            setDateButtonText(new Date(routedData?.dateExpired).toDateString());
            const d = new Date(routedData?.dateExpired);
            setDate(d);
        }
        setRole(routedData?.teamRole);
    }, [route]);




    const validateSchema = yup.object({
        firstName: yup.string().trim().required("First Name is required."),
        lastName: yup.string().trim().required("Last Name is required."),
        email: yup.string().trim().email("Invalid email address.").required("Email is required."),
        // teamRole: yup.string().trim().required("Team Role is required")
    });

    const saveUserHandler = async (values: any) => {
        closeMenu();
        let data = {
            "TeamId": route.params?.params?.teamId,
            "UserId": route.params?.params?.userId,
            "FirstName": values.firstName,
            "LastName": values.lastName,
            "EmailAddress": values.email,
            "Phone": values.mobile,
            "TeamRole": role,
            "DateExpired": date,
            "AddUserId": route.params?.params?.addUserId,
            "FullName": "",
            "UserPassword": ""
        }

        return Alert.alert(
            "Edit User",
            `Are you sure you want to edit ${data.EmailAddress}?`,
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        let response = await UpdateTeamUsers(data);
                        setNotification({ type: "success", text: "User updated." });
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

    function goBack() {
        navigation.navigate("Users");
    }



    return (
        isFocused && (

            <SafeAreaView style={styles.container}>
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
                        paddingLeft: 16,
                    }}
                    >Edit User</Text>
                    <TouchableOpacity style={{ marginLeft: "70%", paddingLeft: "2%" }} onPress={openMenu}>
                        {/* <Ionicons name="ellipsis-vertical" size={30} color={theme.colors.text} /> */}
                        <Pressable
                            onPress={openMenu}
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}>
                            <Menu
                                visible={menuVisible}
                                onDismiss={closeMenu}
                                anchor={
                                    <Ionicons name="ellipsis-vertical" size={30} color={theme.colors.text} />
                                }>
                                {/* <Menu.Item onPress={() => { saveUserHandler }} title="Save User" /> */}
                                <Menu.Item onPress={() => { closeMenu(); deleteUserHandler(); }} title="Delete User" />
                                <Menu.Item onPress={() => { closeMenu(); resendInviteHandler(); }} title="Resend Invite" />
                            </Menu>
                        </Pressable>
                    </TouchableOpacity>

                </View>
                {

                    isSubmitting && isSubmitting == true ? (
                        <View style={styles.processingIndicator}>
                            <ProcessingIndicator isLoading={isSubmitting} indicatorColor={theme.colors.text} />
                        </View>
                    ) :
                        (
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
                                                                props.touched.firstName && props.errors.firstName
                                                                    ? true
                                                                    : false
                                                            }
                                                            mode="flat"
                                                            //  autoComplete='firstName'
                                                            onChangeText={props.handleChange("firstName")}
                                                            value={props.values.firstName}
                                                            placeholder=""
                                                            placeholderTextColor={theme.colors.placeholder}
                                                            label="First Name *"
                                                            autoCapitalize="none"
                                                            keyboardType="default"
                                                            returnKeyType="next"
                                                            activeUnderlineColor={Colors.blue700}
                                                            onSubmitEditing={() => {
                                                                props.lastName.focus()
                                                            }}
                                                            onBlur={props.handleBlur("firstName")}
                                                            blurOnSubmit={false}
                                                        />
                                                        <Text style={{ color: theme.colors.error }}>
                                                            {/* {props.touched.firstName && props.errors.firstName} */}
                                                        </Text>

                                                        <TextInput
                                                            ref={(input: any) => {
                                                                props.lastName = input;
                                                            }}
                                                            error={
                                                                props.touched.lastName && props.errors.lastName
                                                                    ? true
                                                                    : false
                                                            }
                                                            mode="flat"
                                                            //   autoComplete='lastName'
                                                            onChangeText={props.handleChange("lastName")}
                                                            value={props.values.lastName}
                                                            placeholder=""
                                                            placeholderTextColor={theme.colors.placeholder}
                                                            label="Last Name *"
                                                            autoCapitalize="none"
                                                            keyboardType="default"
                                                            returnKeyType="next"
                                                            activeUnderlineColor={Colors.blue700}
                                                            onSubmitEditing={() => {
                                                                props.mobile.focus()
                                                            }}
                                                            onBlur={props.handleBlur("lastName")}
                                                            blurOnSubmit={false}
                                                        />

                                                        <Text style={{ color: theme.colors.error }}>
                                                            {/* {props.touched.email && props.errors.email} */}
                                                        </Text>

                                                        <TextInput
                                                            ref={(input: any) => {
                                                                props.mobile = input;
                                                            }}
                                                            mode="flat"
                                                            //  autoComplete='mobile'
                                                            onChangeText={props.handleChange("mobile")}
                                                            value={props.values.mobile}
                                                            placeholder=""
                                                            placeholderTextColor={theme.colors.placeholder}
                                                            label="Mobile"
                                                            autoCapitalize="none"
                                                            keyboardType="phone-pad"
                                                            returnKeyType="next"
                                                            activeUnderlineColor={Colors.blue700}
                                                            onSubmitEditing={() => {
                                                                props.email.focus()
                                                            }}
                                                            onBlur={props.handleBlur("mobile")}
                                                            blurOnSubmit={false}
                                                        />
                                                        <Text style={{ color: theme.colors.error }}>
                                                            {/* {props.touched.lastName && props.errors.lastName} */}
                                                        </Text>
                                                        <View style={{
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: theme.colors.disabled
                                                        }}>
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
                                                                label="Email Address*"
                                                                autoCapitalize="none"
                                                                keyboardType="email-address"
                                                                returnKeyType="next"
                                                                activeUnderlineColor={Colors.blue700}
                                                                // onSubmitEditing={() => {
                                                                //     props.mobile.focus()
                                                                // }}
                                                                onBlur={props.handleBlur("email")}
                                                                blurOnSubmit={false}
                                                                disabled={true}
                                                            />
                                                        </View>



                                                        <Text style={{ color: theme.colors.error }}>
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
                                                                    placeholder="Remove User Date"
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
                                                                            paddingLeft: 0,
                                                                            marginRight: 200

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
                                                                value={new Date(route.params?.params?.dateExpired)}
                                                            />

                                                        </View>
                                                        <Text style={{ color: theme.colors.error }}>
                                                        </Text>

                                                        <DropDown

                                                            label={"Team Role*"}
                                                            mode={"flat"}
                                                            visible={openRole}
                                                            showDropDown={() => setOpenRole(true)}
                                                            onDismiss={() => setOpenRole(false)}
                                                            value={role}
                                                            setValue={setRole}
                                                            list={roleItems}
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
                                                            <Text style={{ color: 'white' }}>Save</Text>
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
        flex: 1, padding: 0, margin: 0, marginTop: "10%",
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
})