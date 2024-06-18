import React, { useState } from "react";
import { useTheme, Colors, TextInput } from "react-native-paper";
import { DatePickerModal } from 'react-native-paper-dates';
import { format } from 'date-fns';
import { preferencesContext } from "../screens/PreferenceHelper";

import {
    en,
    registerTranslation,
} from 'react-native-paper-dates'
registerTranslation('en', en)


export default function CustomDateTimePicker({ label, onChange, value }: { label: string, value: Date | undefined, onChange: (args: string) => void, }) {
    const theme = useTheme();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
    const [open, setOpen] = React.useState(false);
    function getTeamColor() {
        const { userContext } = preferencesContext();
        return userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
    }

    const onDismissSingle = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirmSingle = React.useCallback(
        (params: any) => {
            setOpen(false);
            setSelectedDate(params.date);
            let value = format(params.date ? new Date(params.date) : new Date(), 'MM/dd/yyyy');
            onChange(value);
        },
        [setOpen, setSelectedDate]
    );

    return (
        <>
            <TextInput
                blurOnSubmit={false}
                mode="flat"
                label={label}
                placeholder="MM/DD/YYYY"
                disabled={false}
                value={format(selectedDate ? new Date(selectedDate) : new Date(), 'MM/dd/yyyy')}
                placeholderTextColor={theme.colors.placeholder}
                right={<TextInput.Icon icon="calendar" onPress={() => setOpen(true)} />}
                keyboardType='number-pad'
                activeUnderlineColor={getTeamColor()}
            />

            <DatePickerModal
                locale="en"
                mode="single"
                visible={open}
                onDismiss={onDismissSingle}
                date={selectedDate}
                onConfirm={onConfirmSingle}
            />
        </>
    );
}






