import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Platform, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { TextInput, useTheme, Button, Colors, Chip } from "react-native-paper";
import { PreferencesContext } from "../../../PreferencesContext";
import * as yup from "yup";
import ProcessingIndicator from "../../../components/ProcessingIndicator";
import { Formik } from "formik";
import DropDown from "react-native-paper-dropdown";
//import DatePicker from 'react-native-datepicker';
import { getSession } from "../../../services/common/Session";
import { UpdatePlaylistClip } from "../../../services/PlaylistClipService";
import CustomDateTimePicker from '../../../components/CustomDateTimePicker';
const initialState = {
    filmTitle: "",
    type: -1,
    tags: "",
    view: -1
};

export default function ({ route }: { route: any }) {
    const theme = useTheme();
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    let [view, setView] = React.useState(0);
    let [type, setType] = React.useState(1);
    let [typeErrorMessage, setTypeErrorMessage] = React.useState("");
    let [camera, setCamera] = React.useState(0);
    let [tag, setTag] = React.useState("");
    const [filmTitle, setFilmTitle] = React.useState("");
    const [filmTitleErrorMessage, setFilmTitleErrorMessage] = React.useState("");
    const [isIOS, setIsIOS] = React.useState(false);
    const [filmGuid, setFilmGuid] = React.useState("");
    const [playListid, setplayListid] = React.useState("");
    const [openView, setOpenView] = useState(false);
    const [openType, setOpenType] = useState(false);
    const [recordData, setRecordData] = useState(initialState);


    const [localRouteParams, setLocalRouteParams] = useState(route.params.data);

    const [viewItems, setViewItems] = useState([
        { value: 1, label: "Misc" },
        { value: 2, label: "All Sports" },
        { value: 3, label: "Football" },
        { value: 4, label: "Volleyball" },


    ]);
    const [typeItems, setTypeItems] = useState([
        { label: 'Game', value: 0 },
        { label: 'Practice', value: 1 },
        { label: 'Scout', value: 2 },
        { label: 'Training', value: 3 },
        { label: 'Other', value: 4 }
    ]);

    const [createFilmDisabled, setCreateFilmDisabled] = useState(false);
    const [isPreviousScreen, setIsPreviousScreen] = useState("");
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

    const typeList = ["Game", "Practice", "Scout", "Training", "Other"];

    useEffect(() => {
        (async () => {
            if (Platform.OS === "ios") {
                setIsIOS(true);
            }
        })();


        const unsubscribe = navigation.addListener('focus', () => {
            console.log(localRouteParams);
        });

        return unsubscribe;

    }, []);

    useEffect(() => { }, [route, localRouteParams]);

    useLayoutEffect(() => {
        const d = route.params.data.playlistData;
        //console.log(typeItems.filter(c => c.label === d.group)[0].value);
        initialState.filmTitle = d.name;
        // initialState.type = typeItems.filter(c => c.label === d.group)[0].value;
        initialState.view = d.view;
        initialState.tags = d.tags;
        setType(typeItems.filter(c => c.label === d.group)[0].value);
        setView(d.view);
        setDate(new Date(d.date));
    }, [route, localRouteParams]);

    const filmModal = {
        TeamId: 0,
        UserId: 0,
        PlaylistId: 0,
        PlaylistView: 0,
        PlaylistName: "",
        PlaylistDate: "",
        PlaylistGroup: "",
        PlaylistTags: ""
    };

    const createFilmHandler = async (values: any) => {

        if (values.filmTitle.length <= 0 && parseInt(type.toString()) < 0) {
            setTypeErrorMessage("Film type is required");
            setFilmTitleErrorMessage("Film title is required!");
            return;
        } else if (values.filmTitle.length <= 0) {
            setFilmTitleErrorMessage("Film title is required!");
            return;
        } else if (parseInt(type.toString()) < 0) {
            setTypeErrorMessage("Film type is required!");
            return;
        }


        setCreateFilmDisabled(true);

        filmModal.PlaylistName = values.filmTitle;
        filmModal.PlaylistDate = date;
        filmModal.PlaylistGroup = typeItems.filter(c => c.value === type)[0].label;
        filmModal.PlaylistTags = values.tags;
        filmModal.PlaylistView = view;
        filmModal.PlaylistId = route.params.data.playlist;

        getSession().then((value) => {
            filmModal.TeamId = value.userInfo.teamId;
            filmModal.UserId = value.userInfo.userId;
        }).then(() => {
            UpdatePlaylistClip(filmModal);
            // navigation.navigate("ViewPlaylist");
            //navigation.goBack();

            localRouteParams.playlistData.name = filmModal.PlaylistName;
            localRouteParams.playlistData.date = filmModal.PlaylistDate;
            localRouteParams.playlistData.tags = filmModal.PlaylistTags;
            localRouteParams.playlistData.group = filmModal.PlaylistGroup;
            localRouteParams.playlistData.view = filmModal.PlaylistView;

            navigation.navigate('ViewFilm', {
                screen: 'VIDEO',
                params: {
                    playlist: localRouteParams.playlist, view: view, clipId: 0, order: 1,
                    title: values.filmTitle, showMenu: localRouteParams.showMenu, playlistData: localRouteParams.playlistData
                },
            });

        })


        // var result = await createNewFilm(filmModal);

        // setFilmGuid(result?.data["filmguid"]);
        // setplayListid(result?.data["playlistid"]);

    }

    const validateSchema = yup.object({
        filmTitle: yup.string().trim().required("Film title is required."),
    });

    const getTextColor = () => {
        return theme.colors.background === "rgb(1, 1, 1)" ? "#fff" : "black";
    }

    return (
        isFocused && (

            <SafeAreaView style={styles.container}>
                {
                    isSubmitting && isSubmitting == true ? (
                        <View style={styles.processingIndicator}>
                            <ProcessingIndicator isLoading={isSubmitting} indicatorColor={theme.colors.text} />
                        </View>
                    ) :
                        (
                            <>
                                <ScrollView style={{ height: 'auto' }}>
                                    <View style={[{ flex: 1, padding: 20 }]}>
                                        <Formik
                                            enableReinitialize={true}
                                            initialValues={recordData}
                                            validationSchema={validateSchema}
                                            onSubmit={(values) => createFilmHandler(values)}
                                        >
                                            {(props) => (
                                                <>
                                                    <View>
                                                        <TextInput
                                                            error={
                                                                props.touched.filmTitle && props.errors.filmTitle
                                                                    ? true
                                                                    : false
                                                            }
                                                            mode="flat"
                                                            //  autoComplete='filmTitle'

                                                            onChangeText={props.handleChange("filmTitle")}
                                                            onBlur={props.handleBlur("filmTitle")}
                                                            placeholder=""
                                                            placeholderTextColor={theme.colors.placeholder}
                                                            label="Title *"
                                                            autoCapitalize="none"
                                                            keyboardType="default"
                                                            returnKeyType="next"
                                                            activeUnderlineColor={userTeamColor}
                                                            blurOnSubmit={false}
                                                            value={props.values.filmTitle}
                                                        />

                                                        <Text>
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
                                                                    placeholder="Remove User Date"
                                                                    format="YYYY-MM-DD"
                                                                    // minDate="2000-01-01"
                                                                    // maxDate="2090-06-01"
                                                                    confirmBtnText="Confirm"
                                                                    cancelBtnText="Cancel"
                                                                    customStyles={{
                                                                        dateIcon: styles.dateIcon,
                                                                        dateInput: {
                                                                            paddingTop: 20,
                                                                            borderWidth: 0,
                                                                            paddingLeft: 0,
                                                                            marginRight: 200

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
                                                                value={new Date(route.params.data.playlistData.date)}
                                                            />

                                                        </View>


                                                        <Text style={{ color: theme.colors.error }}>
                                                        </Text>


                                                        <DropDown
                                                            label={"Type "}
                                                            mode={"flat"}
                                                            visible={openType}
                                                            showDropDown={() => setOpenType(true)}
                                                            onDismiss={() => setOpenType(false)}
                                                            list={typeItems}
                                                            activeColor={userTeamColor}
                                                            value={type}
                                                            setValue={setType}
                                                            inputProps={{ error: (typeErrorMessage.length > 0) ? true : false }}
                                                        />
                                                        <Text>
                                                        </Text>


                                                        <TextInput
                                                            error={
                                                                props.touched.tags && props.errors.tags
                                                                    ? true
                                                                    : false
                                                            }
                                                            mode="flat"
                                                            //autoComplete='Tags'
                                                            onChangeText={props.handleChange("tags")}
                                                            value={props.values.tags}
                                                            placeholder=""
                                                            placeholderTextColor={theme.colors.placeholder}
                                                            label="Tags"
                                                            autoCapitalize="none"
                                                            keyboardType="default"
                                                            returnKeyType="next"
                                                            activeUnderlineColor={userTeamColor}
                                                            onBlur={props.handleBlur("tags")}
                                                            blurOnSubmit={false}
                                                        />
                                                        <Text style={{ color: theme.colors.error }}>
                                                            {/* {props.touched.tags && props.errors.tags} */}
                                                        </Text>

                                                    </View>

                                                    <DropDown
                                                        label={"View"}
                                                        mode={"flat"}
                                                        visible={openView}
                                                        showDropDown={() => setOpenView(true)}
                                                        onDismiss={() => setOpenView(false)}
                                                        value={view}
                                                        setValue={setView}
                                                        list={viewItems}
                                                        activeColor={userTeamColor}
                                                    />

                                                    <Text></Text>

                                                    <View style={[styles.buttonContainter, { backgroundColor: theme.colors.background }]} >
                                                        <Button
                                                            disabled={isSubmitting}
                                                            loading={isSubmitting}
                                                            mode="contained"
                                                            onPress={props.handleSubmit}
                                                            style={{ backgroundColor: userTeamColor, width: '100%', paddingVertical: 10 }}
                                                        >
                                                            <Text style={{ color: 'white' }}>Save</Text>
                                                        </Button>
                                                    </View>
                                                </>
                                            )}
                                        </Formik>
                                    </View>
                                </ScrollView >
                            </>
                        )
                }
            </SafeAreaView >
        )
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 0, margin: 0,
    },


    text: {
        fontWeight: "bold",
        paddingTop: 7,
    },
    buttonContainter:
    {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    textInput: {
        height: 48,
        borderRadius: 6,
        borderWidth: 1,
        paddingLeft: 8,
        backgroundColor: '#ffffff',
    },
    button: {
        marginTop: 50,
        marginBottom: "100%",
        width: 160,
        marginLeft: 120,
    },
    pressableButton: {
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: "#6c757d",
        width: "100%",
        height: 50,
        marginTop: "10%",
        marginBottom: Platform.OS == "android" ? 150 : 80,
        borderRadius: 10,
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
        elevation: 5
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
    modalText: {
        marginBottom: 15,
        textAlign: "center"
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
    pickerItemStyle: {
        flex: 1,
        fontWeight: '100',
        fontSize: 20,
        paddingTop: 57,
        marginRight: 100,
        height: 60,
        width: 200,
    },
    pickerContainer: {
        borderWidth: 1,
        height: 40,
        width: Platform.OS == "android" ? 200 : 180,
        borderColor: "#cccccc",
        backgroundColor: "white"
    },
    processingIndicator: {
        flex: 1,
        justifyContent: 'center',
    }


})
