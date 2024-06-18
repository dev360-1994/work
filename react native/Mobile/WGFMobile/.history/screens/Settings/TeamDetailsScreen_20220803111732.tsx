
import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, } from "react-native-paper"
import { RootDrawerScreenProps } from "../../types";


export default function TeamDetailsScreen({ navigation }: RootDrawerScreenProps<'TeamDetails'>) {
    return <ScrollView style={styles.container}>
        <View style={styles.inputContainer}>
            <Text>Team</Text>
            <TextInput value={"Team"} />
        </View>

    </ScrollView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        padding: "10%"
    },
    inputContainer: {
        flex: 1,
        flexDirection: "row",
        width: "100%"
    }
});