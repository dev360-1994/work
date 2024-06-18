import React, { Component, useEffect, useState } from 'react';
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
import { Value } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';

//for dropdowns
const preferenceList = ["Both", "Email", "SMS Text", "Cancel"];
const notificationList = ["Block Notification", "Receive Notification", "Cancel"];


export default function ProfileScreen({ navigation }: RootDrawerScreenProps<'Profile'>) {

    const isFocused = useIsFocused();
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

    useEffect(() => {
        (async () => {
            if (Platform.OS === "ios") {
                setIsIOS(true);
            }
        })();
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
        }
        takeProfile();

    }, [isFocused]);



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



    const showLeaveTeamConfirmDialog = () => {
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

    const showSaveConfirmDialog = () => {
        return Alert.alert(
            "Are your sure?",
            "Are you sure you want to Save changes?",
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


    return (
        isFocused && (
            <ScrollView>
                <SafeAreaView>
                    <ResetPasswordModal isVisible={modalVisible} setModalVisibleHandler={setModalVisible} />
                    <View style={{ flexDirection: "row", width: 300, marginBottom: 10, marginLeft: 10, marginTop: 0 }}>
                        <View>
                            <Feather name="user" size={26} style={{ paddingRight: 8 }} />
                        </View>
                        <View>
                            <Text style={{ color: "#34495e", fontWeight: "bold", fontSize: 20 }}>
                                My Profile
                            </Text>
                        </View>

                    </View>

                    <View style={{ flexGrow: 1 }}>
                        <View style={styles.container}>
                            <View style={{ paddingBottom: 10, }}>
                                <Text style={styles.paragraph}>
                                    Profile Settings
                                </Text>

                                <Text style={{ fontWeight: "bold" }}>First Name</Text>
                                <TextInput
                                    value={firstName}
                                    onChangeText={(v) => { setFirstName(v) }}
                                    style={styles.inputText}>
                                </TextInput>
                                {firstNameError.length > 0 && <Text style={{ color: "red" }}>First Name is required</Text>}
                            </View>

                            <View style={{ paddingBottom: 20 }}>
                                <Text style={{ fontWeight: "bold" }}>Last Name</Text>
                                <TextInput
                                    value={lastName}
                                    onChangeText={(v) => { setLastName(v) }}
                                    style={styles.inputText}>
                                </TextInput>
                                {lastNameError.length > 0 && <Text style={{ color: "red" }}>Last Name is required</Text>}
                            </View>

                            <View style={{ paddingBottom: 20 }}>
                                <Text style={{ fontWeight: "bold" }}>Email Address</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={(v) => { setEmail(v) }}
                                    style={styles.inputText}>
                                </TextInput>
                            </View>

                            <View style={{ paddingBottom: 20 }}>
                                <Text style={{ fontWeight: "bold" }}>Mobile Phone</Text>
                                <TextInput
                                    value={phone}
                                    onChangeText={(v) => { setPhone(v) }}
                                    style={styles.inputText}>
                                </TextInput>
                            </View>

                            <View style={styles.dropdownContainer}>
                                <View style={{ paddingBottom: 20 }}>
                                    <Text style={{ fontWeight: "bold" }}>Preference</Text>
                                    <View style={styles.pickerContainer}>
                                        {
                                            !isIOS &&
                                            <Picker
                                                selectedValue={preferenceList[preference]}
                                                onValueChange={(item, index) => setPreference(index)}
                                                style={styles.picker}
                                                mode="dropdown"
                                            >
                                                <Picker.Item label="Both" value="0" />
                                                <Picker.Item label="Email" value="1" />
                                                <Picker.Item label="Sms Text" value="2" />
                                            </Picker>
                                        }
                                        {
                                            isIOS &&
                                            <Text
                                                style={styles.textDropdownIOS}
                                                onPress={() => onPressPreferenceDropdown(preferenceList)} >
                                                {preferenceList[preference]}
                                            </Text>
                                        }
                                    </View>

                                </View>
                                <View style={{ paddingBottom: 20 }}>
                                    <Text style={{ fontWeight: "bold" }}>Notification</Text>
                                    <View style={styles.pickerContainer}>
                                        {
                                            !isIOS &&
                                            <Picker
                                                selectedValue={notificationList[dnc]}
                                                onValueChange={(item, index) => { setDNC(index) }}
                                                style={styles.picker}
                                                mode="dropdown"
                                            >
                                                <Picker.Item label="Block Notification" value="Block Notification" />
                                                <Picker.Item label="Receive Notification" value="Receive Notification" />
                                            </Picker>
                                        }
                                        {
                                            isIOS &&
                                            <Text
                                                style={styles.textDropdownIOS}
                                                onPress={() => onPressDncDropdown(notificationList,)} >{notificationList[dnc]}
                                            </Text>
                                        }
                                    </View>

                                </View>

                            </View>


                            <View style={styles.buttonContainer}>

                                <View style={{ padding: 2, width: Platform.OS == "android" ? 100 : 80, borderWidth: 1 }}>
                                    <Button color={"#6c757d"} title='Leave Team' onPress={() => showLeaveTeamConfirmDialog()} />
                                </View>

                                <View style={{ padding: 5, width: 110 }}>
                                    <Button onPress={() => setModalVisible(true)} color={"#6c757d"} title='Reset Password' />
                                </View>

                                <View style={{ padding: 5, paddingRight: Platform.OS == "ios" ? 50 : 0, width: 120 }}>
                                    <Button color={"#28a745"} title='Save Settings' onPress={showSaveConfirmDialog} />
                                </View>

                            </View>

                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView >
        )

    );
}


const styles = StyleSheet.create({

    container: {
        flexDirection: "column",
        justifyContent: "center",
        marginTop: 10,
        padding: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 10,
        borderTopWidth: 10,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderColor: "#cccccc",
        marginBottom: 10
    },
    inputText: {
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 1,
        paddingLeft: 8
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
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        borderWidth: 1,
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

    }
    ,
    textDropdownIOS: {
        flex: 1,
        marginLeft: 10,
        marginTop: 14
    }
});

