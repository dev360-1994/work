import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Camera, CameraType, VideoQuality } from 'expo-camera';
import {
    StyleSheet, Text, View, Button, Pressable, ToastAndroid, Modal, Platform, Alert,
    BackHandler, useWindowDimensions, Dimensions, StatusBar
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { uploadVideo } from '../../services/VideoUploadService';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { preferencesContext } from '../PreferenceHelper';
import * as ImagePicker from 'expo-image-picker';
import { ProgressBar, Colors } from 'react-native-paper';
import { DeviceMotion, Accelerometer, DeviceSensor } from 'expo-sensors';
import * as ScreenOrientation from 'expo-screen-orientation';




export const VideoRecorderModal = (props) => {
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
    const [uploadingCount, setUploadingCount] = React.useState(0);
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
    const [recordingText, setRecordingText] = useState("Recorded");

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
                props.navigation.navigate("VideoRecord");
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
        let orientation = await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        // console.log(orientation);

        // let deviceMotion = await Accelerometer.isAvailableAsync();
        // console.log(deviceMotion);
        const { x, y, z } = accelerometerData;
        console.log(Math.abs(x) > Math.abs(y) ? "landscape" : "portrait");
        // console.log("height: " + height + ", width: " + width);

        setShowStart(false);
        setRecordingCount(recordingCount + 1);

        if (camera) {
            const { uri, codec = "mp4" } = await camera.recordAsync({
                maxDuration: 300,
                VideoPlaybackQuality: VideoQuality['480p'],
            });
            const extension = `.${codec}`;
            //for video id
            var a = uri.split("/");
            var videoId = a[a.length - 1].split(".")[0];
            // MediaLibrary.saveToLibraryAsync(uri).then(() => { console.log("saved video to gallary") });

            // let result = await ImagePicker.launchImageLibraryAsync({
            //     mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            //     // allowsEditing: true,
            //     // aspect: [4, 3],
            //     quality: 1,
            // });
            // console.log(result);
            // console.log("take vid fun");
            // console.log(props.route.params.filmGuid);
            // console.log(props.route.params.playListid);

            // const fsRead = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
            // // console.log(fsRead);
            // const response = await uploadVideo(fsRead, videoId, extension, props.route.params.filmGuid, props.route.params.playListid);

            // console.log(response);
            // if (response == "200") {
            //     setUploadingCount(uploadingCount + 1);
            //     console.log("upload successful");
            //     // uploadSuccesfulToastr();
            // } else {
            //     // uploadFailedToastr();
            //     console.log("upload failed");
            // }

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
    useEffect(() => {
        const interval = setInterval(() => {
            const { x, y, z } = accelerometerData;
            setLandscape(Math.abs(x) > Math.abs(y));
            console.log(getScreen());
            // if (getScreen()) {
            //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            // } else {
            //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
            // }
        }, 1000);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    const stopVideo = async () => {
        // await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
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


    return (
        isFocused &&

        <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <StatusBar hidden />
            <View style={styles.cameraContainer}>
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    cameraType={cameraType}
                    ratio={'4:3'}

                />
            </View>
            <View>
                {showStart &&
                    <View style={styles.button}>
                        <Pressable onPress={() => takeVideo()}
                            style={[styles.startButton,]}>
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
                            style={[styles.stopButton,]}>
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
            <View style={[styles.headerConatiner, { backgroundColor: userTeamColor, opacity: getScreen() ? 0.2 : 1 }]}>
                <View style={[{ left: 10 }]}>
                    <Text style={{ color: "white", fontSize: 15 }} >{recordingText} {recordingCount} of {recordingCount}</Text>
                </View>

                <View style={styles.uploadedText}>
                    <Text style={{ color: "white", fontSize: 15 }} >Uploaded {uploadingCount} of {recordingCount}</Text>
                </View>
            </View>
            <View style={{ transform: getScreen() ? [{ rotateY: "90deg" }] : [] }}>
                <View style={[styles.titleText,]}>
                    <Text style={{ color: "white", fontSize: 15, textAlign: 'center', paddingTop: 2 }} >{props.route.params.filmTitle}</Text>
                </View>
            </View>

        </View>
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
        justifyContent: "center"
    },
    startButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: 80,
        height: 80,
        bottom: 70,
        borderRadius: 3,
        backgroundColor: '#198754',

    },
    stopButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        height: 80,
        borderRadius: 3,
        position: 'absolute',
        bottom: 70,
        backgroundColor: 'red',
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
    headerConatiner: {
        flex: 1,
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