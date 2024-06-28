import { StyleSheet, Dimensions} from 'react-native';
import Constants from 'expo-constants'
export default StyleSheet.create({
    line: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    listHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
    },
    addActionWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 1,
        paddingVertical: 6,
        marginBottom: 3,
    },
    descriptionBtn: { width: '10%', textAlign: 'right' },
});