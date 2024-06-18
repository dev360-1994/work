import React, { Component, useEffect, useState, useLayoutEffect } from 'react';
import {
    StyleSheet, Text, View, Button,
    Pressable, TextInput, SafeAreaView, Alert, Modal, ScrollView, ToastAndroid, Platform, ActionSheetIOS
} from 'react-native';
import { RootDrawerScreenProps } from "../types";
import { useIsFocused, useTheme } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown'
import { getProfileData, LeaveTeamService, SaveUserSettings } from '../services/ProfileService';
import Feather from '@expo/vector-icons/build/Feather';
import ResetPasswordModal from '../screens/Settings/Profile/ResetPassword'
import { color, Value } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import DropDownPicker from "react-native-dropdown-picker";
import { Menu } from 'react-native-paper';
import ProcessingIndicator from '../components/ProcessingIndicator';


const useIsMountedRef = () => {
    const isMountedRef = React.useRef(false);
    React.useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    });
    return isMountedRef;
};



export default function ProfileScreen({ navigation }: RootDrawerScreenProps<'Profile'>) {
    const isMountedRef = useIsMountedRef();
    const theme = useTheme();

    const isFocused = useIsFocused();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [firstName, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastName, setLastName] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [preference, setPreference] = useState(0);
    const [dnc, setDNC] = useState(0);
    const [dncError, setDNCError] = useState("");
    const [owner, setOwner] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [isIOS, setIsIOS] = React.useState(false);
    // const [preferenceItem, setPreferenceItem] = useState([{ label: 'Both', value: '0' },
    // { label: 'Email', value: '1' }, { label: 'Sms Text', value: '2' },]);
    // const [open, setOpen] = useState(false);
    const [openPreference, setOpenPreference] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [value, setValue] = useState(null);
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


    const showSaveConfirmDialog = () => {
        setMenuVisible(false);
        return Alert.alert(
            "Save Profile",
            "Are you sure you want to update your Profile?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: () => {
                        if (firstName.length == 0 || lastName.length == 0) {
                            setFirstNameError("F");
                            setLastNameError("F");
                            return;
                        }
                        dataItem.LastName = lastName;
                        dataItem.FirstName = firstName;
                        dataItem.Email = email;
                        dataItem.Preference = preference;
                        dataItem.Phone = phone;
                        dataItem.Dnc = dnc
                        dataItem.Owner = owner;
                        SaveUserSettings(dataItem);
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
        console.log(theme.colors.background);
    }, []);

    useLayoutEffect(() => {
        setIsSubmitting(true);
        const takeProfile = async () => {
            // console.log("takeProfile method call");
            const data = await getProfileData();
            // console.log(data);
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

    }, [getProfileData]);



    const onPressPreferenceDropdown = (options: [""]) => ActionSheetIOS.showActionSheetWithOptions(
        {
            options: options,
            destructiveButtonIndex: options.length - 1,
            cancelButtonIndex: options.length - 1,
            userInterfaceStyle: 'dark'
        },
        buttonIndex => {
            if (buttonIndex === options.length - 1) {
                return;
            }
            setPreference(buttonIndex);
        }
    )

    const onPressDncDropdown = (options: [""]) => ActionSheetIOS.showActionSheetWithOptions(
        {
            options: options,
            destructiveButtonIndex: options.length - 1,
            cancelButtonIndex: options.length - 1,
            userInterfaceStyle: 'dark'
        },
        buttonIndex => {
            if (buttonIndex === options.length - 1) {
                return;
            }
            setDNC(buttonIndex);
        }
    )

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

    const getTextColor = () => {
        return theme.colors.background === "rgb(1, 1, 1)" ? "white" : "black";
    }

    useEffect(() => {

        //unsubscribe();
    }, [isMountedRef]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // setIsTabFocused(true);
            setIsSubmitting(true);

        });
        return unsubscribe;

    }, [navigation]);


    return (
        isFocused && (
            <ScrollView>
                <SafeAreaView>

                    {
                        isSubmitting && isSubmitting == true ? (
                            <View style={styles.processingIndicator}>
                                <ProcessingIndicator isLoading={isSubmitting} indicatorColor={theme.colors.text} />
                            </View>
                        ) :
                            <View style={styles.container}>
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={styles.paragraph}>
                                        {/* Profile Settings */}
                                    </Text>

                                    <Text style={{ fontWeight: "bold", color: getTextColor() }}>First Name</Text>
                                    <TextInput
                                        value={firstName}
                                        onChangeText={(v) => { setFirstName(v) }}
                                        style={styles.inputText}>
                                    </TextInput>
                                    {firstNameError.length > 0 && <Text style={{ color: "red" }}>First Name is required</Text>}
                                </View>

                                <View style={{ paddingBottom: 20 }}>
                                    <Text style={{ fontWeight: "bold", color: getTextColor() }}>Last Name</Text>
                                    <TextInput
                                        value={lastName}
                                        onChangeText={(v) => { setLastName(v) }}
                                        style={styles.inputText}>
                                    </TextInput>
                                    {lastNameError.length > 0 && <Text style={{ color: "red" }}>Last Name is required</Text>}
                                </View>

                                <View style={{ paddingBottom: 20 }}>
                                    <Text style={{ fontWeight: "bold", color: getTextColor() }}>Email Address</Text>
                                    <TextInput
                                        value={email}
                                        onChangeText={(v) => { setEmail(v) }}
                                        style={styles.inputText}>
                                    </TextInput>
                                </View>

                                <View style={{ paddingBottom: 20 }}>
                                    <Text style={{ fontWeight: "bold", color: getTextColor() }}>Mobile Phone</Text>
                                    <TextInput
                                        value={phone}
                                        onChangeText={(v) => { setPhone(v) }}
                                        style={styles.inputText}>
                                    </TextInput>
                                </View>

                                <View style={styles.dropdownContainer}>
                                    <View style={{ paddingBottom: 20 }}>
                                        <Text style={{ fontWeight: "bold", color: getTextColor() }}>Preference</Text>

                                        <DropDownPicker
                                            style={{
                                                marginVertical: 0, width: '100%',
                                                flexDirection: 'row',
                                            }}
                                            containerProps={{
                                                height: openPreference === true ? 170 : null,
                                                // backgroundColor: "#ffffff",
                                            }}
                                            open={openPreference}
                                            value={preference}
                                            items={preferenceItems}
                                            setOpen={setOpenPreference}
                                            setValue={setPreference}
                                            setItems={setPreferenceItems}
                                            onChangeValue={i => console.log(preference)}
                                            dropDownDirection="BOTTOM"

                                        />

                                    </View>
                                    <View style={{ paddingBottom: 20 }}>
                                        <Text style={{ fontWeight: "bold", color: getTextColor() }}>Notification</Text>

                                        <DropDownPicker
                                            containerProps={{
                                                height: openNotification === true ? 120 : null,
                                                // backgroundColor: "#fff",
                                            }}
                                            open={openNotification}
                                            value={dnc}
                                            items={notificationItems}
                                            setOpen={setOpenNotification}
                                            setValue={setDNC}
                                            setItems={setNotificationItems}
                                            onChangeValue={i => console.log(dnc)}
                                            dropDownDirection="BOTTOM"
                                        />

                                    </View>

                                </View>


                                <View style={styles.buttonContainer}>

                                    {/* <View style={{ padding: 5, width: Platform.OS == "android" ? 100 : 80 }}>
                                    <Button color={"#6c757d"} title='Leave Team' onPress={() => showLeaveTeamConfirmDialog()} />
                                </View>

                                <View style={{ padding: 5, width: Platform.OS == "android" ? 110 : 95 }}>
                                    <Button onPress={() => setModalVisible(true)} color={"#6c757d"} title='Reset Password' />
                                </View> */}
                                    <Pressable onPress={showSaveConfirmDialog} style={({ pressed }) => ({
                                        opacity: pressed ? 0.5 : 1,
                                    })}>
                                        <View style={[{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#28a745", height: 48, borderRadius: 6 },]}>
                                            <Text style={{ color: "white", fontSize: 20, }}  >Save</Text>
                                        </View>
                                    </Pressable>
                                </View>

                            </View>
                    }


                </SafeAreaView>
                <ResetPasswordModal isVisible={modalVisible} setModalVisibleHandler={setModalVisible} />
            </ScrollView>
        )

    );
}


const styles = StyleSheet.create({

    container: {
        flexDirection: "column",
        justifyContent: "center",
        paddingHorizontal: 20,
        // backgroundColor: '#ffffff',
        // borderWidth: 10,
        // borderColor: "#cccccc",
    },
    inputText: {
        height: 48,
        // borderColor: '#cccccc',
        borderRadius: 6,
        borderWidth: 1,
        paddingLeft: 8,
        backgroundColor: '#ffffff',
    },
    paragraph: {
        marginBottom: 20,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "left",
        color: '#34495e',
    },

    text: {
        fontSize: 14,
        lineHeight: 40,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    buttonContainer: {
        flex: 1,
        marginTop: 10,
        marginBottom: 50,
    },
    dropdownContainer: {
        flexDirection: "column",
        justifyContent: "space-between"
    },

    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },

    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    pickerContainer: {
        flex: 1,
        borderWidth: 1,
        height: 40,
        // width: Platform.OS == "android" ? 200 : 180,
        borderColor: "#cccccc"
    },
    picker: {
        // margin: 10,
        // width: "95%",
    }
    ,
    textDropdownIOS: {
        flex: 1,
        marginLeft: 10,
        marginTop: 14
    },
    processingIndicator: {
        flex: 1,
        justifyContent: 'center',
        marginTop: '70%',
    }

});
