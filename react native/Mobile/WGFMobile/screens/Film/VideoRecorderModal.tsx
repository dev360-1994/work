import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Camera, CameraType, VideoQuality, CameraRecordingOptions, AutoFocus, } from 'expo-camera';
import {
    StyleSheet, Text, View, Button, Pressable, ToastAndroid, Modal, Platform, Alert,
    BackHandler, useWindowDimensions, Dimensions, StatusBar
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { createNewFilm, uploadVideo } from '../../services/VideoUploadService';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { preferencesContext } from '../PreferenceHelper';
import * as ImagePicker from 'expo-image-picker';
import { ProgressBar, Colors, useTheme } from 'react-native-paper';
import { DeviceMotion, Accelerometer, DeviceSensor } from 'expo-sensors';
import * as ScreenOrientation from 'expo-screen-orientation';
import axios from 'axios';
import { MaterialIcons } from "@expo/vector-icons";
import { PinchGestureHandler } from 'react-native-gesture-handler';



export const VideoRecorderModal = (props) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [hasDeviceMotionPermission, setHasDeviceMotionPermission] = useState(null);
    const [camera, setCamera] = useState();
    const [record, setRecord] = useState(null);
    const [cameraType, setCameraType] = useState(CameraType.back);
    const [isIOS, setIsIOS] = React.useState(false);
    const [showStart, setShowStart] = React.useState(true);
    const [recordingCount, setRecordingCount] = React.useState(0);
    const [recordingText, setRecordingText] = useState("Recorded");
    const [uploadedCount, setUploadedCount] = React.useState(0);
    const [uploadingAttemtps, setUploadingAttemtps] = React.useState(0);
    const isFocused = useIsFocused();
    const { userContext } = preferencesContext();
    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
    const { height, width } = useWindowDimensions();
    const [orientationIsLandscape, setOrientation] = useState(true);
    const [accelerometerData, setaccelerometerData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    const [landscape, setLandscape] = useState(false);
    const [clipOrder, setClipOrder] = useState(0);
    const [zoom, setZoom] = useState(0);



    const _slow = () => {
        Accelerometer.setUpdateInterval(1000);
    };

    const _fast = () => {
        Accelerometer.setUpdateInterval(1000);
    };

    const _subscribe = () => {
        setSubscription(
            Accelerometer.addListener(accelerometerData => {
                setaccelerometerData(accelerometerData);
            })
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    useEffect(() => {
        _subscribe();

        navigation?.getParent()?.setOptions({
            headerShown: false
        })
        // const { x, y, z } = accelerometerData;
        // setLandscape(Math.abs(x) > Math.abs(y));
        // console.log(Math.abs(x) > Math.abs(y));
        // const changeScreen = async () => {
        //     if (landscape) {
        //         await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        //     } else {
        //         await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        //     }
        // }
        // changeScreen();
        return () => _unsubscribe();
    }, []);



    // }, [props.navigation]);
    // useEffect(() => {
    //     () =>
    //         props.navigation.addListener('beforeRemove', (e) => {
    //             console.log("Prevent back");
    //             e.preventDefault();

    //             // Prompt the user before leaving the screen
    //             Alert.alert(
    //                 'Discard Upload?',
    //                 'You data is not uploaded. Are you sure to discard them and leave the screen?',
    //                 [
    //                     { text: "Don't leave", style: 'cancel', onPress: () => { } },
    //                     {
    //                         text: 'Discard',
    //                         style: 'destructive',
    //                         onPress: () => props.navigation.dispatch(e.data.action),
    //                     },
    //                 ]
    //             );
    //         })
    // }, [props.navigation]);
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                console.log("Hello aao mere")
                // props.navigation.navigate("VideoRecord");
                props.navigation.navigate("Dashboard");

                return true;
            }
            // Do something when the screen is focused
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => {

                // Do something when the screen is unfocused
                // Useful for cleanup functions
                // Alert.alert(
                //     'Want to leave',
                //     'You have unsaved changes, are you sure you want to leave?',
                //     [
                //         {
                //             text: 'yes',
                //             onPress: () => {
                //                 // should leave to the screen user has navigate
                //             },
                //         },
                //         { text: 'no', onPress: () => false },
                //     ],
                // )
            };
        }, [])
    );

    useEffect(() => {

        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const audioStatus = await Camera.requestMicrophonePermissionsAsync();
            setHasAudioPermission(audioStatus.status === 'granted');

            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

            const deviceMotionPermission = await Accelerometer.requestPermissionsAsync();
            setHasDeviceMotionPermission(deviceMotionPermission.status === "granted");

            if (Platform.OS === "ios") {
                setIsIOS(true);
            }
        })();

    }, []);

    useEffect(() => {

    }, [clipOrder])
    // useEffect(() => {
    //     Accelerometer.addListener((data) => {
    //         console.log(data);
    //     });

    // }, [Accelerometer]);


    async function changeScreenOrientation() {

        if (orientationIsLandscape == true) {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
        else if (orientationIsLandscape == false) {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
    }
    const toggleOrientation = () => {
        setOrientation(!orientationIsLandscape)
        changeScreenOrientation()
    }

    // useEffect(() => {
    //     DeviceMotion.addListener((obj) => {
    //         console.log(obj.rotation);
    //     })
    // }, [DeviceMotion]);

    const uploadSuccesfulToastr = () => {
        ToastAndroid.showWithGravity(
            "Upload Complete",
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    };
    const uploadFailedToastr = () => {
        ToastAndroid.showWithGravity(
            "Upload Failed",
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    };

    const takeVideo = async () => {
        setRecordingText("Recording");
        // let orientation = await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        // console.log(orientation);
        // let deviceMotion = await Accelerometer.isAvailableAsync();
        // console.log(deviceMotion);
        // const { x, y, z } = accelerometerData;
        // console.log(Math.abs(x) > Math.abs(y) ? "landscape" : "portrait");
        // console.log("height: " + height + ", width: " + width);

        const localUploadedCount = uploadedCount + 1;
        setShowStart(false);
        setRecordingCount(recordingCount + 1);
        setUploadedCount(localUploadedCount);
        console.log("==Upload Count ===", uploadedCount)
        setClipOrder(uploadedCount)

        if (camera) {
            const { uri, codec = "mp4" } = await camera.recordAsync({
                quality: VideoQuality['720p']
            });
            const type = `video/${codec}`;
            const data = new FormData();
            data.append("videoFile", {
                name: uri.split("/").pop(),
                type: "video/mp4",
                uri
            });
            data.append("filmGuid", props.route.params.filmGuid);
            data.append("playlistId", props.route.params.playListid);
            console.log("==ClipOrder==", localUploadedCount)
            data.append("clipOrder", localUploadedCount.toString());
            //setClipOrder

            await MediaLibrary.saveToLibraryAsync(uri).then(() => { console.log("saved video to gallary") });
            const response = await uploadVideo(data);
            console.log("video upload status:", response?.status);
            if (response.status == 200) {
                setUploadingAttemtps(prevState => prevState + 1);
            } else {
                setUploadingAttemtps(prevState => prevState + 1);
                setUploadedCount(prevState => prevState - 1);
            }

            // const fsRead = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
            // const queryString = new URLSearchParams(JSON.stringify(vidData)).toString();
            //log to text file:
            // let fileUri = FileSystem.documentDirectory + "log2.txt";
            // await FileSystem.writeAsStringAsync(fileUri, fsRead, { encoding: FileSystem.EncodingType.UTF8 });
            // const asset = await MediaLibrary.createAssetAsync(fileUri);
            // await MediaLibrary.createAlbumAsync("Download", asset, false);
        }
    }
    const getScreen = () => {
        const d = Dimensions.get('screen')
        return d.width > d.height;
    }
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const { x, y, z } = accelerometerData;
    //         setLandscape(Math.abs(x) > Math.abs(y));
    //         // console.log(getScreen());
    //         // if (getScreen()) {
    //         //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    //         // } else {
    //         //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    //         // }
    //     }, 1000);

    //     return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    // }, [])

    const stopVideo = async () => {
        //console.log("==Prev==", prev)
        // await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        setClipOrder(prev => prev + 1);
        setRecordingText("Recorded");
        setShowStart(true);
        camera.stopRecording();
    }

    if (hasCameraPermission === null || hasAudioPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false || hasAudioPermission === false) {
        return <Text>No access to camera</Text>;
    }



    const onPinchGestureEvent = (nativeEvent: any) => {
        var scale = nativeEvent.nativeEvent.scale
        var velocity = nativeEvent.nativeEvent.velocity / 20

        let newZoom =
            velocity > 0
                ? zoom + scale * velocity * (Platform.OS === "ios" ? 0.01 : 25)
                : zoom -
                scale * Math.abs(velocity) * (Platform.OS === "ios" ? 0.02 : 50);

        if (newZoom < 0) newZoom = 0;
        else if (newZoom > 0.5) newZoom = 0.5;

        setZoom(newZoom)
    };


    return (
        isFocused &&

        <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <StatusBar hidden />
            <View style={styles.cameraContainer}>
                <PinchGestureHandler
                    onGestureEvent={onPinchGestureEvent}
                >
                    <Camera
                        ref={ref => setCamera(ref)}
                        style={styles.fixedRatio}
                        type={cameraType}
                        zoom={3 * zoom}

                    />
                </PinchGestureHandler>
            </View>
            <View>
                {showStart &&
                    <View style={styles.button}>
                        <Pressable onPress={() => takeVideo()}
                            // style={[styles.startButton, { backgroundColor: theme.colors.background }]}>
                            style={[styles.startButton, { backgroundColor: userTeamColor }]} >
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={styles.IoniconsContainer}>
                                    <Ionicons
                                        name="ellipse"
                                        size={15}
                                        color="white"
                                    />
                                </View>
                                <View>
                                    <Text style={styles.startVideoText}>Start</Text>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                }
            </View>
            <View>
                {
                    !showStart &&
                    <View style={styles.button}>
                        <Pressable onPress={() => stopVideo()}
                            style={[styles.stopButton, { backgroundColor: Colors.red500 }]} >
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={styles.IoniconsContainer}>
                                    <Ionicons
                                        name="stop"
                                        size={15}
                                        color="white"
                                    />
                                </View>
                                <View>
                                    <Text style={styles.stopVideoText}>Stop</Text>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                }
            </View>
            <View style={[styles.topHeaderConatiner, { backgroundColor: userTeamColor, opacity: getScreen() ? 0.4 : 1 }]}  >
                <MaterialIcons name="arrow-back" size={24} style={{ color: theme.colors.text, marginLeft: 10, paddingRight: 20 }} onPress={() => props.navigation.navigate("Dashboard")} />
                <Text style={{ color: "white", fontSize: 20, fontWeight: '600' }} >Record Film</Text>
            </View>
            <View style={[styles.headerConatiner, { backgroundColor: userTeamColor, opacity: getScreen() ? 0.4 : 1 }]}>
                <View style={[{ left: 10 }]}>
                    <Text style={{ color: "white", fontSize: 15 }} >{recordingText} {recordingCount} of {recordingCount}</Text>
                </View>

                <View style={styles.uploadedText}>
                    <Text style={{ color: "white", fontSize: 15 }} >{uploadingAttemtps === recordingCount ? "Uploaded" : "Uploading"} {uploadedCount} of {recordingCount}</Text>
                </View>
            </View>
            <View >
                <View style={[styles.titleText, { backgroundColor: userTeamColor, opacity: getScreen() ? 0.4 : 1 }]}>
                    <Text style={{ color: "white", fontSize: 15, textAlign: 'center', paddingTop: 2 }} >{props?.route?.params?.filmTitle}{props?.route?.params?.params?.title}</Text>
                </View>
            </View>

        </View >
    )
}






const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    fixedRatio: {
        flex: 1,
        // aspectRatio: 1
    },
    video: {
        alignSelf: 'center',
        width: 350,
        height: 220,
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        margin: 10
    },
    startButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        //width: 80,
        //height: 80,
        bottom: 50,
        borderRadius: 3,
        width: "100%",
        paddingVertical: 20,

    },
    stopButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        //width: 80,
        // height: 80,
        position: 'absolute',
        bottom: 50,
        borderRadius: 3,
        width: "100%",
        paddingVertical: 20,
    },
    titleText: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        height: 40,
        backgroundColor: "#4cae4c",

    },
    topHeaderConatiner: {
        display: 'flex',
        top: 0,
        height: 56,
        width: "100%",
        flexDirection: "row",
        position: 'absolute',
        alignItems: "center",
        borderColor: Colors.grey400,
        borderBottomWidth: 1,

    },
    headerConatiner: {
        flex: 1,
        top: 56,
        height: 40,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        position: 'absolute',
        // backgroundColor: userTeamColor,
        alignItems: "center",
    },
    uploadedText: {
        // top: Platform.OS == "android" ? 10 : 25,
        right: 10,
    },
    stopVideoText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        paddingRight: 10
    },
    startVideoText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        paddingRight: 10
    },
    IoniconsContainer: {
        marginRight: 6,
    }


});