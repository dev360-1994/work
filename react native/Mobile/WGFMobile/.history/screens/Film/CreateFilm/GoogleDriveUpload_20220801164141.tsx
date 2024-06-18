import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Card, Divider, RadioButton } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import axios from "axios";

export default function GoogleDriveUpload({ navigation, route }) {

    const [url, setUrl] = useState("");
    const [screenName, setScreenName] = useState("");

    useEffect(() => {
        setScreenName(route.name);
    });

    function uploadHandler() {
    }

    const validateGoogleDriveLink = (url: string) => { return url.includes("folders"); }
    const validateGoogleSharedAccess = (url: string) => { return url.includes("usp=sharing"); }
    const getDriveFolderId = (url: string) => {
        let driveFolder = url.substring(url.indexOf('folders'), url.length);
        if (driveFolder.includes("usp=sharing"))
            driveFolder = driveFolder.replace("?usp=sharing", "");
        return driveFolder.split('/')[1].trim();
    }

    const GoogleDriveFiles = async (folderId: string) => {
        var result = [];
        try {
            var googleDriveApiKey = "AIzaSyDDEHkvrs1Wzn12U7xRjmGgbDqV9vr8NA4";
            var nextPageToken = "";
            do {
                var folderContentsUri = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${googleDriveApiKey}`;
                if (nextPageToken.length > 0) {
                    folderContentsUri += `&pageToken=${nextPageToken}`;
                }
                let apiData;
                await axios({
                    method: 'get',
                    url: folderContentsUri,
                }).then((response) => {
                    apiData = response.data?.files;
                });
                apiData?.forEach(function (value) {
                    result.push({
                        "id": value?.id,
                        "name": value?.name
                    });
                });
            } while (nextPageToken && nextPageToken.length > 0);

        } catch (ex) {
        }
        console.log(route.name);
        navigation.navigate("CreateFilmModal", {
            prevScreen: screenName,
            driveFiles: result
        })
    }


    const validateCloudUrl = () => {
        let cloudUrl = url;
        if (cloudUrl?.trim()) {
            if (cloudUrl.indexOf('drive.google.com') > -1) {
                const cloudURLType = "google";
                let isValidDriveLink = validateGoogleDriveLink(cloudUrl);
                if (isValidDriveLink) {
                    //To-do 
                    let isValidSharedLink = validateGoogleSharedAccess(cloudUrl);
                    if (!isValidSharedLink)
                        cloudUrl = cloudUrl + "?usp=sharing";
                    //Get list of all files located at provided address
                    let driveFolderId = getDriveFolderId(cloudUrl);
                    console.log(driveFolderId);
                    GoogleDriveFiles(driveFolderId);
                    // getJsonData(`/Film/CreateFilm/CreateFilm?handler=GoogleDriveFiles&folderId=${driveFolderId}`, (status, data) => {
                    //     if (status == "success" && data != null && data.length > 0) {
                    //         buildDriveFileList(data);
                    //         $("#submitCloudModal").dxButton("option", "disabled", false);
                    //     }
                    //     else {
                    //         buildDriveFileList(data);
                    //         showURLValidationMsg(false);
                    //     }
                    // });
                }
                // showURLValidationMsg(isValidDriveLink);
            }
            else {
                // showURLValidationMsg();
            }
        }
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