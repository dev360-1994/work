import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Colors, useTheme, withTheme } from 'react-native-paper';


const ProcessingIndicator = ({ isLoading, indicatorColor }: { isLoading: boolean, indicatorColor: string }) => (

    (isLoading) ?
        <View style={[styles.activityContainer]} >
            <ActivityIndicator animating={isLoading} size={50} color={(indicatorColor) ? indicatorColor : Colors.grey900} />
        </View> : <></>

);

export default ProcessingIndicator;


const styles = StyleSheet.create({
    activityContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
    },

});

