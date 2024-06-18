import React, { useEffect, useState, useRef } from "react";
import { TextInput, Button, Colors, Title, useTheme } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, ColorSchemeName, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { StatusBar, Platform } from "react-native";

import { Text, View } from '../../components/Themed';
import { RootStackScreenProps } from '../../types';
import { setSession, getSession } from '../../services/common/Session';
import { doLogin } from '../../services/AuthenticationService';
import { UserInfoModel } from '../../services/Model/UserInfoModel';
import { SessionInfoModel } from '../../services/Model/SessionInfoModel';
import { MessageModel } from "../../services/Model/MessageModel";
import { PreferencesContext } from "../../PreferencesContext";

const initialState = {
    email: "",
    password: "",
    //email: "",
    //password: "",
    remember: false,
    isSubmitting: false,
    message: {},
};

const validateSchema = yup.object({
    email: yup.string().trim().email("Invalid email address.").required("Enter an Email."),
    password: yup
        .string().trim()
        .required("Enter a password."),
});

export default function SignInScreen({ navigation }: RootStackScreenProps<'SignIn'>) {
    const theme = useTheme();
    const passwordRef = useRef();

    const { updateUserContext, userContext } = React.useContext(PreferencesContext);

    const [data, setData] = useState(initialState);
    const [message, setNotification] = useState(new MessageModel);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onPressForgotPasswordHandler = () => {
        navigation.navigate('ForgotPassword');
    };

    async function login(sessionInfo: SessionInfoModel, loginInfo: LoginModel) {
        try {

            var resultPromise = await doLogin(loginInfo);

            let responseUserInfo: UserInfoModel = JSON.parse(JSON.stringify(resultPromise));

            sessionInfo.userInfo = responseUserInfo;

            //update session with user info - Important 
            setSession(sessionInfo)?.then(function () {
                navigation.navigate("Root");
            });

            setIsSubmitting(false);

        } catch (error) {
            if (error) {
                setNotification({
                    type: "error",
                    text: error,
                });
                setIsSubmitting(false);
            }
        }
    }

    async function submitForm(values: any) {

        try {
            setNotification({
                type: "",
                text: "",
            })
            setData({ ...data, isSubmitting: true });

            setIsSubmitting(true);

            let loginInfo: LoginModel = {
                email: values.email,
                password: values.password
            }

            getSession().then((sessionData) => {
                login(sessionData, loginInfo);
            });

        } catch (error) {

            if (error) {
                setNotification({
                    type: "error",
                    text: error,
                });
                setIsSubmitting(false);
            }
        }
        finally {
            setData({ ...data, isSubmitting: false });

        }
    }


    return (
        <View style={{ flex: 1 }}>
            <View style={[
                { backgroundColor: '#343a40', width: '100%', padding: 15, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight, zIndex: 1 }]}>
                <Image source={require('../../assets/images/logolight.png')} style={{ height: 32 }} />
            </View>

            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={[styles.subContainer, { margin: 20, backgroundColor: theme.colors.background }]}>
                    <View style={{ marginVertical: 20, backgroundColor: theme.colors.background }}>
                        <Title>Hello <FontAwesome name="smile-o" size={24} style={{ color: theme.colors.text }} /></Title>
                    </View>
                    <Formik
                        initialValues={initialState}
                        validationSchema={validateSchema}
                        onSubmit={(values) => submitForm(values)}
                    >
                        {(props) => (
                            <>
                                <View style={{ backgroundColor: theme.colors.background }}>
                                    {
                                        (message && message.text && message.text.length > 0)
                                            ? (
                                                <View style={{ marginVertical: 10, backgroundColor: theme.colors.background }}>
                                                    <Text style={{ color: theme.colors.error }}>{message.text}</Text>
                                                </View>
                                            ) : (<></>)
                                    }
                                    <TextInput
                                        error={
                                            props.touched.email && props.errors.email
                                                ? true
                                                : false
                                        }
                                        mode="flat"
                                        //autoComplete='email'
                                        onChangeText={props.handleChange("email")}
                                        value={props.values.email}
                                        placeholder="email@examples.com"
                                        placeholderTextColor={theme.colors.placeholder}
                                        label="Email*"
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        returnKeyType="next"
                                        activeUnderlineColor={Colors.blue700}
                                        onSubmitEditing={() => {
                                            props.password.focus()
                                        }}
                                        onBlur={props.handleBlur("email")}
                                        blurOnSubmit={false}
                                    />
                                    <Text style={{ color: theme.colors.error }}>
                                        {props.touched.email && props.errors.email}
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
                                        //autoComplete='password*'
                                        placeholder="enter your password"
                                        placeholderTextColor={theme.colors.placeholder}
                                        label="Password*"
                                        secureTextEntry={true}
                                        returnKeyType="go"
                                        activeUnderlineColor={Colors.blue700}
                                        onSubmitEditing={props.handleSubmit}
                                        onChangeText={props.handleChange("password")}
                                        value={props.values.password}
                                        onBlur={props.handleBlur("password")}
                                    />

                                    <Text style={{ color: theme.colors.error }}>
                                        {props.touched.password && props.errors.password}
                                    </Text>

                                </View>

                                <View style={[styles.buttonContainter, { backgroundColor: theme.colors.background }]} >
                                    <Button
                                        disabled={isSubmitting}
                                        loading={isSubmitting}
                                        mode="contained"
                                        onPress={props.handleSubmit}
                                        style={{ backgroundColor: Colors.yellow900, width: '100%', paddingVertical: 10 }}
                                    >
                                        Sign In
                                    </Button>

                                    <TouchableOpacity
                                        onPress={() => onPressForgotPasswordHandler()}
                                    >
                                        <Text style={{
                                            fontSize: 16,
                                            color: '#1E6AC6',
                                            marginTop: 20,
                                            justifyContent: 'center',
                                        }}>Reset Password</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </Formik>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    subContainer: {
        ...Platform.select({
            ios: {
                // borderColor: 'red',
                // borderWidth: 2,
                // marginTop: 5,
            },
            android: {
                //marginTop: 100,

            },
            default: {
                //marginTop: 10,
            }
        })
    },

    buttonContainter:
    {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },


});
