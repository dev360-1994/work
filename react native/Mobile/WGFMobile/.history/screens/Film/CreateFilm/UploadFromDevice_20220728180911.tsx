import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card, RadioButton } from "react-native-paper";


export default function UploadFromDevice({ navigation }) {
    return (
        <View style={styles.container}>
            <Card style={{ width: "80%" }}>
                <Card.Title title="Upload From Device" />
                <Card.Content>
                    <View style={styles.radioButtonContainer}>
                        <Button mode="contained" style={{ width: "100%", }} color={"#4BB543"} onPress={() => navigation.navigate("Dashboard")}>
                            <Text style={{ color: "#fff" }}>Browse File</Text>
                        </Button>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                        <Button mode="contained" style={{ width: 100, }} color={"grey"} onPress={() => navigation.navigate("Dashboard")}>
                            <Text style={{ color: "#fff" }}>Cancel</Text>
                        </Button>
                        <Button mode="contained" style={{ width: 100 }} color="#4BB543" onPress={() => radioButtonHandler()}>
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