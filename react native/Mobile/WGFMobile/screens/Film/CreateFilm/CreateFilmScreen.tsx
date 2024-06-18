
import React, { useState } from "react";
import { View, StyleSheet, Pressable, TouchableOpacity, FlatList, Dimensions, Platform } from "react-native";
import { RootDrawerScreenProps } from "../../../types";
import { Colors, Subheading, Text, Title, useTheme } from 'react-native-paper';
//import { theme } from "native-base";




export default function CreateFilmScreen({ navigation }: RootDrawerScreenProps<'AddFilm'>) {
    const theme = useTheme();

    const onPressSelectSourceHandler = (item: any) => {
        if (item.key === "device") {
            navigation.navigate("UploadFromDevice");
        } else if (item.key === "google") {
            navigation.navigate("GoogleDriveUpload");
        } else if (item.key === "hudl") {
            navigation.navigate("TranferFromHudl");
        }
    }

    return (
        <View style={[styles.container,]}>
            <React.Fragment>
                <View style={{ marginHorizontal: 20, marginVertical: 12 }}>
                    <Title style={styles.title}>Select Source</Title>
                </View>
                <FlatList
                    data={[
                        { key: "device", name: 'Upload from Device', },
                        { key: "google", name: 'Transfer from Google Drive' },
                        { key: "hudl", name: 'Transfer from Hudi' },
                    ]}
                    renderItem={({ item }) => (
                        <View style={[styles.wrapper, theme.dark ? styles.borderForDarkTheme : styles.borderForLightTheme, { backgroundColor: theme.colors.surface }]}>
                            <TouchableOpacity
                                style={{ flex: 1, flexDirection: 'column', margin: 16, zIndex: 0 }}
                                onPress={() => onPressSelectSourceHandler(item)}
                            >
                                {
                                    <Text style={{ color: theme.colors.text, fontSize: 18 }}>{item.name}</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    )}
                />

            </React.Fragment>
        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    wrapper: {
        //padding: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 0,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    borderForDarkTheme:
    {
        borderColor: Colors.grey900
    },
    borderForLightTheme:
    {
        borderColor: Colors.grey300
    },
    checkbox:
    {
        justifyContent: 'center',
        textAlign: 'center',
        paddingHorizontal: 0,
        paddingRight: 10,
    },
    MaterialCheckbox:
    {
        fontSize: 30
    },

    emptyContainer: {
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex: 1,
        marginTop: Dimensions.get('window').height / 4,
    },

    title: {
        fontSize: 20,
        fontWeight: 'normal',
    },

});









