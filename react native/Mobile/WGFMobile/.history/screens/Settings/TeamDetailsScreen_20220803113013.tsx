
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, TextInput, SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, } from "react-native-paper"
import { RootDrawerScreenProps } from "../../types";


export default function TeamDetailsScreen({ navigation }: RootDrawerScreenProps<'TeamDetails'>) {
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const getTextColor = () => {
        return theme.colors.background === "rgb(1, 1, 1)" ? "white" : "black";
    }

    return <ScrollView>
        <SafeAreaView>
            <View style={styles.container}>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontWeight: "bold", color: getTextColor() }}>First Name</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>

                <View style={{ paddingBottom: 20 }}>
                    <Text style={{ fontWeight: "bold", color: getTextColor() }}>Last Name</Text>
                    <TextInput

                        style={styles.inputText}
                    >
                    </TextInput>
                </View>

            </View>
        </SafeAreaView>

    </ScrollView>
}

const styles = StyleSheet.create({

    container: {
        flexDirection: "column",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingTop: "10%"
    },
    inputText: {
        height: 48,
        // borderColor: '#cccccc',
        borderRadius: 6,
        borderWidth: 1,
        paddingLeft: 8,
        backgroundColor: '#ffffff',
    },
    paragraph: {
        marginBottom: 20,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "left",
        color: '#34495e',
    },

    text: {
        fontSize: 14,
        lineHeight: 40,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    buttonContainer: {
        flex: 1,
        marginTop: 10,
        marginBottom: 50,
    },
    dropdownContainer: {
        flexDirection: "column",
        justifyContent: "space-between"
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    processingIndicator: {
        flex: 1,
        justifyContent: 'center',
        marginTop: '80%',
        marginBottom: "10%"
    }

});

