import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { Header, Left, Right } from 'native-base';
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
class ImageViewer extends Component {
    videoPlayer;

  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: false,
      playerState: PLAYER_STATES.PLAYING,
      screenType: 'content',
    };
  }
     onSeek = seek => {
    //Handler for change in seekbar
    this.videoPlayer.seek(seek);
  };

  onPaused = playerState => {
    //Handler for Video Pause
    this.setState({
      paused: !this.state.paused,
      playerState,
    });
  };

  onReplay = () => {
    //Handler for Replay
    this.setState({ playerState: PLAYER_STATES.PLAYING });
    this.videoPlayer.seek(0);
  };

  onProgress = data => {
    const { isLoading, playerState } = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({ currentTime: data.currentTime });
    }
  };
  
  onLoad = data => this.setState({ duration: data.duration, isLoading: false });
  
  onLoadStart = data => this.setState({ isLoading: true });
  
  onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });
  
 
  
  exitFullScreen = () => {
    alert('Exit full screen');
  };
  
  onFullScreen = () => {
    if (this.state.screenType == 'content')
      this.setState({ screenType: 'cover' });
    else this.setState({ screenType: 'content' });
  };
 
  onSeeking = currentTime => this.setState({ currentTime });
    render() {
        const { index, uri, onDelete, onReturn, toggleDeleteButton, itemType } = this.props
        const fileExt = uri && uri.substring(uri.lastIndexOf('/') + 1,uri.length).split('.')[1]
        return (
            <View style={styles.container}>
                <Header style={styles.Header}>
                    <Left>
                        <TouchableOpacity style={styles.actionBtnLeft} onPress={() => onReturn()}>
                            <Icon
                                name='chevron-left'
                                type='octicon'
                                color='#41a1f1'
                                size={34}
                            />
                        </TouchableOpacity>
                    </Left>
                    <Right>
                        {toggleDeleteButton &&
                            <TouchableOpacity style={styles.actionBtnRight} onPress={() => onDelete(index, itemType)}>
                                <Icon
                                    name='delete'
                                    type='material'
                                    color='#41a1f1'
                                    size={32}
                                />
                            </TouchableOpacity>}
                    </Right>
                </Header>
                <View style={styles.imageContainer}>
                    {fileExt && fileExt == 'mov' ?
                     <View style={styles.backgroundVideo}>
                
        <Video
          onEnd={this.onEnd}
          onLoad={this.onLoad}
          onLoadStart={this.onLoadStart}
          onProgress={this.onProgress}
          paused={this.state.paused}
          ref={videoPlayer => (this.videoPlayer = videoPlayer)}
          resizeMode={this.state.screenType}
          onFullScreen={this.state.isFullScreen}
          source={{ uri: uri }}
          style={styles.mediaPlayer}
          volume={10}
        />
        <MediaControls
          duration={this.state.duration}
          isLoading={this.state.isLoading}
          mainColor="#333"
          onFullScreen={this.onFullScreen}
          onPaused={this.onPaused}
          onReplay={this.onReplay}
          onSeek={this.onSeek}
          onSeeking={this.onSeeking}
          playerState={this.state.playerState}
          progress={this.state.currentTime}
        />
      
       </View>
                        :
                        <ImageBackground
                            resizeMode='contain'
                            source={{
                                uri: uri

                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}
                        />}

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },

    Header: { backgroundColor: "#fff", width: "100%" },
    actionBtnRight: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    actionBtnLeft: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    imageContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
    },
    backgroundVideo:{
        width:'100%',
        height:'100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
//     container: {
//     flex: 1,
//   },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
})

ImageViewer.propTypes = {
    index: PropTypes.number.isRequired,
    uri: PropTypes.string.isRequired,
    onDelete: PropTypes.func,
    onReturn: PropTypes.func.isRequired,
    toggleDeleteButton: PropTypes.bool,
    itemType: PropTypes.string
};

ImageViewer.defaultProps = {
    uri: '',
    toggleDeleteButton: true,
    itemType: null
};

export default ImageViewer;