import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    StyleSheet, Text, View,
    Pressable,
    SafeAreaView, Alert, ScrollView, ToastAndroid, Platform, ActionSheetIOS
} from 'react-native';
import { RootDrawerScreenProps } from "../types";
import { useIsFocused } from '@react-navigation/native';
import { TextInput, Button, Colors, Title, useTheme } from 'react-native-paper';
import { Formik, } from "formik";
import { getProfileData, LeaveTeamService, SaveUserSettings } from '../services/ProfileService';
import ResetPasswordModal from './Settings/Profile/ResetPassword'
import { Ionicons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';
import * as yup from "yup";
import DropDown from "react-native-paper-dropdown";
import { PreferencesContext } from '../PreferencesContext';
import Toastbar from '../components/Toastbar';
import { MessageModel } from '../services/Model/MessageModel';
import ProcessingIndicator from '../components/ProcessingIndicator';

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preference: "",
    notification: "",
};

export default function ProfileScreen({ navigation }: RootDrawerScreenProps<'Profile'>) {

    const theme = useTheme();

    const isFocused = useIsFocused();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [preference, setPreference] = useState(0);
    const [dnc, setDNC] = useState(0);
    const [owner, setOwner] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [isIOS, setIsIOS] = React.useState(false);
    const [openPreference, setOpenPreference] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [value, setValue] = useState(null);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());
    const { userContext } = React.useContext(PreferencesContext);
    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
    const [profileData, setProfileData] = useState(initialState);

    const [preferenceItems, setPreferenceItems] = useState([
        { label: 'Both', value: 0 },
        { label: 'Email', value: 1 },
        { label: 'Sms Text', value: 2 }
    ]);
    const [notificationItems, setNotificationItems] = useState([
        { label: 'Block Notification', value: 0 },
        { label: 'Receive Notification', value: 1 }
    ]);

    const [menuVisible, setMenuVisible] = React.useState(false);

    const openMenu = () => setMenuVisible(true);

    const closeMenu = () => setMenuVisible(false);


    const showSaveConfirmDialog = (values: any) => {
        setMenuVisible(false);
        return Alert.alert(
            "Save Profile",
            "Are you sure you want to update your Profile?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: () => {
                        // if (values.firstName.length == 0 || values.lastName.length == 0) {
                        //     return;
                        // }
                        dataItem.LastName = values.lastName;
                        dataItem.FirstName = values.firstName;
                        dataItem.Email = values.email;
                        dataItem.Preference = preference;
                        dataItem.Phone = values.mobile;
                        dataItem.Dnc = dnc
                        dataItem.Owner = owner;
                        SaveUserSettings(dataItem);

                        setNotification({ type: "success", text: "Profile updated." });
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


    const showLeaveTeamConfirmDialog = () => {
        setMenuVisible(false);
        return Alert.alert(
            "Leave Team",
            "You will no longer be able to sign into this team. Are you sure want to leave?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: async () => {
                        await LeaveTeamService();
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
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={openMenu}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}>

                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <Ionicons name="ellipsis-vertical" size={30} color="white" />
                        }>
                        <Menu.Item onPress={showSaveConfirmDialog} title="Save Profile" />
                        <Menu.Item onPress={() => { setMenuVisible(false); setModalVisible(true); }} title="Reset Password" />
                        <Menu.Item onPress={showLeaveTeamConfirmDialog} title="Leave Team" />
                    </Menu>

                </Pressable>
            ),
        })
    }, [navigation, showSaveConfirmDialog, setModalVisible, showLeaveTeamConfirmDialog]);

    useEffect(() => {
        (async () => {
            if (Platform.OS === "ios") {
                setIsIOS(true);
            }
        })();
    }, []);


    const takeProfile = async () => {
        const resultData = await getProfileData();


        setProfileData({
            ...profileData,
            firstName: resultData.firstName, lastName: resultData.lastName, email: resultData.email,
            mobile: resultData.phone, preference: resultData.preference, notification: resultData.dnc
        });

        setPreference(resultData.preference);
        setDNC(resultData.dnc);
        setOwner(resultData.owner);
        setIsSubmitting(false);

    }

    useEffect(() => {
        setIsSubmitting(true);
        const takeProfile = async () => {
            // console.log("takeProfile method call");
            const data = await getProfileData();
            console.log(data);
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmail(data.email);
            setPhone(data.phone);
            setPreference(data.preference);
            setDNC(data.dnc);
            setOwner(data.owner);
            setIsSubmitting(false);
        }
        takeProfile();
    }, []);

    useEffect(() => {

    }, [isSubmitting, profileData])

    let dataItem = {
        "UserId": 0,
        "Email": "",
        "Preference": 0,
        "Dnc": 0,
        "FirstName": "",
        "LastName": "",
        "UserPassword": "",
        "Phone": "",
        "Owner": 0
    }


    const validateSchema = yup.object({
        firstName: yup.string().trim().required("First Name is required."),
        lastName: yup.string().trim().required("Last Name is required."),
        email: yup.string().trim().email("Invalid email address.").required("Email is required."),
    });

    const getTextColor = () => {
        return theme.colors.background === "rgb(1, 1, 1)" ? "white" : "black";
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
                                <ScrollView style={{ height: 'auto' }}>
                                    <View style={[{ flex: 1, padding: 20 }]}>
                                        <Formik
                                            enableReinitialize={true}
                                            initialValues={profileData}
                                            validationSchema={validateSchema}
                                            onSubmit={(values) => showSaveConfirmDialog(values)}
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
                                                            autoComplete='firstName'
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
                                                            autoComplete='lastName'
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
                                                                props.email.focus()
                                                            }}
                                                            onBlur={props.handleBlur("lastName")}
                                                            blurOnSubmit={false}
                                                        />
                                                        <Text style={{ color: theme.colors.error }}>
                                                            {/* {props.touched.lastName && props.errors.lastName} */}
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
                                                            label="Email *"
                                                            autoCapitalize="none"
                                                            keyboardType="email-address"
                                                            returnKeyType="next"
                                                            activeUnderlineColor={Colors.blue700}
                                                            onSubmitEditing={() => {
                                                                props.mobile.focus()
                                                            }}
                                                            onBlur={props.handleBlur("email")}
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
                                                            autoComplete='mobile'
                                                            onChangeText={props.handleChange("mobile")}
                                                            value={props.values.mobile}
                                                            placeholder=""
                                                            placeholderTextColor={theme.colors.placeholder}
                                                            label="Mobile"
                                                            autoCapitalize="none"
                                                            keyboardType="phone-pad"
                                                            returnKeyType="next"
                                                            activeUnderlineColor={Colors.blue700}
                                                            // onSubmitEditing={() => {
                                                            //     props.password.focus()
                                                            // }}
                                                            onBlur={props.handleBlur("mobile")}
                                                            blurOnSubmit={false}
                                                        />
                                                        <Text style={{ color: theme.colors.error }}>
                                                        </Text>

                                                        <DropDown
                                                            label={"Preference"}
                                                            mode={"flat"}
                                                            visible={openPreference}
                                                            showDropDown={() => setOpenPreference(true)}
                                                            onDismiss={() => setOpenPreference(false)}
                                                            value={preference}
                                                            setValue={setPreference}
                                                            list={preferenceItems}
                                                            activeColor={userTeamColor}
                                                            theme={theme}
                                                        />

                                                        <Text style={{ color: theme.colors.error }}>
                                                        </Text>

                                                        <DropDown
                                                            label={"Notification"}
                                                            mode={"flat"}
                                                            visible={openNotification}
                                                            showDropDown={() => setOpenNotification(true)}
                                                            onDismiss={() => setOpenNotification(false)}
                                                            value={dnc}
                                                            setValue={setDNC}
                                                            list={notificationItems}
                                                            activeColor={userTeamColor}
                                                        />

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
                                < ResetPasswordModal isVisible={modalVisible} setModalVisibleHandler={setModalVisible} />
                                <Toastbar message={message} onClose={() => setNotification({ type: "", text: "" })} />
                            </>
                        )
                }
            </SafeAreaView>

        )

    );
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
    }

});

