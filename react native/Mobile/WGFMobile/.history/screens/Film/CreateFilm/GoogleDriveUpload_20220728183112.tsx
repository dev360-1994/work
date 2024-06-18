import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Card, RadioButton } from "react-native-paper";


export default function GoogleDriveUpload({ navigation }) {
    function uploadHandler() {

    }

    return (
        <View style={styles.container}>
            <Card style={{ width: "100%" }}>
                <Card.Title title="Transfer from Google Drive" />
                <Card.Content>
                    <View style={styles.radioButtonContainer}>
                        <Text style={{ paddingBottom: 20 }} >Provide the file share URL where your video is located</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <TextInput placeholder=" Url..." style={{ borderWidth: 1, width: 180, paddingRight: 5, paddingLeft: 5 }} />
                            <Button mode="contained" style={{ width: 20, }} color={"#4BB543"} onPress={() => { }}>
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