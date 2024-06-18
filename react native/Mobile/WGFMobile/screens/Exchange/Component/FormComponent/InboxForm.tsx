import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SafeAreaView, View, StyleSheet, Platform, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Text, useTheme, TextInput, Colors, Button } from "react-native-paper";
import * as yup from "yup";
//import DatePicker from 'react-native-datepicker';
import Toastbar from "../../../../components/Toastbar";
import { MessageModel } from "../../../../services/Model/MessageModel";
import DropDown from "react-native-paper-dropdown";
import { PreferencesContext } from "../../../../PreferencesContext";
import { ExchangeTeam, LockerOut } from "../../../../services/Model/ExchangeModel";
import { getTeamByEmailAddress, insertLeagueExchange, leagueTeam } from "../../../../services/ExchangeService";
import { LeagueTeamModel } from "../../../../services/Model/LeagueTeamModel";
import CustomDateTimePicker from '../../../../components/CustomDateTimePicker';

const initialState = {
    title: "",
    tags: "",
};

export default function InboxForm({ route }: { route: any }) {
    const navigation = useNavigation();
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [profileData, setProfileData] = useState(initialState);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());
    const [role, setRole] = useState(0);
    const [openType, setOpenType] = useState(false);
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [teamEmail, setTeamEmail] = useState("");


    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

    const [teams, setTeams] = useState([
        { label: 'Game', value: 0 },
        { label: 'Practice', value: 1 },
        { label: 'Scout', value: 2 },
        { label: 'Training', value: 3 },
        { label: 'Other', value: 4 }
    ]);


    async function init() {
    }

    useLayoutEffect(() => {
        const formdata = route.params;
        initialState.title = formdata.title;
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
    });

    function goBack() {
        navigation.getParent()?.setOptions({
            headerShown: true,
        });
        navigation.navigate("ExchangeFilmTab");
    }

    const saveUserHandler = async (values: any) => {
        console.log("save")
        console.log(values);
        if (role === 0) {
            return;
        }

        // Alert.alert(
        //     "",
        //     "Are you sure you want to post this League Locker film to the specified location? Please note that it may take a few minutes for the physical video to be copied to your team.",
        //     [
        //         {
        //             text: "Yes",
        //             onPress: async () => {
        //                 try {
        // insertExchangeInbox();
        //                 } catch (error) {
        //                     console.log(error);
        //                 }
        //                 // setNotification({ type: "success", text: "" });
        //             },
        //         },
        //         // The "No" button
        //         // Does nothing but dismiss the dialog when tapped
        //         {
        //             text: "No",
        //         },
        //     ]
        // );




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
            >Add Pending Film to My Team</Text>
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
                                        <TextInput
                                            error={
                                                props.touched.title && props.errors.title
                                                    ? true
                                                    : false
                                            }
                                            mode="flat"
                                            //autoComplete='title'
                                            onChangeText={props.handleChange("title")}
                                            value={props.values.title}
                                            placeholder=""
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Title *"
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

                                        <DropDown

                                            label={"Type"}
                                            mode={"flat"}
                                            visible={openType}
                                            showDropDown={() => setOpenType(true)}
                                            onDismiss={() => setOpenType(false)}
                                            value={role}
                                            setValue={setRole}
                                            list={teams}
                                            activeColor={userTeamColor}
                                            theme={theme}

                                        />

                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>

                                        {/* <View>
                                            <View style={[styles.datePickerContainer, {
                                                backgroundColor: theme.dark ? theme.colors.background : "#e3e3e3",
                                                borderBottomWidth: 1,
                                                borderBottomColor: theme.colors.disabled,
                                            }]}> */}
                                        {/* <DatePicker
                                                    style={styles.datePicker}
                                                    date={date}
                                                    mode="date"
                                                    placeholder="Date"
                                                    format="YYYY-MM-DD"
                                                    minDate="2000-01-01"
                                                    maxDate="2090-06-01"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateIcon: styles.dateIcon,
                                                        dateInput: {
                                                            paddingTop: 20,
                                                            borderWidth: 0,
                                                            // paddingLeft: 0,
                                                            paddingRight: 265

                                                        },
                                                        dateText: {
                                                            color: theme.colors.text
                                                        },

                                                        placeholderText: {
                                                            // marginLeft: Platform.OS === "android" ? -84 : -50,
                                                            fontSize: 16,
                                                            color: theme.colors.placeholder
                                                        }
                                                        // ... You can check the source to find the other keys.
                                                    }}
                                                    onDateChange={(date: any) => { setDate(date) }}
                                                /> */}
                                        {/* </View>

                                        </View> */}

                                        <View >

                                            <CustomDateTimePicker
                                                label='Date (MM/DD/YYYY)'
                                                onChange={(d) => setDate(d)}
                                                value={new Date(route.params.date)}
                                            />

                                        </View>

                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>

                                        <TextInput
                                            error={
                                                props.touched.tags && props.errors.tags
                                                    ? true
                                                    : false
                                            }
                                            mode="flat"
                                            // autoComplete='Tags'
                                            onChangeText={props.handleChange("tags")}
                                            value={props.values.tags}
                                            placeholder=""
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Tags"
                                            autoCapitalize="none"
                                            keyboardType="default"
                                            returnKeyType="next"
                                            activeUnderlineColor={Colors.blue700}
                                            onBlur={props.handleBlur("tags")}
                                            blurOnSubmit={false}
                                        />
                                        <Text style={{ color: theme.colors.error }}>
                                            {/* {props.touched.tags && props.errors.tags} */}
                                        </Text>


                                    </View>

                                    <View style={[styles.buttonContainter, { backgroundColor: theme.colors.background }]} >
                                        <Button
                                            disabled={isSubmitting}
                                            loading={isSubmitting}
                                            mode="contained"
                                            onPress={props.handleSubmit}
                                            style={{
                                                backgroundColor: userTeamColor, width: '100%', paddingVertical: 10
                                            }}

                                        >
                                            <Text style={{ color: 'white' }}>Post Film to Team</Text>
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