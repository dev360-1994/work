import React, { Component } from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity, ImageBackground,
} from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import {Footer} from 'native-base';
class FooterView extends Component {
    render() {
        const {PropFunction ,ChoosePage ,showType,IncidentLocked,Close ,pageName ,permission ,cancelbtn} = this.props
        var showPermission = permission == true ? true:false 
        return (
            <View style={{ position: "relative" }}>
            <Footer
            style={{
                backgroundColor: '#ffffff',
                borderTopColor: "#c9c9c9",
                borderTopWidth: 1,
                width: '100%',
                marginTop: 0,
            }}>
            <View style={styles.actionFooterBar}>
                { !showPermission ? <View>
                {IncidentLocked == false || IncidentLocked == undefined ? 
                <TouchableOpacity style={styles.footerBtn}
                    onPress={() => PropFunction()}>
                    {pageName == 'saveAndClose' ? 
                    <Text style={{ color: '#41a1f1' }}> Save</Text>
                    : pageName == 'AddPeopleScreen' ?
                     <Text style={{ color: '#41a1f1' }}>Done</Text> : 
                     <Text style={{ color: '#41a1f1' }}>Save And Back </Text>
                     }
                </TouchableOpacity>
                :
             <TouchableOpacity style={styles.footerBtn}
                    onPress={() => Close()}>
                    <Text style={{ color: '#41a1f1' }}>Close</Text>
                </TouchableOpacity>
                }
                </View>
                : <View style={styles.footerBtn}></View>}
                        {
                            showType != 'Action' &&
                            <TouchableOpacity style={styles.footerBtn}
                                onPress={() => ChoosePage()
                                }>
                                {cancelbtn == 'Cancel' ? <Text style={{ color: '#41a1f1', marginRight: 3 }}>Cancel</Text> :
                                    <Text style={{ color: '#41a1f1', marginRight: 3 }}>Choose Page</Text>
                                }
                                {cancelbtn !== 'Cancel' && <Icon
                                    name='chevron-right'
                                    type='octicon'
                                    color='#41a1f1'
                                    size={18}
                                    iconStyle={{ marginLeft: 4 }}
                                />}
                            </TouchableOpacity>
                        }
            </View>
        </Footer>
        </View>
           
        )
    }
}

const styles = StyleSheet.create({
    actionFooterBar: {
        width: "100%",
        paddingHorizontal: 15,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
    },
    footerBtn: { flexDirection: "row", alignItems: "center", height: 20 },
     
})
export default FooterView;