import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, Platform, TouchableOpacity, StatusBar } from "react-native";
import { onResetPassword } from "../../../services/ProfileService";
import { TextInput, Button, Colors, Title, useTheme } from 'react-native-paper';
import { Formik } from "formik";
import * as yup from "yup";
import { MessageModel } from "../../../services/Model/MessageModel";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { PreferencesContext } from "../../../PreferencesContext";
//import { Flex } from "native-base";

const initialState = {
    currentPassword: "",
    password: "",
    confirmPassword: "",
    isSubmitting: false,
    message: {},
};
const validateSchema = yup.object({

    currentPassword: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup.string().required(),

});
const ResetPasswordModal = (props: any) => {

    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const [currentPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [confirmPasword, setConfirmPassword] = useState("");
    const [confirmPaswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());


    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

    const submitResetPasswordHandler = (values: any) => {
        let currentPassword = values.currentPassword;
        let password = values.password;
        let confirmPasword = values.confirmPassword;

        if (currentPassword.length == 0 || confirmPasword.length == 0) {
            setPasswordErrorMessage("password can't be null");
            Alert.alert(
                "Error",
                passwordErrorMessage,
            );
            return;
        } else if (password != confirmPasword) {
            setPasswordErrorMessage("New Password and Confirm Password should match.");
            Alert.alert(
                "Error",
                passwordErrorMessage,
            );
            return;
        }

        let data = {
            "TeamId": 0,
            "UserId": 0,
            "OldPassword": currentPassword,
            "NewPassword": password,
        }

        onResetPassword(data);

        props.setModalVisibleHandler(false);

    }
    const cancleResetPassword = () => {
        props.setModalVisibleHandler(false)
    };


    return (
        <View style={{ flex: 1, }}>

            <View style={[styles.centeredView,]}>

                <View style={[styles.subContainer, { flex: 1, margin: 100, backgroundColor: theme.colors.background, flexGrow: 1 }]}>

                    <Modal
                        style={{ paddingBottom: 20 }}
                        animationType="slide"
                        transparent={false}
                        visible={props.isVisible}
                        onRequestClose={() => {
                            props.setModalVisibleHandler(false);
                        }}
                    >
                        <View style={[
                            {
                                backgroundColor: theme.colors.background, width: '100%', padding: 20, marginTop: Platform.OS === "ios" ? 0 : 0, zIndex: 1,
                                paddingTop: Platform.OS === "ios" ? 50 : 20,
                                flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#cacaca',
                            }]}>
                            <MaterialIcons name="arrow-back" size={24} style={{ color: theme.colors.text }} onPress={() => cancleResetPassword()} />
                            <Text style={[styles.modalHeader, { color: theme.colors.text }]}>Reset Password</Text>
                        </View>
                        <View style={{ backgroundColor: theme.colors.background }}>
                            <Formik
                                initialValues={initialState}
                                validationSchema={validateSchema}
                                onSubmit={
                                    (values) => submitResetPasswordHandler(values)
                                }

                            >
                                {(props) => (

                                    < View style={{ height: "100%" }}>
                                        <View style={{ margin: 20, paddingTop: 10 }}>
                                            <TextInput
                                                // ref={(input: any) => {
                                                //     props.currentPassword = input;
                                                // }}
                                                error={
                                                    props.touched.currentPassword && props.errors.currentPassword
                                                        ? true
                                                        : false
                                                }

                                                blurOnSubmit={false}
                                                mode="flat"
                                                // autoComplete='password*'
                                                placeholder="Enter your currentPassword"
                                                placeholderTextColor={theme.colors.placeholder}
                                                label="Current Password *"
                                                secureTextEntry={true}
                                                returnKeyType="next"
                                                activeUnderlineColor={userTeamColor}
                                                onChangeText={props.handleChange("currentPassword")}
                                                value={props.values.currentPassword}
                                                onBlur={props.handleBlur("currentPassword")}
                                            />


                                            <Text style={{ color: theme.colors.error }}>
                                                {/* {props.touched.currentPassword && props.errors.currentPassword} */}
                                            </Text>
                                            <TextInput
                                                ref={(input: any) => {
                                                    props.password = input;
                                                }}

                                                error={
                                                    props.touched.password && props.errors.password
                                                        ? true
                                                        : false
                                                }
                                                mode="flat"
                                                //  autoComplete='password*'
                                                placeholder="enter your password"
                                                placeholderTextColor={theme.colors.placeholder}
                                                label="New Password *"
                                                secureTextEntry={true}
                                                returnKeyType="go"
                                                activeUnderlineColor={userTeamColor}
                                                onSubmitEditing={props.handleSubmit}
                                                onChangeText={props.handleChange("password")}
                                                value={props.values.password}
                                                onBlur={props.handleBlur("password")}
                                            />

                                            <Text style={{ color: theme.colors.error }}>
                                                {/* {props.touched.password && props.errors.password} */}
                                            </Text>

                                            <TextInput
                                                ref={(input: any) => {
                                                    props.confirmPassword = input;
                                                }}
                                                error={
                                                    props.touched.confirmPassword && props.errors.confirmPassword
                                                        ? true
                                                        : false
                                                }
                                                mode="flat"
                                                //  autoComplete='password*'
                                                placeholder="enter your confirm password"
                                                placeholderTextColor={theme.colors.placeholder}
                                                label="Confirm Password *"
                                                secureTextEntry={true}
                                                returnKeyType="next"
                                                activeUnderlineColor={userTeamColor}
                                                onChangeText={props.handleChange("confirmPassword")}
                                                value={props.values.confirmPassword}
                                                onBlur={props.handleBlur("confirmPassword")}
                                            />


                                            <Text style={{ color: theme.colors.error }}>
                                                {/* {props.touched.confirmPassword && props.errors.confirmPassword} */}
                                            </Text>
                                        </View>



                                        <View style={[styles.buttonContainter, { backgroundColor: theme.colors.background, paddingLeft: 20, paddingRight: 20 }]} >
                                            <Button
                                                disabled={isSubmitting}
                                                loading={isSubmitting}
                                                mode="contained"
                                                onPress={props.handleSubmit}
                                                style={{ backgroundColor: userTeamColor, width: '100%', paddingVertical: 10 }}
                                            >
                                                <Text style={{ color: 'white' }}>Reset Password</Text>
                                            </Button>
                                        </View>
                                    </View>

                                )}
                            </Formik>
                        </View>
                    </Modal>
                </View>
            </View>
        </View >

    );
};


export default ResetPasswordModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 22,
        flexGrow: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        //height: "10%",
    },

    modalHeader: {
        fontSize: 18,
        paddingLeft: 16,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 23
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

    buttonContainter:
    {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
});


