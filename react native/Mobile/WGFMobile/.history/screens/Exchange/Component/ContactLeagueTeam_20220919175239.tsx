import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Colors, Text, useTheme } from "react-native-paper";



export default function ContactLeagueTeam({ navigation }) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const theme = useTheme();

    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerShown: false,
        });
    });




    function goBack() {
        navigation.getParent()?.setOptions({
            headerShown: true,
        });
        navigation.navigate("ExchangeFilmTab");
    }






    return (
        <SafeAreaView style={styles.container}>
            <View style={[{
                // marginTop: 100,
            },
            {
                backgroundColor: theme.colors.background, width: '100%', padding: 20, marginTop: Platform.OS === "ios" ? 0 : 0, zIndex: 1,
                paddingTop: Platform.OS === "ios" ? 50 : 20,
                flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#cacaca',
            }
            ]}>
                <MaterialIcons name="arrow-back" size={24} style={{ color: theme.colors.text }} onPress={() => goBack()} />


                <Text style={{
                    fontSize: 20,
                    color: theme.colors.placeholder,
                    paddingLeft: 6,
                }}
                >Contact League Team</Text>
            </View>
            {(isSubmitting) ? (
                <></>
            ) : (
                <View>
                    <Text style={{ padding: 20 }}>Select a team from the list below to contact their coaching staff</Text>

                    <Text style={{ paddingHorizontal: 40, }}>Send To</Text>


                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 0, margin: 0
    },

});
