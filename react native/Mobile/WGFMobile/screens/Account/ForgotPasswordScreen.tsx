import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, ActivityIndicator, Button, Colors, useTheme } from 'react-native-paper';
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { useState } from 'react';
import { doForgotPassword } from '../../services/AuthenticationService';
import { MessageModel } from '../../services/Model/MessageModel';

const initialState = {
    email: "",
    isSubmitting: false,
    message: {},
};

const validateSchema = yup.object({
    email: yup.string().email("Invalid email address.").required("Enter an Email."),
});


export default function ForgotPasswordScreen() {
    const [data, setData] = useState(initialState);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());

    const theme = useTheme();

    async function submitForm(values: any) {

        try {
            setData({ ...data, isSubmitting: true });

            let params: string = encodeURI(values.email) ?? "";

            var resultPromise = await doForgotPassword(params);

            let responseUserInfo: boolean = JSON.parse(JSON.stringify(resultPromise));

            setNotification({
                type: "success",
                text: "Password Reset Email sent your email, Please check your inbox/spam/trash.",
            });


        } catch (error) {
            if (error) {
                if (error != "200") {
                    setNotification({
                        type: "error",
                        text: "Email does not found.",
                    });
                }
            }
        }
        finally {
            setData({ ...data, isSubmitting: false });
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

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
                            <Text style={{ color: theme.colors.text }}>Please enter email address to receive a reset password link</Text>
                            <TextInput
                                error={
                                    props.touched.email && props.errors.email
                                        ? true
                                        : false
                                }
                                mode="flat"
                                // autoComplete='email'
                                onChangeText={props.handleChange("email")}
                                placeholder="email@examples.com"
                                placeholderTextColor={theme.colors.placeholder}
                                value={props.values.email}
                                //theme={paperTheme}
                                activeUnderlineColor={Colors.blue700}
                                label="Email*"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                // onSubmitEditing={() => {
                                //     props.password.focus();
                                // }}
                                onBlur={props.handleBlur("email")}
                                blurOnSubmit={false}
                            />
                            <Text style={{ color: theme.colors.error }}>
                                {props.touched.email && props.errors.email}
                            </Text>

                        </View>

                        <View style={styles.buttonContainter} >
                            <Button
                                disabled={props.isSubmitting}
                                loading={props.isSubmitting}
                                mode="contained"
                                onPress={props.handleSubmit}
                                style={{ backgroundColor: Colors.yellow900, width: '100%', paddingVertical: 10 }}
                            >
                                Send My Password
                            </Button>
                        </View>
                    </>
                )}
            </Formik>
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },

    buttonContainter:
    {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },



});
