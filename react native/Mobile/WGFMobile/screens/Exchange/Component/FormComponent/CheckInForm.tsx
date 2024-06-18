import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, Platform, ScrollView, Alert } from "react-native";
import { Text, useTheme, TextInput, Colors, Button } from "react-native-paper";
import * as yup from "yup";
//import DatePicker from 'react-native-datepicker';
import Toastbar from "../../../../components/Toastbar";
import { MessageModel } from "../../../../services/Model/MessageModel";
import DropDown from "react-native-paper-dropdown";
import { PreferencesContext } from "../../../../PreferencesContext";
import { exchangeLeaguePostData, getLockerInTeams, insertLockIn } from "../../../../services/ExchangeService";
import { LeagueTeamModel } from "../../../../services/Model/LeagueTeamModel";
import { ExchangeLeague, LockerIn } from "../../../../services/Model/ExchangeModel";
import CustomDateTimePicker from '../../../../components/CustomDateTimePicker';
import { format } from 'date-fns';

const initialState = {
    title: "",
    status: "",
};

export default function CheckInForm({ route }: { route: any }) {
    const navigation = useNavigation();
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [profileData, setProfileData] = useState(initialState);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());
    const [role, setRole] = useState(0);
    const [home, setHome] = useState(0);
    const [away, setAway] = useState(0);
    const [openHome, setOpenHome] = useState(false);
    const [openAway, setOpenAway] = useState(false);
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const [date, setDate] = React.useState<Date | undefined>(undefined);

    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;


    const [teams, setTeams] = useState([{ label: 'Select Team', value: 0 }]);

    async function init() {
        try {
            var teamId = userContext.userInfo.teamId;
            var result: LeagueTeamModel[] = await getLockerInTeams(teamId);
            const teamList = result.map(x => ({
                label: x.teamname,
                value: x.teamid
            }))
            setTeams(teamList);


        } catch (error) {

        }

    }

    useLayoutEffect(() => {
        const formdata = route.params.playlistInfo;
        initialState.title = formdata.playlistname;
        initialState.status = formdata.status === 0 ? "Ready to Add to Locker!" : "Playlist Incomplete!  Unable to Exchange";

        setDate(formdata.playlistdate);

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
        title: yup.string().trim().required("Title is required.")
    });

    function goBack() {
        navigation.getParent()?.setOptions({
            headerShown: true,
        });
        navigation.navigate("ExchangeFilmTab");
    }

    const saveUserHandler = async (values: any) => {

        if (home === 0 || away === 0) {
            return;
        }

        try {
            let data: LockerIn = new LockerIn;

            data.awayTeamId = away;
            data.homeTeamId = home;
            data.playlistDate = date;
            data.playlistName = values.title;
            data.playlistGuid = route.params.playlistGuid;
            data.userId = userContext.userInfo.userId;
            data.teamId = userContext.userInfo.teamId;
            console.log(data);

            var result = await insertLockIn(data);
            navigation.goBack();
        } catch (error) {
            console.log(error);
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
            >Check In Film to League Locker</Text>
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

                            {/* <Divider style={{ borderWidth: 0.5, borderColor: theme.colors.disabled }} /> */}
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
                                            //     props.status.focus()
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
                                                value={new Date(route.params.playlistInfo.playlistdate)}
                                            />

                                        </View>

                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>

                                        <DropDown

                                            label={"Home"}
                                            mode={"flat"}
                                            visible={openHome}
                                            showDropDown={() => setOpenHome(true)}
                                            onDismiss={() => setOpenHome(false)}
                                            value={home}
                                            setValue={setHome}
                                            list={teams}
                                            activeColor={userTeamColor}
                                            theme={theme}
                                        />

                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>

                                        <DropDown

                                            label={"Away"}
                                            mode={"flat"}
                                            visible={openAway}
                                            showDropDown={() => setOpenAway(true)}
                                            onDismiss={() => setOpenAway(false)}
                                            value={away}
                                            setValue={setAway}
                                            list={teams}
                                            activeColor={userTeamColor}
                                            theme={theme}
                                        />

                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>

                                        <TextInput
                                            ref={(input: any) => {
                                                props.status = input;
                                            }}
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
                                            disabled={true}
                                        />

                                        <Text style={{ color: theme.colors.error }}>
                                            {/* {props.touched.email && props.errors.email} */}
                                        </Text>

                                    </View>

                                    <View style={[styles.buttonContainter, { backgroundColor: theme.colors.background }]} >
                                        <Button
                                            disabled={isSubmitting || route.params.playlistInfo.status !== 0}
                                            loading={isSubmitting}
                                            mode="contained"
                                            onPress={props.handleSubmit}
                                            style={{
                                                backgroundColor: route.params.playlistInfo.status === 0 ?
                                                    userTeamColor : Colors.green300, width: '100%', paddingVertical: 10
                                            }}

                                        >
                                            <Text style={{ color: 'white' }}>Add Film To Locker</Text>
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