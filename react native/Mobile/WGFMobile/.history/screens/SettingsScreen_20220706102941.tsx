import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Button, Pressable, TextInput, SafeAreaView, Alert, Modal, ScrollView } from 'react-native';
import { RootDrawerScreenProps } from "../types";
import { useIsFocused, useTheme } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown'
import { getProfileData, SaveUserSettings } from '../services/ProfileService';
import Feather from '@expo/vector-icons/build/Feather';
import ResetPasswordModal from '../screens/Settings/Profile/ResetPassword'
import { Value } from 'react-native-reanimated';

//for dropdowns
const preferenceList = ["Both", "Email", "SMS Text"];
const notificationList = ["Block Notification", "Receive Notification"];


export default function ProfileScreen({ navigation }: RootDrawerScreenProps<'Profile'>) {
    console.log("profilescreen");
    const isFocused = useIsFocused();
    const [firstName, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastName, setLastName] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [preference, setPreference] = useState("");
    const [dnc, setDNC] = useState("");
    const [dncError, setDNCError] = useState("");
    const [owner, setOwner] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);



    const takeProfile = async () => {
        console.log("takeProfile");
        const data = await getProfileData();
        // console.log(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhone(data.phone);
        setPreference(data.preference);
        setDNC(data.dnc);
        setOwner(data.owner);
    }

    // takeProfile();

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
                    onPress: () => {
                        if (firstName.length == 0 || lastName.length == 0) {
                            setFirstNameError("F");
                            setLastNameError("F");
                            return;
                        }
                        dataItem.LastName = lastName;
                        dataItem.FirstName = firstName;
                        dataItem.Email = email;
                        dataItem.Preference = preference == "Both" ? 0 : preference == "Email" ? 1 : 2;
                        dataItem.Phone = phone;
                        dataItem.Dnc = dnc == "Block Notification" ? 0 : 1;
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

    const showSaveConfirmDialog = () => {
        return Alert.alert(
            "Are your sure?",
            "Are you sure you want to Save changes?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: () => {
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
                                    style={{ height: 35, borderColor: '#cccccc', borderWidth: 1, paddingLeft: 8 }}>
                                </TextInput>
                                {firstNameError.length > 0 && <Text style={{ color: "red" }}>First Name is required</Text>}
                            </View>

                            <View style={{ paddingBottom: 20 }}>
                                <Text style={{ fontWeight: "bold" }}>Last Name</Text>
                                <TextInput
                                    value={lastName}
                                    style={{ height: 35, borderColor: '#cccccc', borderWidth: 1, paddingLeft: 8 }}>
                                </TextInput>
                                {lastNameError.length > 0 && <Text style={{ color: "red" }}>Last Name is required</Text>}
                            </View>

                            <View style={{ paddingBottom: 20 }}>
                                <Text style={{ fontWeight: "bold" }}>Email Address</Text>
                                <TextInput
                                    value={email}
                                    style={{ height: 35, borderColor: '#cccccc', borderWidth: 1, paddingLeft: 8 }}>
                                </TextInput>
                            </View>

                            <View style={{ paddingBottom: 20 }}>
                                <Text style={{ fontWeight: "bold" }}>Mobile Phone</Text>
                                <TextInput
                                    value={phone}
                                    style={{ height: 35, borderColor: '#cccccc', borderWidth: 1, paddingLeft: 8 }}>
                                </TextInput>
                            </View>

                            <View style={styles.dropdownContainer}>
                                <View style={{ paddingBottom: 10 }}>
                                    <Text style={{ fontWeight: "bold" }}>Preference</Text>

                                    <SelectDropdown defaultValueByIndex={parseInt(preference)}
                                        data={preferenceList}
                                        onSelect={(selectedItem, index) => {

                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            // text represented after item is selected
                                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                                            return selectedItem
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            // text represented for each item in dropdown
                                            // if data array is an array of objects then return item.property to represent item in dropdown
                                            return item
                                        }}
                                    />

                                </View>
                                <View style={{}}>
                                    <Text style={{ fontWeight: "bold" }}>Notification</Text>
                                    <View style={{ width: 20 }}>
                                        <SelectDropdown
                                            defaultValueByIndex={parseInt(dnc)}
                                            data={notificationList}
                                            onSelect={(selectedItem, index) => {
                                            }}
                                            buttonTextAfterSelection={(selectedItem, index) => {
                                                // text represented after item is selected
                                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                                return selectedItem
                                            }}
                                            rowTextForSelection={(item, index) => {
                                                // text represented for each item in dropdown
                                                // if data array is an array of objects then return item.property to represent item in dropdown
                                                return item
                                            }}
                                        />
                                    </View>

                                </View>

                            </View>


                            <View style={styles.buttonContainer}>

                                <View style={{ padding: 5, width: 100, }}>
                                    <Button color={"#6c757d"} title='Leave Team' onPress={() => showLeaveTeamConfirmDialog()} />
                                </View>

                                <View style={{ padding: 5, width: 110 }}>
                                    <Button onPress={() => setModalVisible(true)} color={"#6c757d"} title='Reset Password' />
                                </View>

                                <View style={{ padding: 5, width: 100 }}>
                                    <Button color={"#28a745"} title='Save Settings' onPress={showSaveConfirmDialog} />
                                </View>

                            </View>

                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
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
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        width: 105,
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

});

