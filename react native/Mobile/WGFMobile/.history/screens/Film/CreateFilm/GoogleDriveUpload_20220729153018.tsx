import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Card, Divider, RadioButton } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function GoogleDriveUpload({ navigation }) {

    const [url, setUrl] = useState("");



    function uploadHandler() {
        // FileSystem.downloadAsync(
        //     'http://techslides.com/demos/sample-videos/small.mp4',
        //     FileSystem.documentDirectory + 'small.mp4'
        // )
        //     .then(async ({ uri }) => {
        //         console.log('Finished downloading to ', uri);
        //         await MediaLibrary.saveToLibraryAsync(uri).then(() => { console.log("saved video to gallary") });
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });
    }

    const validateCloudUrl = () => {
        console.log(url);
        //e
        // cloudUrl = $("#Cloud_URL").val();
        // if (cloudUrl?.trim()) {
        //     if (cloudUrl.indexOf('drive.google.com') > -1) {
        //         cloudURLType = "google";
        //         let isValidDriveLink = validateGoogleDriveLink(cloudUrl);
        //         if (isValidDriveLink) {
        //             //To-do 
        //             let isValidSharedLink = validateGoogleSharedAccess(cloudUrl);
        //             if (!isValidSharedLink)
        //                 cloudUrl = cloudUrl + "?usp=sharing";
        //             //Get list of all files located at provided address
        //             let driveFolderId = getDriveFolderId(cloudUrl);
        //             getJsonData(`/Film/CreateFilm/CreateFilm?handler=GoogleDriveFiles&folderId=${driveFolderId}`, (status, data) => {
        //                 if (status == "success" && data != null && data.length > 0) {
        //                     buildDriveFileList(data);
        //                     $("#submitCloudModal").dxButton("option", "disabled", false);
        //                 }
        //                 else {
        //                     buildDriveFileList(data);
        //                     showURLValidationMsg(false);
        //                 }
        //             });
        //         }
        //         showURLValidationMsg(isValidDriveLink);
        //     }
        //     else {
        //         showURLValidationMsg();
        //     }
        // }
        // else {
        //     $("#submitCloudModal").dxButton("option", "disabled", true);
        //     $('#txtCloudUrl').removeClass('dx-invalid');
        //     //$("#cloudUrlValidCheck").dxButton("option", "visible", false);
        //     $("#showCloudUrlError").hide();
        // }
    }


    return (
        <View style={styles.container}>
            <Card style={{ width: "100%" }}>
                <Card.Title title="Transfer from Google Drive" />
                <Card.Content>
                    <View style={styles.radioButtonContainer}>
                        <Text style={{ paddingBottom: 20 }} >Provide the file share URL where your video is located</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <TextInput placeholder="Url..." style={{ borderWidth: 1, width: 180, paddingRight: 5, paddingLeft: 5 }}
                                onChangeText={setUrl}
                            />
                            <Button mode="contained" style={{ width: 20, }} color={"#4BB543"} onPress={() => { validateCloudUrl(); }}>
                                <Text style={{ color: "#fff" }}><Feather name="check" size={22} color={"#fff"} /></Text>
                            </Button>
                        </View>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                        <Button mode="contained" style={{ width: 100, }} color={"grey"} onPress={() => navigation.goBack()} >
                            <Text style={{ color: "#fff" }}>Cancel</Text>
                        </Button>
                        <Button mode="contained" style={{ width: 100 }} color="#337ab7" onPress={() => uploadHandler()}>
                            <Text style={{ color: "#fff" }}>Next</Text>
                        </Button>
                    </View>

                </Card.Actions>
            </Card>

        </View>


    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        margin: 50,
        marginBottom: "90%"
    },
    header: {
        marginBottom: 30
    },
    radioButtonContainer: {
        paddingTop: 20,
        paddingBottom: 100,
    },
    radioButtonInput: {


    }
});