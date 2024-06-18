import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, Text, View, Button, Pressable, ToastAndroid, Modal, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { uploadVideo } from '../../services/VideoUploadService';
import { Ionicons } from '@expo/vector-icons';


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
                maxDuration: 60,
            });
            const extension = `.${codec}`;
            //for video id
            var a = uri.split("/");
            var videoId = a[a.length - 1].split(".")[0];
            // MediaLibrary.saveToLibraryAsync(uri).then(() => { saves video to gallary});
            const fsRead = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

            // const response = await uploadVideo(fsRead, videoId, extension, props.filmGuid, props.playListid);

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
        <View style={styles.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => {
                    props.setModalVisible(!props.modalVisible);
                }}
            >
                <View style={{ flex: 1, }}>
                    <View style={styles.cameraContainer}>
                        <Camera
                            ref={ref => setCamera(ref)}
                            style={styles.fixedRatio}
                            cameraType={cameraType}
                            ratio={'4:3'}
                        />
                    </View>
                    {
                        isIOS &&
                        <View
                            style={[styles.button, { position: 'absolute', right: 200, }]}
                        >
                            <Button title='back' color="#cccccc" onPress={() => props.setModalVisible(false)} />
                        </View>
                    }
                    <View style={{ flexDirection: 'row' }}>
                        {showStart &&
                            <Pressable onPress={() => takeVideo()}
                                style={styles.startButton}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={styles.IoniconsContainer}>
                                        <Ionicons
                                            name="ellipse"
                                            size={20}
                                            color="white"
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.startVideoText}>Start</Text>
                                    </View>
                                </View>
                            </Pressable>
                        }
                        {
                            !showStart &&
                            <Pressable onPress={() => stopVideo()}
                                style={styles.stopButton}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={styles.IoniconsContainer}>
                                        <Ionicons
                                            name="stop"
                                            size={20}
                                            color="white"
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.stopVideoText}>Stop</Text>
                                    </View>
                                </View>
                            </Pressable>
                        }

                    </View>
                    <View style={styles.titleText}>
                        <Text style={{ color: "white", fontSize: 15, textAlign: 'center' }} >{props.filmTitle}</Text>
                    </View>

                    <View
                        style={{ backgroundColor: "white" }}
                    >
                        <View style={styles.recordingText}>
                            <Text style={{ color: "white", fontSize: 15 }} >Recording {recordingCount} of {recordingCount}</Text>
                        </View>

                        <View style={styles.uploadedText}>
                            <Text style={{ color: "white", fontSize: 15 }} >Uploaded {uploadingCount} of {recordingCount}</Text>
                        </View>
                    </View>


                </View>
            </Modal>
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
        aspectRatio: 1
    },
    video: {
        alignSelf: 'center',
        width: 350,
        height: 220,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
    },
    button: {
        marginTop: 50,
        marginBottom: "100%",
        width: 160,
        marginLeft: 120,
    },
    startButton: {
        backgroundColor: '#5cb85c',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 45,
        borderRadius: 5,
        position: 'absolute',
        bottom: 70,
        right: Platform.OS == "android" ? 140 : 170,
    },
    stopButton: {
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 45,
        borderRadius: 5,
        position: 'absolute',
        bottom: 70,
        right: Platform.OS == "android" ? 140 : 70,
    },
    titleText: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        height: 40,
        backgroundColor: "#a2faa2",

    },
    recordingText: {
        position: 'absolute',
        top: Platform.OS == "android" ? 10 : 25,
        left: 10,
    },
    uploadedText: {
        position: 'absolute',
        top: Platform.OS == "android" ? 10 : 25,
        right: 10,
    },
    stopVideoText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },
    startVideoText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },
    IoniconsContainer: {
        marginRight: 12,
        marginTop: 2,
    }


});