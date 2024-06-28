import React, { Component } from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity, Animated,
} from 'react-native';
import PropTypes from 'prop-types';

class ChoosePageMenu extends Component {
    render() {
        const { ClosePage, navpage, InjuryAndIllnessListNavigationfunction, nextPagedialog, actionNavigationfunction ,additionalDetailNavigationfunction ,impactDetailNavigationfunction ,newIncidentNavigationfunction ,peopleListNavigationfunction ,investigationDetailNavigationfunction} = this.props
        return (
            <Animated.View
                style={styles.animatedView}>
                <TouchableOpacity onPress={() => ClosePage()}
                    style={styles.outerView}>
                    <View style={[{ backgroundColor: "#fff", flexDirection: "column", borderColor: "#c9c9c9", borderWidth: 1, zIndex: 999 },
                    nextPagedialog ? { transform: [{ translateY: 0 }] } : { transform: [{ translateY: 160 }] }
                    ]}>
                        {
                            navpage !== 'NewIncidentScreen' &&
                            <TouchableOpacity style={styles.nextOverlayBtn} onPress={() => newIncidentNavigationfunction()}
                            >
                                <Text style={{ color: "#777" }}>Incident Details</Text>
                            </TouchableOpacity>
                        }
                        {navpage !== 'AdditionalDetailScreen' &&
                            <TouchableOpacity style={styles.nextOverlayBtn} onPress={() => additionalDetailNavigationfunction()}>
                                <Text style={styles.textColor}>Additional Details</Text>
                            </TouchableOpacity>
                        }
                        {
                            navpage !== 'PeopleListScreen' &&
                            <TouchableOpacity style={styles.nextOverlayBtn} onPress={() => peopleListNavigationfunction()}>
                                <Text style={styles.textColor}>People</Text>
                            </TouchableOpacity>
                        }
                        {
                            navpage !== 'InjuryAndIllnessListScreen' &&
                            <TouchableOpacity style={styles.nextOverlayBtn} onPress={() => InjuryAndIllnessListNavigationfunction()}>
                                <Text style={styles.textColor}>Injuries & Illnesses</Text>
                            </TouchableOpacity>
                        }
                        {
                            navpage !== 'ImpactDetailScreen' &&
                            <TouchableOpacity style={styles.nextOverlayBtn} onPress={() => impactDetailNavigationfunction()}
                            >
                                <Text style={styles.textColor}>Impact Details</Text>
                            </TouchableOpacity>
                        }
                        {
                            navpage !== 'InvestigationDetailScreen' &&
                            <TouchableOpacity style={styles.nextOverlayBtn} onPress={() => investigationDetailNavigationfunction()}
                            >
                                <Text style={styles.textColor}>Investigation</Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity style={styles.nextOverlayBtn} onPress={() => actionNavigationfunction()}>
                            <Text style={styles.textColor}>Actions</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Animated.View>

        )
    }
}

const styles = StyleSheet.create({
    animatedView: {
        position: "absolute", width: "100%", height: "100%", backgroundColor: '#ffffff6e', flexDirection: 'row',
        justifyContent: "flex-end", alignItems: "flex-end", bottom: 52,

    },
    outerView: {
        zIndex: 999, width: "100%", height: '100%', position: "absolute", width: "100%", height: "100%", backgroundColor: '#ffffff6e', flexDirection: 'row',
        justifyContent: "flex-end", alignItems: "flex-end"
    },
    textColor: { color: "#777" },
    nextOverlayBtn: {
        width: 150,
        flexDirection: "row",
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        width: 200,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        zIndex: 999
    },

})
export default ChoosePageMenu;