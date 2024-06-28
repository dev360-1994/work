import React, { Component } from 'react'
import {StyleSheet,Platform} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker'
class DatePicker extends Component {
    render() {
        const {Visible,handleDatePicker,cancelDatePicker ,maximumDate,minimumDate,mode } = this.props
        return (  
            <DateTimePicker
                mode={mode}
                is24Hour={false}
                locale='en_IN'
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                isVisible={Visible}
                onConfirm={(date) => handleDatePicker(date)}
                onCancel={() => cancelDatePicker()}
                style={{ width: '100%' },Platform.OS === 'android' && { height: 40}}
                customStyles={{
                    placeholderText: {
                        color: '#424242',
                        textAlign: 'left',
                        paddingHorizontal: 15
                    },
                    dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                    },
                    dateInput: {
                        marginLeft: 0,
                        borderColor: '#c9c9c9',
                        width: '100%',
                        backgroundColor: '#e8e8e8',
                        alignItems: 'flex-start',
                        height: 40
                    },
                    dateText: {
                        color: '#424242',
                        justifyContent: 'flex-start'
                    }
                }}
        />
        )
    }
}
const styles = StyleSheet.create({
})
export default DatePicker;