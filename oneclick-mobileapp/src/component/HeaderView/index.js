import React, { Component } from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Header, Left, Right, Body } from 'native-base';
class HeaderView extends Component {
    render() {
        const { PropFunction, Title, Pagename, StateChange, Sendfile, ShowMap, hideMapIcon } = this.props
        return (
            <Header style={styles.headerContainer}>
                <Left style={[styles.naviconContainer, { maxWidth: 60 }]}>
                    <TouchableOpacity
                        style={styles.backbtnIcon}
                        onPress={() => PropFunction()}
                    >
                        {Pagename == 'incident' && <Icon
                            name='chevron-left'
                            type='octicon'
                            color='#41a1f1'
                            size={34}
                        />}
                        {Pagename == 'Search' && <Icon name='menu' type='material' color='#41a1f1' size={24} />}
                    </TouchableOpacity>
                </Left>
                <Body style={styles.screenTitleContainer}>
                    <Text style={styles.screenTitle}>
                        {Title}
                    </Text>
                </Body>
                <Right style={[styles.naviconContainer, Pagename == 'Search' ? { maxWidth: 120 } : { maxWidth: 60, }, { alignItems: 'flex-end' }]}>
                    {Pagename == 'Search' &&
                        <View style={{ flexDirection: 'row' }}>
                            {hideMapIcon == false && <TouchableOpacity
                                style={[styles.filterButton, { marginRight: 10 }]}
                                onPress={() => ShowMap()}
                            >
                                <Icon
                                    name="pin-drop"
                                    color='#000'
                                    size={20}
                                />
                            </TouchableOpacity>}
                            <TouchableOpacity
                                style={[styles.filterButton, { marginRight: 10 }]}
                                onPress={() => Sendfile()}
                            >
                                <Image style={{ width: 20, height: 20 }} source={require('../../../assets/ExcelIcon.png')} ></Image>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.filterButton}
                                onPress={() => StateChange()}
                            >
                                <Icon
                                    name='filter'
                                    type='font-awesome'
                                    color='#000'
                                    size={20}
                                />
                            </TouchableOpacity>

                        </View>

                    }
                </Right>
            </Header>
        )
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        zIndex: 90,
        backgroundColor: '#ffffff',
        width: '100%',
        marginTop: 0,
        borderWidth: 0,
        borderColor: 'transparent'
    },
    naviconContainer: {
        maxWidth: 45,
        height: 40,
        lineHeight: 40,
        textAlign: 'center',
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    backbtnIcon: {
        width: 30
    },
    screenTitle: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        fontWeight: '400',
    },
    screenTitleContainer: {
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    filterButton: {
        paddingHorizontal: 6,
        paddingVertical: 10,
    },
})
export default HeaderView;