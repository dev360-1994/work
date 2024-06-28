import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants'
import PDFReader from 'rn-pdf-reader-js'
import { Icon } from 'react-native-elements';
import { LoginService, CommonService } from '../../../Services'
import Spinner from 'react-native-loading-spinner-overlay';
import accountConstant from '../../../constants/account';
import styles from './Style';

import PDFView from 'react-native-view-pdf';
export default class TermsConditionScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinner: false,
            pdfLink: ''
        }
    }



    componentDidMount = async () => {
        this.showHideSpinner(true)
        try {
            await LoginService.termsCondition('terms').then((response) => {
                const data = response["data"];
                if (data && data["Success"] == true && response.status == accountConstant.httpStatus.Ok)
                    this.setState({ pdfLink: data["Message"] })
                else
                    CommonService.handleError(response);
            })
        } catch (error) {
            CommonService.showErrorNotification(error["message"]);
            return;
        }
        finally {
            this.showHideSpinner(false);
        }
    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        });
    }


    render() {
        const resources = {
            url: this.state.pdfLink
          };
          const resourceType = 'url';
        return (
            <View style={styles.container}>
                <View style={styles.spinnercontainer}>
                    <Spinner visible={this.state.spinner} textStyle={styles.spinnerTextStyle} />
                </View>
                <View style={styles.backButtonview}>
                    <TouchableOpacity style={styles.backsign} onPress={() => this.props.navigation.navigate('SignUpDetails')}>
                        <Icon name='arrow-back' type='material' color='#ffffff' size={32} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textview}>
                        <Text style={styles.termText}>{"Terms & Conditions"}</Text>
                    </TouchableOpacity>
                </View>
                {this.state.pdfLink !== '' &&
                    <PDFView
                        fadeInDuration={250.0}
                        style={{ flex: 1 }}
                        resource={resources[resourceType]}
                        resourceType={resourceType}
                        onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
                        onError={() => console.log('Cannot render PDF', error)}
                    />
                }
            </View >
        );
    }
}

