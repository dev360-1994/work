
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper"
import { RootDrawerScreenProps } from "../../types";


export default function TeamDetailsScreen({ navigation }: RootDrawerScreenProps<'TeamDetails'>) {
    return <View style={styles.container}>
        <View style={ }>
            <Text>Team</Text>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    inputContainer: {
        flex: 1,
        flexDirection: "row"
    }
});