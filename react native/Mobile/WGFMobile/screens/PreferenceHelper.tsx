import React from 'react';
import { PreferencesContext } from '../PreferencesContext';

export const preferencesContext = () => {
    return React.useContext(PreferencesContext);
}