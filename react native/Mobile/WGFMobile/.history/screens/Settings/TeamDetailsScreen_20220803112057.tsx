
import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, } from "react-native-paper"
import { RootDrawerScreenProps } from "../../types";


export default function TeamDetailsScreen({ navigation }: RootDrawerScreenProps<'TeamDetails'>) {
    return <ScrollView style={styles.container}>
        <View style={styles.rowContainer}>
            <Text>Team</Text>
            <TextInput style={styles.textInput} value={"Team"} />
        </View>

    </ScrollView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        padding: "10%"
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    textInput: {
        width: "80%",
        borderWidth: 1
    }
});