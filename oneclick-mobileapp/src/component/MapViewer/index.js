import React, { Component } from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity, ImageBackground,
    Modal,
    Animated,
    Image
} from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps'
import Constants from 'expo-constants'
class MapViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mapview: 'standard',
            mapviewpicker:false
        }
    }
    render() {
        const {modalVisible ,SetLatLong ,savelatlong ,mapRegion ,mapviewpicker ,mapview ,coordinate  ,description ,onDragEnd ,marker ,ChangeMapView ,mapviewpickerState,closeButton} = this.props
        return ( 
            <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}>
            <View style={styles.mapcontainer}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: "center",
                position: 'absolute',
                top: 18,
                zIndex: 99,
                width: "100%",
                backgroundColor: "#fff",
                paddingVertical: 4
              }}>
                <TouchableOpacity onPress={() =>SetLatLong()}>
                  <Icon
                    name='close'
                    type='EvilIcons'
                    color='#41a1f1'
                    size={34}
                    iconStyle={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
                <View style={{ width:"60%"}}>
                        <Text style={{color:'#444',fontSize: 12,textAlign:"center"}}> 
                        Press the marker and then drag it to move the location
                        </Text>
                        </View>
                <TouchableOpacity onPress={() =>savelatlong()}>
                  <Icon
                    name='check'
                    type='material-icons'
                    color='#41a1f1'
                    iconStyle={{ marginRight: 5 }}
                    size={34}
                  />
                </TouchableOpacity>
              </View>
              {
                mapRegion === null ?
                  <Text>Map region doesn't exist.</Text> :
                  <View style={{ position: "relative" }}>
                    <TouchableOpacity style={styles.maplayers} onPress={() => this.setState({
                        mapviewpicker:true
                    })}>
                      <Icon
                        name='layers'
                        type='material-icons'
                        color='#41a1f1'
                        size={24}
                      />
                    </TouchableOpacity>
                    <MapView
                      style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}
                      region={mapRegion}
                      mapType={this.state.mapview}
                      zoomEnabled={true}
                      scrollEnabled={true}
                      showsScale={true}
                      showsBuildings={true}
                      ref={ref => { this.map = ref; }}>
                      <MapView.Marker
                        coordinate={{
                            latitude: mapRegion.latitude,
                            longitude:mapRegion.longitude,
                          }}
                        draggable
                        onDragEnd={(data)=>onDragEnd(data)}>
                        <Image source={marker} style={{ height: 48, width: 48 }} />
                      </MapView.Marker>
                    </MapView>
                  </View>
              }
            </View>
            {
              this.state.mapviewpicker ?
                <Animated.View style={[StyleSheet.absoluteFill, styles.cover]}>
                  <View style={styles.card}>
                    <View style={styles.btnGroup}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => 
                            this.setState({
                                mapview :'standard',
                                mapviewpicker: false
                              }) 
                            }
                      >
                        <Text style={styles.buttonText}>Standard</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.closeButton, styles.centerButton]}
                        onPress={() => 
                            this.setState({
                                mapview :'satellite',
                                mapviewpicker: false
                              }) 
                            }>
                        <Text style={styles.buttonText}>Satellite</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.closeButton, styles.centerButton]}
                        onPress={() => 
                            this.setState({
                                mapview :'hybrid',
                                mapviewpicker: false
                              }) 
                            }>
                        <Text style={styles.buttonText}>Hybrid</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.singlebtn}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => 
                            this.setState({
                                mapviewpicker: false
                              })}>
                        <Text style={[styles.buttonText, styles.bold]}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View> : null}
          </Modal>
        )
    }
}
const styles = StyleSheet.create({
    mapcontainer: {
        flex: 1,
        paddingTop: Constants.statusBarHeight + 10,
        backgroundColor: '#fff',
      },
      maplayers: {
        position: "absolute",
        top: 40,
        right: 15,
        zIndex: 9999,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
      },
      cover: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
      },
      btnGroup: {
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 10
      },
      card: {
        marginBottom: 10,
      },
      closeButton: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 15
      },
      singlebtn: {
        borderRadius: 10,
        backgroundColor: '#fff'
      },
      buttonText: {
        color: '#047aff',
        fontSize: 17
      },
      centerButton: {
        borderTopWidth: 1,
        borderColor: '#ededed'
      },
      bold: {
        fontWeight: 'bold'
      },
})
export default MapViewer;