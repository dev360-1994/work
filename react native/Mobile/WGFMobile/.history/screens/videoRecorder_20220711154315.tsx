import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { RootDrawerScreenProps } from "../types";
import { StyleSheet, Text, View, Button, Pressable, ToastAndroid, Modal, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useIsFocused } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import DatePicker from 'react-native-datepicker'
import { uploadVideo } from '../services/VideoUploadService';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';
import { Box, Center, CheckIcon, NativeBaseProvider, Select } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import OpenCameraModal from "./Film/CameraModal";
import { SafeAreaView } from 'react-native-safe-area-context';
import ResetPasswordModal from './Film/CameraModal';





export default function VideoRecorderScreen({ navigation }: RootDrawerScreenProps<'VideoRecord'>) {

  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [record, setRecord] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState(true);
  const isFocused = useIsFocused();
  const [image, setImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(null);
  const [date, setDate] = useState("");
  let [sound, setSound] = React.useState("");
  let [type, setType] = React.useState(0);
  let [cameraDropDown, setCameraDropDown] = React.useState(0);
  let [tag, setTag] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [filmTitle, setFilmTitle] = React.useState("");
  const [recordingCount, setRecordingCount] = React.useState(0);


  const soundList = [
    "Remove Audio", "Keep Audio"
  ]
  const typeList = [
    "Game", "Practice", "Scout", "Training", "Other"
  ]
  const CameraList = [
    "SideLine", "Endzone", "Pressbox", "Drone", "Stands", "Body"
  ]
  const tagList = [
    "Test Game", "Multi Angle"
  ]


  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');

      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

    })();
  }, []);


  // const pickImage = async () => {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     base64: true,
  //     // mediaTypes: ImagePicker.MediaTypeOptions.Videos
  //   });

  //   // console.log(result);
  //   return result;


  // };


  const takeVideo = async () => {
    setRecordingCount(recordingCount + 1);
    setStatus(false);
    if (camera) {
      const { uri, codec = "mp4" } = await camera.recordAsync({
        maxDuration: 60,
      });

      const extension = `.${codec}`;

      //for video id
      var a = uri.split("/");
      var videoId = a[a.length - 1].split(".")[0];


      // MediaLibrary.saveToLibraryAsync(uri).then(() => {
      //   //saves video to gallary
      // });

      console.log("Before base64");
      const fsRead = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

      // const imgBase64 = await pickImage(); //pick file from gallary

      const response = await uploadVideo(fsRead, videoId, extension);
      console.log(response);
      if (response == "200") {
        uploadSuccesfulToastr();
      } else {
        uploadFailedToastr();
      }

      // const queryString = new URLSearchParams(JSON.stringify(vidData)).toString();

      // let fileUri = FileSystem.documentDirectory + "log2.txt";
      // await FileSystem.writeAsStringAsync(fileUri, fsRead, { encoding: FileSystem.EncodingType.UTF8 });
      // const asset = await MediaLibrary.createAssetAsync(fileUri);
      // await MediaLibrary.createAlbumAsync("Download", asset, false);

    }


  }

  const uploadSuccesfulToastr = () => {
    ToastAndroid.showWithGravity(
      "Upload Complete",
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };
  const uploadFailedToastr = () => {
    ToastAndroid.showWithGravity(
      "Upload Failed",
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };



  const stopVideo = async () => {
    setStatus(true);
    camera.stopRecording();
  }


  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    isFocused && (
      // <View style={{ flexGrow: 1 }}>
      <View>
        {/* Modal start */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.cameraContainer}>
                <Camera
                  ref={ref => setCamera(ref)}
                  style={styles.fixedRatio}
                  cameraType={type}
                  ratio={'4:3'}
                />
              </View>



              <View style={{ flexDirection: 'row' }}>
                <Pressable onPress={() => takeVideo()}
                  style={{
                    // height: 50,
                    backgroundColor: '#00FF00',
                    // width: '33.3%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: 50,
                    // backgroundColor: '#ee6e73',
                    position: 'absolute',
                    bottom: 50,
                    right: Platform.OS == "android" ? 205 : 150,
                  }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Start</Text>
                </Pressable>
                <Pressable onPress={() => stopVideo()}
                  style={{
                    // height: 50,
                    backgroundColor: 'red',
                    // width: '33.3%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    // borderRadius: 50,
                    // backgroundColor: '#ee6e73',
                    position: 'absolute',
                    bottom: 50,
                    right: 95,
                  }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Stop</Text>
                </Pressable>

                {/* {!status ?
                  <Pressable
                    style={{ height: 50, backgroundColor: 'pink', width: '33.3%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Live</Text>
                  </Pressable> : undefined
                } */}

              </View>
              <View
                style={{
                  // alignItems: 'center',
                  // justifyContent: 'center',
                  position: 'absolute',
                  bottom: 20,
                  right: 0,
                  left: 0,
                }}
              >
                <Text style={{ color: "white", fontSize: 15, textAlign: 'center' }} >Title: {filmTitle}</Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  top: Platform.OS == "android" ? 10 : 25,
                  left: 10,
                }}
              >
                <Text style={{ color: "white", fontSize: 15 }} >Recording {recordingCount} of {recordingCount}</Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  top: Platform.OS == "android" ? 10 : 25,
                  right: 10,
                }}
              >
                <Text style={{ color: "white", fontSize: 15 }} >Uploading {recordingCount} of {recordingCount}</Text>
              </View>

            </View>
          </Modal>
        </View>
        {/* Modal end */}
        <ScrollView>
          <View style={styles.container}>
            <View style={{ paddingBottom: 10, }}>

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.text}>Title</Text>
                <TextInput
                  placeholder='Enter Film title'
                  onChangeText={(v) => { setFilmTitle(v) }}
                  style={styles.textInput}>
                </TextInput>
              </View>

            </View>

            <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>Date</Text>
              <DatePicker
                style={styles.datePicker}
                date={date}
                mode="date"
                placeholder="Enter Film Date"
                format="YYYY-MM-DD"
                minDate="1900-05-01"
                maxDate="2090-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"

                customStyles={{
                  dateIcon: styles.dateIcon,
                  dateInput: {
                    marginLeft: -40,
                  },
                  placeholderText: {
                    marginLeft: Platform.OS === "android" ? -84 : -50,
                    fontSize: 20,
                    color: "#8e8e8e"
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date: any) => { setDate(date) }}
              />

            </View>

            <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>Sound</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={sound}
                  onValueChange={sou => setSound(sou)}
                  style={{ width: 240, fontSize: 20 }}
                  mode="dropdown"
                  itemStyle={styles.pickerItemStyle}
                >
                  <Picker.Item label="Remove Audio" value="removeAudio" />
                  <Picker.Item label="Keep Audio" value="keepAudio" />
                </Picker>
              </View>



            </View>


            <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>Type</Text>
              <View style={styles.pickerContainer}>

                <Picker
                  selectedValue={type}
                  onValueChange={sou => setType(sou)}
                  style={{ width: 240, fontSize: 10 }}
                  mode="dropdown"
                  itemStyle={styles.pickerItemStyle}>
                  <Picker.Item style={{ color: "#8e8e8e", fontSize: 18, }} value='' label='Select Film Type' />
                  <Picker.Item label="Game" value="Game" />
                  <Picker.Item label="Practice" value="Practice" />
                  <Picker.Item label="Scout" value="Scout" />
                  <Picker.Item label="Training" value="Training" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>


            <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>Camera</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={cameraDropDown}
                  onValueChange={sou => setCameraDropDown(sou)}
                  style={{ width: 240, fontSize: 10 }}
                  mode="dropdown"
                  itemStyle={styles.pickerItemStyle}>
                  <Picker.Item style={{ color: "#8e8e8e", fontSize: 18, }} value='' label='Select Camera Angle' />
                  <Picker.Item label="SideLine" value="SideLine" />
                  <Picker.Item label="Endzone" value="Endzone" />
                  <Picker.Item label="Pressbox" value="Pressbox" />
                  <Picker.Item label="Drone" value="Drone" />
                  <Picker.Item label="Stands" value="Stands" />
                  <Picker.Item label="Body" value="Body" />
                </Picker>
              </View>
            </View>


            <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>Tags</Text>
              <TextInput
                placeholder='Create or Select Tag'
                onChangeText={(v) => { setFilmTitle(v) }}
                style={styles.textInput}>
              </TextInput>
              {/* <View style={{ borderWidth: 1, height: 50, width: 240, borderColor: "#cccccc" }}>
              
               <Picker
                selectedValue={cameraDropDown}
                onValueChange={sou => setCameraDropDown(sou)}
                style={{ width: 240, fontSize: 20 }}
                mode="dropdown"
                itemStyle={{ color: 'red', fontWeight: '900', fontSize: 18, padding: 30 }}>
                <Picker.Item style={{ color: "#cccccc", fontSize: 18, }} value='' label='Create or Select Tag' />
                <Picker.Item label="Test Game" value="TestGame" />
                <Picker.Item label="Multi Angle" value="MultiAngle" />
                <Picker.Item label="Pressbox" value="Pressbox" />
              </Picker> 
          </View> */}
            </View>



            <View >

              {/* <View style={styles.button}>
              <Button onPress={() => setModalVisible(true)} color={"#6c757d"} title='Create Film' />
            </View> */}

              <Pressable onPress={() => setModalVisible(true)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: "#6c757d",
                  width: 140,
                  height: 50,
                  marginTop: 34,
                  marginBottom: 100,
                  borderRadius: 10,
                  marginLeft: 105,
                }}>
                <Text style={{ color: 'white', fontSize: 20 }}>Create Film</Text>
              </Pressable>


            </View>

          </View>
        </ScrollView>
      </View >

      // </View>



      // <View style={{ flex: 1 }}>
      //   <View style={styles.cameraContainer}>
      //     <Camera
      //       ref={ref => setCamera(ref)}
      //       style={styles.fixedRatio}
      //       cameraType={type}
      //       ratio={'4:3'}
      //     />
      //   </View>



      //   <View style={{ flexDirection: 'row' }}>
      //     <Pressable onPress={() => takeVideo()}
      //       style={{ height: 50, backgroundColor: '#000', width: '33.3%', alignItems: 'center', justifyContent: 'center' }}>
      //       <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Start Rec</Text>
      //     </Pressable>
      //     <Pressable onPress={() => stopVideo()}
      //       style={{ height: 50, backgroundColor: 'red', width: '33.3%', alignItems: 'center', justifyContent: 'center' }}>
      //       <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Stop Rec</Text>
      //     </Pressable>

      //     {!status ?
      //       <Pressable
      //         style={{ height: 50, backgroundColor: 'pink', width: '33.3%', alignItems: 'center', justifyContent: 'center' }}>
      //         <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Live</Text>
      //       </Pressable> : undefined
      //     }

      //   </View>

      // </View>

    )
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 220,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 30,
    paddingBottom: 0,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS == "android" ? 100 : 50,
  },


  text: {
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 7,
  },
  button: {
    marginTop: 50,
    marginBottom: "100%",
    width: 160,
    marginLeft: 120,
  },


  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  textInput: {
    height: 50,
    width: Platform.OS == "android" ? 240 : 180,
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingLeft: 8,
    fontSize: 20,
  },
  datePicker: {
    width: Platform.OS == "android" ? 200 : 140,
  },
  dateIcon: {
    position: 'absolute',
    right: 10,
    top: 4,
    marginLeft: 160
  },
  pickerItemStyle: {
    flex: 1,
    fontWeight: '100',
    fontSize: 20,
    paddingTop: 47,
    marginRight: 10,
    // height: 60,
    width: 200,
  },
  pickerContainer: {
    borderWidth: 1,
    height: 50,
    width: Platform.OS == "android" ? 240 : 180,
    borderColor: "#cccccc"
  }


})