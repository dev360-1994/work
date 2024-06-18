import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, ToastAndroid } from "react-native";
import { Camera } from 'expo-camera';


const OpenCameraModal = (props: any) => {

    const [status, setStatus] = React.useState(true);
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const audioStatus = await Camera.requestMicrophonePermissionsAsync();
            setHasAudioPermission(audioStatus.status === 'granted');

            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

        })();
    }, []);


    const takeVideo = async () => {
        setStatus(false);
        if (camera) {
            const { uri, codec = "mp4" } = await camera.recordAsync({
                maxDuration: 60,
            });

            const extension = `.${codec}`;

            //for video id
            var a = uri.split("/");
            var videoId = a[a.length - 1].split(".")[0];


            // MediaLibrary.saveToLibraryAsync(uri).then(() => {
            //   //saves video to gallary
            // });

            console.log("Before base64");
            const fsRead = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

            // const imgBase64 = await pickImage(); //pick file from gallary

            const response = await uploadVideo(fsRead, videoId, extension);
            console.log(response);
            if (response == "200") {
                uploadSuccesfulToastr();
            } else {
                uploadFailedToastr();
            }

            // const queryString = new URLSearchParams(JSON.stringify(vidData)).toString();

            // let fileUri = FileSystem.documentDirectory + "log2.txt";
            // await FileSystem.writeAsStringAsync(fileUri, fsRead, { encoding: FileSystem.EncodingType.UTF8 });
            // const asset = await MediaLibrary.createAssetAsync(fileUri);
            // await MediaLibrary.createAlbumAsync("Download", asset, false);

        }


    }

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



    const stopVideo = async () => {
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
                visible={props.isVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1 }}>
                    <View style={styles.cameraContainer}>
                        <Camera
                            ref={ref => setCamera(ref)}
                            style={styles.fixedRatio}
                            cameraType={type}
                            ratio={'4:3'}
                        />
                    </View>



                    <View style={{ flexDirection: 'row' }}>
                        <Pressable onPress={() => takeVideo()}
                            style={{ height: 50, backgroundColor: '#000', width: '33.3%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Start Rec</Text>
                        </Pressable>
                        <Pressable onPress={() => stopVideo()}
                            style={{ height: 50, backgroundColor: 'red', width: '33.3%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Stop Rec</Text>
                        </Pressable>

                        {!status ?
                            <Pressable
                                style={{ height: 50, backgroundColor: 'pink', width: '33.3%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Live</Text>
                            </Pressable> : undefined
                        }

                    </View>

                </View>
            </Modal>

        </View>

    );
};


export default OpenCameraModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,

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
        elevation: 5,
        opacity: 20,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
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
    buttonCancel: {
        backgroundColor: "white",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 23
    }
});
