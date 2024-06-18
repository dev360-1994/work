import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card, RadioButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

export default function UploadFromDevice({ navigation }) {


    function uploadHandler() {

    }

    const browseFile = async () => {
        const response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
            aspect: [4, 3],
        })


        // setDeviceVideoUri(response?.uri);
        // // console.log(response?.uri);
        // const data = new FormData();
        // data.append("videoFile", {
        //     name: response?.uri.split("/").pop(),
        //     type: "video/mp4",
        //     uri: response?.uri
        // });
        // data.append("filmGuid", filmGuild);
        // data.append("playlistId", playlistId);
        // data.append("clipOrder", `${0}`);
        // console.log(data);
        // const res = await uploadVideo(data);
        // if (response.status == 200) {
        //     console.log("uploaded 200");
        // }
    }

    return (
        <View style={styles.container}>
            <Card style={{ width: "80%" }}>
                <Card.Title title="Upload From Device" />
                <Card.Content>
                    <View style={styles.radioButtonContainer}>
                        <Button mode="contained" style={{ width: "100%", }} color={"#4BB543"} onPress={() => { }}>
                            <Text style={{ color: "#fff" }}>Browse File</Text>
                        </Button>
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