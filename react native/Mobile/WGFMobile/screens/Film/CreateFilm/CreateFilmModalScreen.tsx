import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ToastAndroid, Modal, Platform, ActionSheetIOS, StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { createNewFilm, uploadVideo } from '../../../services/VideoUploadService';
import { BASE_URL } from '../../../const';
import { RootDrawerScreenProps } from '../../../types';
import { getSession } from '../../../services/common/Session';
import { preferencesContext } from '../../PreferenceHelper';
import { TextInput, Button, Colors, Title, useTheme } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import CustomDateTimePicker from '../../../components/CustomDateTimePicker';
import { ImageInfo } from 'expo-image-picker';
import Toastbar from '../../../components/Toastbar';
import { MessageModel } from '../../../services/Model/MessageModel';
import { Formik } from "formik";
import * as yup from "yup";
import { PreferencesContext } from '../../../PreferencesContext';


const initialState = {
    filmTitle: "",
    // type: "",
    // sound: "",
    // camera: "",
    // date: "",
    tag: "",

};


export default function CreateFilmModalScreen({ navigation, route }) {
    const theme = useTheme();
    const isFocused = useIsFocused();
    const [date, setDate] = useState(`${new Date().toISOString().slice(0, 10)}`);
    let [sound, setSound] = React.useState(0);
    let [type, setType] = React.useState(0);
    let [camera, setCamera] = React.useState(0);
    let [tag, setTag] = React.useState("");
    const [modalVisible, setModalVisible] = React.useState(false);
    //const [filmTitle, setFilmTitle] = React.useState("");
    const [isIOS, setIsIOS] = React.useState(false);
    const [filmGuid, setFilmGuid] = React.useState("");
    const [playListid, setplayListid] = React.useState("");
    const [openSound, setOpenSound] = useState(false);
    const [openType, setOpenType] = useState(false);
    const [openCamera, setOpenCamera] = useState(false);
    const [soundItems, setSoundItems] = useState([
        { label: 'Remove Audio', value: 0 },
        { label: 'Keep Audio', value: 1 }
    ]);
    const [typeItems, setTypeItems] = useState([
        { label: 'Game', value: 0 },
        { label: 'Practice', value: 1 },
        { label: 'Scout', value: 2 },
        { label: 'Training', value: 3 },
        { label: 'Other', value: 4 }
    ]);
    const [cameraItems, setCameraItems] = useState([
        { label: 'Sideline', value: 0 },
        { label: 'Endzone', value: 1 },
        { label: 'Pressbox', value: 2 },
        { label: 'Drone', value: 3 },
        { label: 'Stands', value: 4 },
        { label: 'Body', value: 5 }
    ]);
    const [createFilmDisabled, setCreateFilmDisabled] = useState(false);
    const typeList = ["Game", "Practice", "Scout", "Training", "Other"];
    const [message, setNotification] = useState(new MessageModel);
    const [profileData, setProfileData] = useState(initialState);
    const { userContext } = React.useContext(PreferencesContext);
    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
    useEffect(() => {
        (async () => {
            if (Platform.OS === "ios") {
                setIsIOS(true);
            }
        })();

    }, []);

    const filmModal = { TeamId: 0, UserId: 0, Title: "", Date: "", Audio: 0, Group: "", Angle: 0, Tags: "" };

    const saveUploadFromDevice = async (filmGuId: string, playListId: number, index: number, videoUri: ImageInfo) => {
        const data = new FormData();
        data.append("videoFile", {
            name: videoUri.uri?.split("/").pop(),
            type: "video/mp4",
            uri: videoUri.uri
        });
        data.append("filmGuid", filmGuId);
        data.append("playlistId", playListId);
        data.append("clipOrder", `${index + 1}`);
        //console.log("Hello Clip order ", `${index + 1}`)

        const response = await uploadVideo(data);
        if (response && response.status == 200) {
            console.log("Upload Successful")
        } else {
            console.log("Upload Failed")
        }
    }

    const validateSchema = yup.object({
        filmTitle: yup.string().trim().required("Film Title is required."),
    });


    const createFilmHandler = async (values: any) => {

        setCreateFilmDisabled(true);
        filmModal.Title = values.filmTitle;
        filmModal.Date = date;
        filmModal.Audio = parseInt(sound.toString());
        filmModal.Group = typeList[type];
        filmModal.Angle = parseInt(camera.toString());
        filmModal.Tags = values.tag;

        var result = await createNewFilm(filmModal);

        setFilmGuid(result?.data["filmguid"]);
        setplayListid(result?.data["playlistid"]);

        const previousScreen = route.params?.prevScreen;

        if (!previousScreen) {

            navigation.navigate("RecordGame"
                , {
                    filmTitle: values.filmTitle,
                    filmGuid: result?.data["filmguid"],
                    playListid: result?.data["playlistid"]
                })
        }
        else {

            if (previousScreen == 'UploadFromDevice') {

                if (route.params?.multiUri && route.params?.multiUri.length > 0) {
                    route.params?.multiUri.map((item: ImageInfo, index: number) => {
                        saveUploadFromDevice(result.data["filmguid"], result?.data["playlistid"], index, item);
                    });
                }
            } else if (previousScreen == 'GoogleDriveUpload') {
                const data = {
                    "files": route.params?.driveFiles,
                    "filmGuid": result.data["filmguid"],
                    "playlistId": result.data["playlistid"],
                    "userId": 0,
                    "teamId": 0,
                    "teamGuid": ""
                };
                await getSession()
                    .then(function (value) {
                        data["userId"] = value.userInfo?.userId;
                        data["teamId"] = value.userInfo?.teamId;
                        data["teamGuid"] = value.userInfo?.teamguid;
                    })

                // await GoogleDriveTransfer(data);

                await axios({
                    method: 'post',
                    url: `${BASE_URL}/api/UploadFilm/GoogleDriveTransfer`,
                    data: data
                }).then((response) => {
                    console.log(response.status);
                });
            } else if (previousScreen == "TranferFromHudl") {
                const data = {
                    "URL": route.params?.hudlUrl,
                    "FilmGuid": result.data["filmguid"],
                    "PlaylistId": result.data["playlistid"]
                }

                await axios({
                    method: 'post',
                    url: `${BASE_URL}/api/UploadFilm/DownloadHudl`,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: data
                }).then((response) => {
                    console.log(response.status);
                });
            }

            navigation.navigate("Dashboard");
        }
    }

    function getTeamColor() {
        const { userContext } = preferencesContext();
        return userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
    }


    const getTextColor = () => {
        return theme.colors.background === "rgb(1, 1, 1)" ? "#fff" : "black";
    }


    return (
        isFocused && (
            <View>
                <ScrollView>

                    <Formik
                        enableReinitialize={true}
                        initialValues={profileData}
                        validationSchema={validateSchema}
                        onSubmit={(values) => createFilmHandler(values)}

                    >
                        {
                            (props) => (
                                <>
                                    <View style={styles.container}>
                                        <View style={{}}>

                                            <TextInput

                                                error={
                                                    props.touched.filmTitle && props.errors.filmTitle
                                                        ? true
                                                        : false
                                                }
                                                onChangeText={props.handleChange("filmTitle")}
                                                blurOnSubmit={false}
                                                mode="flat"
                                                placeholder="Enter Film Title"
                                                placeholderTextColor={theme.colors.placeholder}
                                                returnKeyType="next"
                                                activeUnderlineColor={userTeamColor}
                                                value={props.values.filmTitle}
                                                autoCapitalize="none"
                                                label="Film Title *"
                                                keyboardType="default"
                                            // activeUnderlineColor={userTeamColor}

                                            />
                                        </View>
                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>
                                        {

                                            (route.params?.prevScreen) ?
                                                <>
                                                    <View>
                                                        <CustomDateTimePicker
                                                            label='Date (MM/DD/YYYY)'
                                                            onChange={(d) => setDate(d)}
                                                            value={undefined}
                                                        />
                                                    </View>

                                                    <Text >
                                                    </Text></> : null
                                        }

                                        <View>

                                            <DropDown
                                                label={"Type"}
                                                mode={"flat"}
                                                visible={openType}
                                                showDropDown={() => setOpenType(true)}
                                                onDismiss={() => setOpenType(false)}
                                                value={type}
                                                setValue={setType}
                                                list={typeItems}
                                                activeColor={getTeamColor()}
                                            />


                                        </View>
                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>
                                        <View>

                                            <DropDown
                                                label={"Sound"}
                                                mode={"flat"}
                                                visible={openSound}
                                                showDropDown={() => setOpenSound(true)}
                                                onDismiss={() => setOpenSound(false)}
                                                value={sound}
                                                setValue={setSound}
                                                list={soundItems}
                                                activeColor={getTeamColor()}
                                            />
                                        </View>
                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>



                                        <View >
                                            <DropDown
                                                label={"Camera"}
                                                mode={"flat"}
                                                visible={openCamera}
                                                showDropDown={() => setOpenCamera(true)}
                                                onDismiss={() => setOpenCamera(false)}
                                                value={camera}
                                                setValue={setCamera}
                                                list={cameraItems}
                                                activeColor={getTeamColor()}
                                            />

                                        </View>
                                        <Text style={{ color: theme.colors.error }}>
                                        </Text>
                                        <View>
                                            <TextInput

                                                error={
                                                    props.touched.tag && props.errors.tag
                                                        ? true
                                                        : false
                                                }
                                                blurOnSubmit={false}
                                                mode="flat"
                                                placeholder="Tags"
                                                label="Tags"
                                                placeholderTextColor={theme.colors.placeholder}
                                                returnKeyType="next"
                                                onChangeText={props.handleChange("tag")}
                                                activeUnderlineColor={userTeamColor}
                                                value={props.values.tag}
                                            />

                                            <Text style={{ color: theme.colors.error }}>

                                            </Text>


                                        </View>

                                        <View style={[styles.buttonContainter, { backgroundColor: theme.colors.background }]} >
                                            <Button
                                                mode="contained"
                                                onPress={props.handleSubmit}
                                                style={{ backgroundColor: getTeamColor(), width: '100%', paddingVertical: 10 }}
                                            >
                                                <Text style={{ color: 'white' }}>Create Film</Text>
                                            </Button>

                                        </View>

                                    </View>
                                </>
                            )}
                    </Formik>
                </ScrollView >

                <Toastbar message={message} onClose={() => setNotification({ type: "", text: "" })} />
            </View >

        )
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: "column",
        justifyContent: "center",
        padding: "5%",
        marginTop: "8%",
        paddingBottom: 0,

    },
    text: {
        // fontSize: 16,
        fontWeight: "bold",
        paddingTop: 7,
    },
    textInput: {
        height: 48,
        // borderColor: '#cccccc',
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
        backgroundColor: "#6c757d",
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
        top: 4,
        marginLeft: 160
    },
    datePickerContainer: {
        height: 48,
        // borderColor: '#cccccc',
        borderRadius: 6,
        borderWidth: 1,
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
    buttonContainter:
    {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },


})
