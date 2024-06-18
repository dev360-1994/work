import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput } from "react-native";


const ResetPasswordModal = (props: any) => {

    const [newPassword, setNewPassword] = useState("")

    const submitResetPasswordHandler = () => {
        console.log(newPassword);
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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Reset Password!</Text>
                        <View style={{ paddingBottom: 20 }}>
                            <Text style={{ fontWeight: "bold" }}>Old Password</Text>
                            <TextInput
                                secureTextEntry={true}
                                style={{ height: 35, borderColor: '#cccccc', borderWidth: 1, width: 200 }}>
                            </TextInput>
                        </View>
                        <View style={{ paddingBottom: 20 }}>
                            <Text style={{ fontWeight: "bold" }}>New Password</Text>
                            <TextInput
                                secureTextEntry={true}
                                onChange={(e) => setNewPassword(e)}
                                style={{ height: 35, borderColor: '#cccccc', borderWidth: 1, width: 200 }}>
                            </TextInput>
                        </View>
                        <View style={{ paddingBottom: 20 }}>
                            <Text style={{ fontWeight: "bold" }}>Confirm Password</Text>
                            <TextInput
                                secureTextEntry={true}
                                style={{ height: 35, borderColor: '#cccccc', borderWidth: 1, width: 200 }}>
                            </TextInput>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ paddingRight: 10 }}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => submitResetPasswordHandler}
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
