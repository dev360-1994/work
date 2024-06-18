import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Card, RadioButton } from "react-native-paper";


export default function TransferFromHudl({ navigation }) {
    function uploadHandler() {

    }

    return (
        <View style={styles.container}>
            <Card style={{ width: "100%" }}>
                <Card.Title title="Transfer from Hudl" />
                <Card.Content>
                    <View style={styles.radioButtonContainer}>
                        <Text style={{ paddingBottom: 20 }} >Please provide the download link you received in email from Hudl</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Hudl URL: </Text>
                            <TextInput style={{ borderWidth: 1, width: 180, paddingRight: 10 }} />
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