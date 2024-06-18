import React, { useState } from "react";
import { View } from "react-native";
import { Snackbar, useTheme, Colors } from "react-native-paper";
import { color } from "react-native-reanimated";
import { MessageModel } from "../services/Model/MessageModel";




export default function Toastbar({ message, onClose }: { message: MessageModel, onClose: () => void }) {
    const theme = useTheme();

    return (
        <Snackbar
            visible={message && message.text ? true : false}
            duration={Snackbar.DURATION_MEDIUM}
            onDismiss={onClose}
            theme={{ colors: { accent: theme.dark ? Colors.grey900 : Colors.grey300 }, }}
            action={{
                label: "Close",
                onPress: () => {
                    onClose;
                },
            }}
        >
            {message && message.text ? message.text : ""}
        </Snackbar >
    );
}






