
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, } from "react-native-paper"
import { getSession } from "../../services/common/Session";
import { RootDrawerScreenProps } from "../../types";


export default function TeamDetailsScreen({ navigation }: RootDrawerScreenProps<'TeamDetails'>) {
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        function fetchTeamDetails() {
            new Promise((resolve, reject) => {
                getSession().then((value) => {
                    console.log(value);
                });
            })
        }
        fetchTeamDetails();
    });


    const getTextColor = () => {
        return theme.colors.background === "rgb(1, 1, 1)" ? "white" : "black";
    }

    return <ScrollView>
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Team</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Level</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Owner</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Created</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Films</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Video Clips</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Docs</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Photos</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Roku Channel</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Sport</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Email</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Users</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Film Storage</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Video Storage</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Doc Storage</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Photo Storage</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
                    </TextInput>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={[{ color: getTextColor() }, styles.text]}>Roku Status</Text>
                    <TextInput
                        editable={false}
                        style={styles.inputText}>
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
    rowContainer: {
        flexDirection: "row",
        marginBottom: 20,
        justifyContent: "space-between"
    },
    text: {
        fontWeight: "bold",
        flex: 1,
        // textAlign: "center",
        textAlignVertical: "center",
    },
    inputText: {
        height: 48,
        borderColor: '#cccccc',
        borderRadius: 6,
        borderWidth: 1,
        paddingLeft: 8,
        backgroundColor: '#ffffff',
        width: "75%"
    },


});

