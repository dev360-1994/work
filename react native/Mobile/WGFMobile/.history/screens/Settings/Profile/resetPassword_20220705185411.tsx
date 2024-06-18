import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput } from "react-native";
import { onResetPassword } from "../../../services/ProfileService";


const ResetPasswordModal = (props: any) => {

    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [confirmPasword, setConfirmPassword] = useState("");
    const [confirmPaswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");

    const submitResetPasswordHandler = () => {

        if (oldPassword.length == 0 || password.length == 0 || confirmPasword.length == 0) {
            setPasswordErrorMessage("password can't be null");
            Alert.alert(
                "Error",
                passwordErrorMessage,
            );
            return;
        } else if (password != confirmPasword) {
            setPasswordErrorMessage("Password should match");
            Alert.alert(
                "Error",
                passwordErrorMessage,
            );
            return;
        }

        onResetPassword({ "OldPassword": oldPassword, "NewPassword": password, });

        props.setModalVisibleHandler(false)

    }

    // onResetPassword()

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={props.isVisible}
                onRequestClose={() => {
                    props.setModalVisibleHandler(false);
                }}
            >
                {/* {passwordErrorMessage.length > 0 && <Text style={{ color: "red" }}>{passwordErrorMessage}</Text>} */}
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Reset Password!</Text>
                        <View style={{ paddingBottom: 20 }}>
                            <Text style={{ fontWeight: "bold" }}>Old Password</Text>
                            <TextInput
                                secureTextEntry={true}
                                onChangeText={(text) => setOldPassword(text)}
                                style={{ height: 35, borderColor: '#cccccc', borderWidth: 1, width: 200 }}>
                            </TextInput>
                        </View>
                        <View style={{ paddingBottom: 20 }}>
                            <Text style={{ fontWeight: "bold" }}>New Password</Text>
                            <TextInput
                                secureTextEntry={true}
                                onChangeText={(text) => setPassword(text)}
                                style={{ height: 35, borderColor: '#cccccc', borderWidth: 1, width: 200 }}>
                            </TextInput>
                        </View>
                        <View style={{ paddingBottom: 20 }}>
                            <Text style={{ fontWeight: "bold" }}>Confirm Password</Text>
                            <TextInput
                                secureTextEntry={true}
                                onChangeText={(text) => setConfirmPassword(text)}
                                style={{ height: 35, borderColor: '#cccccc', borderWidth: 1, width: 200 }}>
                            </TextInput>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ paddingRight: 10 }}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => submitResetPasswordHandler()}
                                >
                                    <Text style={styles.textStyle}>Reset Password</Text>
                                </Pressable>
                            </View>

                            <Pressable
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => props.setModalVisibleHandler(false)}
                            >
                                <Text style={{
                                    color: "black",
                                    textAlign: "center"
                                }}>Cancel</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};


export default ResetPasswordModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,

    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        opacity: 20,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    buttonCancel: {
        backgroundColor: "white",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 23
    }
});