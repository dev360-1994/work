import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, Text, View, Button, Pressable, ToastAndroid, Modal, Platform, Alert, BackHandler } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { uploadVideo } from '../../services/VideoUploadService';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { preferencesContext } from '../PreferenceHelper';



export const VideoRecorderModal = (props) => {
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [camera, setCamera] = useState();
    const [record, setRecord] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
    const [isIOS, setIsIOS] = React.useState(false);
    const [showStart, setShowStart] = React.useState(true);
    const [recordingCount, setRecordingCount] = React.useState(0);
    const [uploadingCount, setUploadingCount] = React.useState(0);
    const isFocused = useIsFocused();
    const { userContext } = preferencesContext();
    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;


    useEffect(() => {
        // props.navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'Dashboard' }]
        // })
        // props.navigation.popToTop()
        const focusedRoute = props.state.routes[props.index].name
        console.log(focusedRoute);
    }, [props.navigation, props.index, props.state.routes]);
    useEffect(() => {
        () =>
            props.navigation.addListener('beforeRemove', (e) => {
                console.log("Prevent back");
                e.preventDefault();

                // Prompt the user before leaving the screen
                Alert.alert(
                    'Discard Upload?',
                    'You data is not uploaded. Are you sure to discard them and leave the screen?',
                    [
                        { text: "Don't leave", style: 'cancel', onPress: () => { } },
                        {
                            text: 'Discard',
                            style: 'destructive',
                            onPress: () => props.navigation.dispatch(e.data.action),
                        },
                    ]
                );
            })
    }, [props.navigation]);
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

            if (Platform.OS === "ios") {
                setIsIOS(true);
            }
        })();
    }, []);

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
        setShowStart(false);
        setRecordingCount(recordingCount + 1);
        if (camera) {
            const { uri, codec = "mp4" } = await camera.recordAsync({
                maxDuration: 300,
            });
            const extension = `.${codec}`;
            //for video id
            var a = uri.split("/");
            var videoId = a[a.length - 1].split(".")[0];
            // MediaLibrary.saveToLibraryAsync(uri).then(() => { saves video to gallary});
            const fsRead = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

            // const response = await uploadVideo(fsRead, videoId, extension, props.route.params.filmGuid, props.route.params.playListid);

            // // console.log(response);
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

    const stopVideo = async () => {
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
            <View style={[styles.headerConatiner, { backgroundColor: userTeamColor }]}>
                <View style={[{
                    // top: Platform.OS == "android" ? 10 : 25,
                    left: 10,
                }]}>
                    <Text style={{ color: "white", fontSize: 15 }} >Recording {recordingCount} of {recordingCount}</Text>
                </View>

                <View style={styles.uploadedText}>
                    <Text style={{ color: "white", fontSize: 15 }} >Uploaded {uploadingCount} of {recordingCount}</Text>
                </View>
            </View>
            <View style={[styles.titleText, { backgroundColor: userTeamColor }]}>
                <Text style={{ color: "white", fontSize: 15, textAlign: 'center', paddingTop: 2 }} >{props.route.params.filmTitle}</Text>
            </View>
        </View>
    )
}

{/* {
                isIOS &&
                <View
                    style={[styles.button, { position: 'absolute', right: 200, }]}
                >
                    <Button title='back' color="#cccccc" onPress={() => props.setModalVisible(false)} />
                </View>
            } */}
{/* <View >
                {showStart &&
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", }}>
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
                {
                    !showStart &&
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
                }

            </View > */}
{/* <View style={[styles.titleText, { backgroundColor: userTeamColor }]}>
                <Text style={{ color: "white", fontSize: 20, textAlign: 'center', paddingTop: 2 }} >{props.filmTitle}</Text>
            </View> */}

{/* <View style={[styles.headerConatiner, { backgroundColor: userTeamColor }]}>
                <View style={[{
                    top: Platform.OS == "android" ? 10 : 25,
                    left: 10,
                }]}>
                    <Text style={{ color: "white", fontSize: 15 }} >Recording {recordingCount} of {recordingCount}</Text>
                </View>

                <View style={styles.uploadedText}>
                    <Text style={{ color: "white", fontSize: 15 }} >Uploaded {uploadingCount} of {recordingCount}</Text>
                </View>
            </View> */}






const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
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