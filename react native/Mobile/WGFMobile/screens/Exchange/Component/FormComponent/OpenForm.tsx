import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SafeAreaView, View, StyleSheet, Platform, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Text, useTheme, TextInput, Colors, Button } from "react-native-paper";
import * as yup from "yup";
import Toastbar from "../../../../components/Toastbar";
import { MessageModel } from "../../../../services/Model/MessageModel";
import { PreferencesContext } from "../../../../PreferencesContext";
import { OpenExchange } from "../../../../services/Model/ExchangeModel";
import { sendFilmExchange } from "../../../../services/ExchangeService";


const initialState = {
    title: "",
    recipientName: "",
    addedNotes: "",
    status: "",
    email: "",
};

export default function OpenForm({ route }: { route: any }) {
    const navigation = useNavigation();
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [profileData, setProfileData] = useState(initialState);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [teamEmail, setTeamEmail] = useState("");


    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;



    async function init() {
    }

    useLayoutEffect(() => {
        const formdata = route.params;
        initialState.title = formdata.title;
        initialState.status = formdata.status == 0 ? "Ready to Exchange" : "Playlist Incomplete! Unable to Exchange";
        setDate(formdata.date);
    }, [route])


    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerShown: false,
        });
    });

    useEffect(() => {
        init();
    }, []);

    const validateSchema = yup.object({
        title: yup.string().trim().required("Title is required."),
        email: yup.string().trim().email("Invalid email address.").required("Email is required."),
        recipientName: yup.string().trim().required("recipientName is required"),
    });

    function goBack() {
        navigation.getParent()?.setOptions({
            headerShown: true,
        });
        navigation.goBack();
    }

    const saveUserHandler = async (values: any) => {



        Alert.alert(
            "",
            "Are you sure you want to send this film to the specified recipient? Please note that you cannot retract this link once it is sent.  You will need to delete the playlist from your team in order to inactivate the download link.",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            let data: OpenExchange = new OpenExchange;
                            data.addedNotes = values.addedNotes;
                            data.filmTitle = values.title;
                            data.playlistGuid = route.params.filmGuid;
                            data.playlistId = route.params.playlistId;
                            data.recipientEmail = values.email;
                            data.recipientName = values.recipientName;
                            data.teamId = userContext.userInfo.teamId;
                            data.userId = userContext.userInfo.userId;
                            // console.log(data);
                            await sendFilmExchange(data);
                            navigation.goBack();
                        } catch (error) {
                            console.log(error);
                        }
                        // setNotification({ type: "success", text: "" });
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

    return <SafeAreaView style={styles.container}>
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
                paddingLeft: 6,
            }}
            >Send Open Exchange</Text>
        </View>
        {(isSubmitting) ? (
            <></>
        ) : (
            <>
                <ScrollView style={{ height: 'auto' }}>
                    <View style={[{ flex: 1, padding: 20 }]}>
                        <View style={{
                            flex: 1,
                            marginBottom: 20,
                        }}>

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
                                        <View style={{ borderWidth: 1, padding: 10, backgroundColor: "#d1ecf1", borderColor: "#bee5eb" }}>
                                            <Text style={{ color: "#0c5460" }}>
                                                An automatic email will be sent to recipient that includes the film download link, your comments, and our instructions regarding how to open the compressed file containing your video clips.
                                            </Text>
                                        </View>

                                        <Text></Text>

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
                                            onChangeText={(value) => {
                                                props.handleChange("email")(value);
                                                setTeamEmail(value);
                                            }}
                                            value={props.values.email}
                                            placeholder="email@examples.com"
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Recipient Email*"
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            returnKeyType="next"
                                            activeUnderlineColor={Colors.blue700}
                                            // onSubmitEditing={() => {
                                            //     props.mobile.focus()
                                            // }}
                                            onBlur={props.handleBlur("email")}
                                            blurOnSubmit={false}
                                        />


                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>


                                        <TextInput
                                            error={
                                                props.touched.recipientName && props.errors.recipientName
                                                    ? true
                                                    : false
                                            }
                                            mode="flat"
                                            // autoComplete='recipientName'
                                            onChangeText={props.handleChange("recipientName")}
                                            value={props.values.recipientName}
                                            placeholder=""
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Recipient Name*"
                                            autoCapitalize="none"
                                            keyboardType="default"
                                            returnKeyType="next"
                                            activeUnderlineColor={Colors.blue700}
                                            // onSubmitEditing={() => {
                                            //     props.recipientName.focus()
                                            // }}
                                            onBlur={props.handleBlur("recipientName")}
                                            blurOnSubmit={false}
                                        />
                                        <Text style={{ color: theme.colors.error }}>
                                            {/* {props.touched.recipientName && props.errors.recipientName} */}
                                        </Text>

                                        <TextInput
                                            error={
                                                props.touched.title && props.errors.title
                                                    ? true
                                                    : false
                                            }
                                            mode="flat"
                                            // autoComplete='title'
                                            onChangeText={props.handleChange("title")}
                                            value={props.values.title}
                                            placeholder=""
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Film Title*"
                                            autoCapitalize="none"
                                            keyboardType="default"
                                            returnKeyType="next"
                                            activeUnderlineColor={Colors.blue700}
                                            // onSubmitEditing={() => {
                                            //     props.tags.focus()
                                            // }}
                                            onBlur={props.handleBlur("title")}
                                            blurOnSubmit={false}
                                        />
                                        <Text style={{ color: theme.colors.error }}>
                                            {/* {props.touched.title && props.errors.title} */}
                                        </Text>



                                        <TextInput
                                            error={
                                                props.touched.addedNotes && props.errors.addedNotes
                                                    ? true
                                                    : false
                                            }
                                            mode="flat"
                                            //  autoComplete='addedNotes'
                                            onChangeText={props.handleChange("addedNotes")}
                                            value={props.values.addedNotes}
                                            placeholder=""
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Added Notes"
                                            autoCapitalize="none"
                                            keyboardType="default"
                                            returnKeyType="next"
                                            activeUnderlineColor={Colors.blue700}
                                            // onSubmitEditing={() => {
                                            //     props.tags.focus()
                                            // }}
                                            onBlur={props.handleBlur("addedNotes")}
                                            blurOnSubmit={false}
                                        />
                                        <Text style={{ color: theme.colors.error }}>
                                            {/* {props.touched.status && props.errors.status} */}
                                        </Text>

                                        <TextInput
                                            error={
                                                props.touched.status && props.errors.status
                                                    ? true
                                                    : false
                                            }
                                            mode="flat"
                                            // autoComplete='status'
                                            onChangeText={props.handleChange("status")}
                                            value={props.values.status}
                                            placeholder=""
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Status"
                                            autoCapitalize="none"
                                            keyboardType="default"
                                            returnKeyType="next"
                                            activeUnderlineColor={Colors.blue700}
                                            onBlur={props.handleBlur("status")}
                                            blurOnSubmit={false}
                                            disabled
                                        />
                                        <Text style={{ color: theme.colors.error }}>
                                            {/* {props.touched.status && props.errors.status} */}
                                        </Text>



                                    </View>

                                    <View style={[styles.buttonContainter, { backgroundColor: theme.colors.background }]} >
                                        <Button
                                            disabled={isSubmitting || route.params.status !== 0}
                                            loading={isSubmitting}
                                            mode="contained"
                                            onPress={props.handleSubmit}
                                            style={{
                                                backgroundColor: route.params.status === 0 ?
                                                    userTeamColor : Colors.green300, width: '100%', paddingVertical: 10
                                            }}

                                        >
                                            <Text style={{ color: 'white' }}>Send to Recipient</Text>
                                        </Button>

                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                </ScrollView >
                <Toastbar message={message} onClose={() => setNotification({ type: "", text: "" })} />
            </>
        )}

    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 0, margin: 0, marginTop: "10%"
    },
    buttonContainter: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
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

});