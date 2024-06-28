import React, { Component } from 'react';
import {
    Alert, Image, StyleSheet, Text, View, Button, ImageBackground, TouchableOpacity, Linking, TextInput, FlatList, TouchableHighlight, TouchableWithoutFeedback, Animated,
    PanResponder, Dimensions, Keyboard
} from 'react-native';
import Constants from 'expo-constants'
import { captureRef  } from "react-native-view-shot";
import Signature from 'react-native-signature-panel';
import { Header, Footer } from 'native-base'
import { Icon } from 'react-native-elements';
import Dialog, { DialogContent, DialogTitle } from 'react-native-popup-dialog'
import PropTypes from 'prop-types';
const HEIGHT = (Dimensions.get('window').height / 100) * 6
class ImageWatermark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageURI: this.props.uri,
            edit: false,
            focus: false,
            colors: [
                { name: 'White', value: '#FFFFFF' }, { name: 'Black', value: '#000000' },
                { name: 'Red', value: '#FF0000' }, { name: 'Green', value: '#00FF00' },
                { name: 'Blue', value: '#0000FF' }, { name: 'Navy Blue', value: '#000080' }],
            color: '#FF0000',
            showColor: false,
            draw: false, text: '',
            lastPress: 0
        };
        this.textInput = React.createRef();
    }
    componentDidMount() {
        this._animatedValue = new Animated.ValueXY()
        this._value = { x: 0, y: 0 }
        this._animatedValue.addListener((value) => this._value = value);
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: (e, gestureState) => {
                this._animatedValue.setOffset({ x: this._value.x, y: this._value.y });
                this._animatedValue.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([
                null, { dx: this._animatedValue.x, dy: this._animatedValue.y }]),
            onPanResponderRelease: (e, gesture) => {
                // this._animatedValue.flattenOffset();
                if (gesture.moveY < HEIGHT + 60) {
                    Animated.spring(
                        this._animatedValue,
                        { toValue: { x: 0, y: 0 } }
                    ).start();
                } else if (gesture.moveY > Dimensions.get('window').height - HEIGHT - 60) {
                    Animated.spring(
                        this._animatedValue,
                        { toValue: { x: 0, y: 0 } }
                    ).start();
                }
            }
        });
    }
    edit = async () => {
        const { edit } = this.state;
        if (!edit) {
            this.snapShot()
        }
        this.setState({ edit: true, draw: false, focus: true })
        this.textInput.current.focus();
    }
    drawSketch = () => {
        this.setState({ focus: false })
        const { draw, text, focus } = this.state;
        setTimeout(() => {
            if (!draw && (text && text.length > 0)) {
                this.snapShot()
            }
            this.setState({ draw: true, edit: false, })
        }, 10)
    }
    snapShot = async (btnType) => {
        let imageURI = await captureRef(this.pageView,
             { format: 'jpg', result: 'file' });
        this.setState({ imageURI })
        if (btnType === 'save') {
            this.props.onClick(imageURI)
        }
    };
    save = (btnType) => {
        this.setState({ focus: false })
        setTimeout(async () => {
            let imageURI = await captureRef(this.pageView,
                 { format: 'jpg', result: 'file' });
            this.setState({ imageURI })
            this.props.onClick(imageURI)
        }, 10)
    };
    changeColor(colorIndex) {
        const { colors } = this.state;
        const changeCol = colors.filter((data, index) => { return colorIndex == index });
        this.setState({
            color: changeCol[0].value,
            showColor: false
        })
    }
    handleDoubleTap = () => {
        var delta = new Date().getTime() - this.state.lastPress;
        if (delta < 200) {
            this.setState({ edit: true, draw: false, focus: true })
            this.textInput.current.focus();
        }
        this.setState({
            lastPress: new Date().getTime()
        })
    }
    render() {
        const { imageURI, edit, draw, text, focus, newImage, color, showColor, colors } = this.state;
        const { uri, onClose } = this.props;
        return (
            <View style={styles.container}>

                
                <View>
                    <Header
                        style={styles.header}>
                        <View style={styles.actionBar}>
                            <View style={styles.BarLeft}>
                                <TouchableOpacity style={styles.actionBtnLeft} onPress={() => onClose()}>
                                    <Icon
                                        name='keyboard-arrow-left'
                                        type='material-icons'
                                        color='#fff'
                                        size={36}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.BarRight}>
                                <TouchableOpacity style={styles.actionBtnRight} onPress={() => this.save('save')}>
                                    <Icon
                                        name='check'
                                        type='material-icons'
                                        color='#fff'
                                        size={32}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Header>
                </View>
                <View style={{ width: '100%', height: '82%' }}>
                    <TouchableWithoutFeedback 
                   onPress={()=> {Keyboard.dismiss();}}
                    >
                        <ImageBackground
                            ref={view => { this.pageView = view; }}
                            source={{ uri: imageURI }}
                            style={{ width: '100%', height: '100%', resizeMode: 'contain' }} >
                            {edit &&
                                <Animated.View
                                    // onTouchStart={(e) => {console.log('touchMove',e.nativeEvent)}}
                                    style={[
                                        styles.Animatedcontainer,
                                        {
                                            transform: [
                                                { translateX: this._animatedValue.x },
                                                { translateY: this._animatedValue.y },
                                            ]
                                        }
                                    ]}
                                    {...this._panResponder.panHandlers}
                                >

                                    <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 10 }}>
                                        {focus &&
                                            <Icon
                                                name='open-with'
                                                type='material-icons'
                                                color='#000'
                                                size={32}
                                                onPress={() => this.setState({ textcolor: 'blue' })}
                                            />
                                        }</View>
                                    <TextInput
                                        ref={this.textInput}
                                        placeholderTextColor={'red'}
                                        style={[styles.TextInputstyle, { color }, focus && { borderWidth: 2 }]}
                                        selectionColor={'transparent'}
                                        autoFocus={focus}
                                        multiline={true}
                                        scrollEnabled={true}
                                        onChange={(e) => {
                                            this.setState({ text: e.nativeEvent.text })
                                        }}
                                        onTouchStart={this.handleDoubleTap}

                                    />

                                </Animated.View>
                            }
                            {draw &&
                                <Signature
                                    ref={view => { this.signatureView = view; }}
                                    height={'100%'}
                                    strokeColor={color}
                                />}
                        </ImageBackground>
                    </TouchableWithoutFeedback>
                    <Dialog
                        width={0.8}
                        height={100}
                        visible={showColor}
                        onTouchOutside={() => {
                            this.setState({ showColor: false });
                        }}
                    >
                        <DialogContent style={{ alignItems: 'center', textAlign: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 22, marginBottom: 15 }}>Select Color</Text>
                            </View>
                            <View style={styles.colorIcon}>
                                {colors && colors.map((data, index) => {
                                    return <View key={index}>
                                        <Icon
                                            type='font-awesome'
                                            name='circle'
                                            color={data.value}
                                            size={30}
                                            onPress={() => this.changeColor(index)}
                                        />
                                        <Text>{data.name}</Text>
                                    </View>
                                })}
                            </View>
                        </DialogContent>
                    </Dialog>
                </View>

                <View >
                    <Footer
                        style={styles.footer}>
                        <View style={styles.actionFooterBar}>
                            <TouchableOpacity style={styles.typeBtn} onPress={() => {
                                this.edit();
                            }} >
                                <Icon
                                    name='title'
                                    type='material-icons'
                                    // color='#fff'
                                    color={edit ? '#39FF14' : '#fff'}
                                    size={32}
                                />
                                <Text style={edit ? { color: '#39FF14' } : { color: '#fff' }}>Text</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.typeBtn} onPress={() => {
                                this.drawSketch();
                            }} >
                                <Icon
                                    name='pencil'
                                    type='font-awesome'
                                    color={draw ? '#39FF14' : '#fff'}
                                    size={28}
                                />
                                <Text style={(draw) ? { color: '#39FF14' } : { color: '#fff' }}>Draw</Text>
                            </TouchableOpacity>

                            {draw &&
                                <TouchableOpacity style={styles.typeBtn} onPress={() => { this.signatureView.reset() }}>
                                    <Icon
                                        name='undo'
                                        type='font-awesome'
                                        color='#fff'
                                        size={28}
                                    />
                                    <Text style={styles.white}>Undo</Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={styles.typeBtn} onPress={() => {
                                this.setState({ showColor: !showColor })
                            }} >
                                <Icon
                                    name='square-o'
                                    type='font-awesome'
                                    color={color}
                                    size={28}
                                />
                                <Text style={{ color: color }}>color</Text>
                            </TouchableOpacity>
                        </View>
                    </Footer>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    Animatedcontainer: {
        width: '100%',
        // marginTop: 30
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#000',
    },
    header: {
        zIndex: 90,
        paddingTop: 15,
        backgroundColor: '#000',
        width: '100%',
        marginTop: 0,
        borderWidth: 0,
        borderColor: 'transparent'
    },
    white: {
        color: "#fff"
    },
    colorIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    actionBar: {
        width: "100%",
        // height: 50,
        height: HEIGHT,
        backgroundColor: "#000",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",

    },
    actionBtnRight: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    actionBtnLeft: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    BarRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionFooterBar: {
        width: "100%",
        height: HEIGHT + 20,
        backgroundColor: "#000",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-around',
    },
    typeBtn: {
        textAlign: 'center',
        alignItems: 'center'
    },
    footer: {
        zIndex: 90,
        backgroundColor: '#fff',
        width: '100%',
        marginTop: 0,
        borderWidth: 0,
        borderColor: 'transparent',
    },
    TextInputstyle: {
        fontSize: 40,
        paddingLeft: 15,
        borderColor: "#FFFFFF",
        width: '100%',
    }
});

ImageWatermark.propTypes = {
    uri: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    onClose: PropTypes.func
};
ImageWatermark.defaultProps = {
    uri: '',
};
export default ImageWatermark;
