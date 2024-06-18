import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SafeAreaView, View, StyleSheet, Platform, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Text, useTheme, TextInput, Colors, Button } from "react-native-paper";
import * as yup from "yup";
// import DatePicker from 'react-native-datepicker';
import Toastbar from "../../../../components/Toastbar";
import { MessageModel } from "../../../../services/Model/MessageModel";
import DropDown from "react-native-paper-dropdown";
import { PreferencesContext } from "../../../../PreferencesContext";
import { ExchangeLeagueInsert, ExchangeTeam, LockerOut } from "../../../../services/Model/ExchangeModel";
import { getTeamByEmailAddress, insertLeagueExchange, leagueTeam } from "../../../../services/ExchangeService";
import { LeagueTeamModel } from "../../../../services/Model/LeagueTeamModel";
import CustomDateTimePicker from '../../../../components/CustomDateTimePicker';

const initialState = {
    title: "",
    clip: "",
    status: "",
    email: "",
};

export default function TeamForm({ route }: { route: any }) {
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

    const [teams, setTeams] = useState([{ label: 'Select Team', value: 0 }]);


    async function init() {
    }

    useLayoutEffect(() => {
        const formdata = route.params;
        initialState.title = formdata.title;
        initialState.clip = formdata.clips.toString();
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
        email: yup.string().trim().email("Invalid email address.").required("Email is required.")
    });

    function goBack() {
        navigation.getParent()?.setOptions({
            headerShown: true,
        });
        navigation.navigate("ExchangeFilmTab");
    }

    const saveUserHandler = async (values: any) => {

        if (role === 0) {
            return;
        }

        Alert.alert(
            "",
            "Warning! The Receiving Team will own a copy of this film and you will be unable to recall this Exchange. Are you sure you want to send this film to the Receiving Team ? ",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            let data: ExchangeLeagueInsert = new ExchangeLeagueInsert;
                            data.PlaylistGuid = route.params.filmGuid;
                            data.filmDate = date;
                            data.newTeamId = role;
                            data.oldteamId = userContext.userInfo.teamId;
                            data.playlistName = values.title;
                            data.userId = userContext.userInfo.userId;
                            // console.log(data);
                            await insertLeagueExchange(data);
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

    async function findTeam() {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(teamEmail)) {
            try {
                var result: ExchangeTeam[] = await getTeamByEmailAddress(teamEmail);
                const teamList = result.map(x => ({
                    label: x.teamname,
                    value: x.teamid
                }))
                setTeams(teamList);
            } catch (error) {
                setNotification({ type: "error", text: "User cannot be found in our WatchGameFilm database and to try another email" })
            }

        }
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
            >Exchange Film with Team</Text>
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
                                            //  autoComplete='title'
                                            onChangeText={props.handleChange("title")}
                                            value={props.values.title}
                                            placeholder=""
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Playlist Title *"
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

                                        {/* <View>
                                            <View style={[styles.datePickerContainer, {
                                                backgroundColor: theme.dark ? theme.colors.background : "#e3e3e3",
                                                borderBottomWidth: 1,
                                                borderBottomColor: theme.colors.disabled,
                                            }]}>
                                                <DatePicker
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
                                                />
                                            </View>

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
                                                props.touched.clip && props.errors.clip
                                                    ? true
                                                    : false
                                            }
                                            mode="flat"
                                            // autoComplete='clip'
                                            onChangeText={props.handleChange("clip")}
                                            value={props.values.clip}
                                            placeholder=""
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Clips"
                                            autoCapitalize="none"
                                            keyboardType="default"
                                            returnKeyType="next"
                                            activeUnderlineColor={Colors.blue700}
                                            onBlur={props.handleBlur("clip")}
                                            blurOnSubmit={false}
                                            disabled={true}

                                        />
                                        <Text style={{ color: theme.colors.error }}>
                                            {/* {props.touched.clips && props.errors.clips} */}
                                        </Text>

                                        <TextInput
                                            error={
                                                props.touched.status && props.errors.status
                                                    ? true
                                                    : false
                                            }
                                            mode="flat"
                                            //  autoComplete='status'
                                            onChangeText={props.handleChange("status")}
                                            value={props.values.status}
                                            placeholder=""
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Status"
                                            autoCapitalize="none"
                                            keyboardType="default"
                                            returnKeyType="next"
                                            activeUnderlineColor={Colors.blue700}
                                            // onSubmitEditing={() => {
                                            //     props.tags.focus()
                                            // }}
                                            onBlur={props.handleBlur("status")}
                                            blurOnSubmit={false}
                                            disabled={true}
                                        />
                                        <Text style={{ color: theme.colors.error }}>
                                            {/* {props.touched.status && props.errors.status} */}
                                        </Text>

                                        <TextInput
                                            mode="flat"
                                            //   autoComplete='sendTo'
                                            placeholder="The person you want to exchange film with must be part of an active WatchGameFilm team"
                                            placeholderTextColor={theme.colors.placeholder}
                                            label="Send Film To"
                                            autoCapitalize="none"
                                            returnKeyType="next"
                                            onBlur={props.handleBlur("status")}
                                            blurOnSubmit={false}
                                            multiline
                                            disabled={true}
                                        />
                                        <Text>
                                        </Text>

                                        <View
                                            style={{ flexDirection: "row", justifyContent: "space-between" }}
                                        >
                                            <View style={{ width: "65%" }}>
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
                                                    //  autoComplete='email'
                                                    onChangeText={(value) => {
                                                        props.handleChange("email")(value);
                                                        setTeamEmail(value);
                                                    }}
                                                    value={props.values.email}
                                                    placeholder="email@examples.com"
                                                    placeholderTextColor={theme.colors.placeholder}
                                                    label="Email Address*"
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
                                            </View>


                                            <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                                <Button onPress={findTeam} color={userTeamColor}>
                                                    Find Team
                                                </Button>
                                            </TouchableOpacity>
                                        </View>




                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>



                                        <DropDown

                                            label={"Receiving Team"}
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
                                            <Text style={{ color: 'white' }}>Send Film to Receiving Team</Text>
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