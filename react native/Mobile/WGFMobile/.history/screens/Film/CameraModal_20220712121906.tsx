import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, Text, View, Button, Pressable, ToastAndroid, Modal, Platform, ActionSheetIOS } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useIsFocused } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { uploadVideo } from '../../services/VideoUploadService';

export const VideoRecorderModal = (props) => {
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [camera, setCamera] = useState();
    const [record, setRecord] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState(true);
    const isFocused = useIsFocused();
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
        setStatus(false);
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

            const response = await uploadVideo(fsRead, videoId, extension);

            // console.log(response);
            if (response == "200") {
                setUploadingCount(uploadingCount + 1);
                uploadSuccesfulToastr();
            } else {
                uploadFailedToastr();
            }

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
        setStatus(true);
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
                animationType="slide"
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
                            <Button title='back' color="#cccccc" onPress={() => setModalVisible(false)} />
                        </View>
                    }
                    <View style={{ flexDirection: 'row' }}>
                        {showStart &&
                            <Pressable onPress={() => takeVideo()}
                                style={{
                                    // height: 50,
                                    backgroundColor: '#00FF00',
                                    // width: '33.3%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 80,
                                    height: 80,
                                    borderRadius: 50,
                                    // backgroundColor: '#ee6e73',
                                    position: 'absolute',
                                    bottom: 50,
                                    right: Platform.OS == "android" ? 205 : 170,
                                }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Start</Text>
                            </Pressable>
                        }
                        <Pressable onPress={() => stopVideo()}
                            style={{
                                // height: 50,
                                backgroundColor: 'red',
                                // width: '33.3%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 80,
                                height: 80,
                                // borderRadius: 50,
                                // backgroundColor: '#ee6e73',
                                position: 'absolute',
                                bottom: 50,
                                right: Platform.OS == "android" ? 95 : 70,
                            }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Stop</Text>
                        </Pressable>

                        {/* {!status ?
                  <Pressable
                    style={{ height: 50, backgroundColor: 'pink', width: '33.3%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Live</Text>
                  </Pressable> : undefined
                } */}

                    </View>
                    <View
                        style={{
                            // alignItems: 'center',
                            // justifyContent: 'center',
                            position: 'absolute',
                            bottom: 20,
                            right: 0,
                            left: 0,
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 15, textAlign: 'center' }} >Title: {props.filmTitle}</Text>
                    </View>

                    <View
                        style={{
                            position: 'absolute',
                            top: Platform.OS == "android" ? 10 : 25,
                            left: 10,
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 15 }} >Recording {recordingCount} of {recordingCount}</Text>
                    </View>

                    <View
                        style={{
                            position: 'absolute',
                            top: Platform.OS == "android" ? 10 : 25,
                            right: 10,
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 15 }} >Uploaded {uploadingCount} of {recordingCount}</Text>
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
});