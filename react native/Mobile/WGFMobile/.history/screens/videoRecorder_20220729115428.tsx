import React, { useState, useEffect } from 'react';
import { RootDrawerScreenProps } from "../types";
import { StyleSheet, Text, View, Button, Pressable, ToastAndroid, Modal, Platform, ActionSheetIOS, StatusBar } from 'react-native';
import { useIsFocused, useTheme } from '@react-navigation/native';
import DatePicker from 'react-native-datepicker';
import { createNewFilm, uploadVideo } from '../services/VideoUploadService';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoRecorderModal } from './Film/CameraModal';
import DropDownPicker from 'react-native-dropdown-picker';



export default function VideoRecorderScreen({ navigation, route }: RootDrawerScreenProps<'VideoRecord'>) {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const [date, setDate] = useState("");
  let [sound, setSound] = React.useState(0);
  let [type, setType] = React.useState("Game");
  let [camera, setCamera] = React.useState(0);
  let [tag, setTag] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [filmTitle, setFilmTitle] = React.useState("");
  const [isIOS, setIsIOS] = React.useState(false);
  const [filmGuid, setFilmGuid] = React.useState("");
  const [playListid, setplayListid] = React.useState("");
  const [openSound, setOpenSound] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [soundItems, setSoundItems] = useState([
    { label: 'Remove Audio', value: 0 },
    { label: 'Keep Audio', value: 1 }
  ]);
  const [typeItems, setTypeItems] = useState([
    { label: 'Game', value: 0 },
    { label: 'Practice', value: 1 },
    { label: 'Scout', value: 2 },
    { label: 'Training', value: 3 },
    { label: 'Other', value: 4 }
  ]);
  const [cameraItems, setCameraItems] = useState([
    { label: 'Sideline', value: 0 },
    { label: 'Endzone', value: 1 },
    { label: 'Pressbox', value: 2 },
    { label: 'Drone', value: 3 },
    { label: 'Stands', value: 4 },
    { label: 'Body', value: 5 }
  ]);



  useEffect(() => {
    (async () => {
      if (Platform.OS === "ios") {
        setIsIOS(true);
      }
    })();
  }, []);

  const filmModal = { TeamId: 0, UserId: 0, Title: "", Date: "", Audio: 0, Group: "", Angle: 0, Tags: "" };

  const createFilmHandler = async () => {
    filmModal.Title = filmTitle;
    filmModal.Date = date;
    filmModal.Audio = parseInt(sound.toString());
    filmModal.Group = type;
    filmModal.Angle = parseInt(camera.toString());
    filmModal.Tags = tag;
    // var result = await createNewFilm(filmModal);
    // setFilmGuid(result.data["filmguid"]);
    // setplayListid(result.data["playlistid"]);


    if (['UploadFromDevice', 'GoogleDriveUpload', 'TranferFromHudl'].includes(route.params?.prevScreen)) {

      const data = new FormData();
      data.append("videoFile", {
        name: route.params?.uri.split("/").pop(),
        type: "video/mp4",
        uri: route.params?.uri
      });
      // data.append("filmGuid", result.data["filmguid"]);
      // data.append("playlistId", result.data["playlistid"]);
      data.append("clipOrder", `${0}`);

      console.log(data);

      // const response = await uploadVideo(data);
      // if (response.status == 200) {
      //   console.log("Upload Successful")
      // } else {
      //   console.log("Upload Failed")
      // }

    } else {
      navigation.navigate("RecorderTemp", {
        filmTitle: filmTitle,
        // filmGuid: result.data["filmguid"],
        // playListid: result.data["playlistid"]
      });
    }



  }

  const onPressSoundDropdown = (options: [""]) => ActionSheetIOS.showActionSheetWithOptions(
    {
      options: options,
      destructiveButtonIndex: options.length - 1,
      cancelButtonIndex: options.length - 1,
      userInterfaceStyle: 'dark'
    },
    buttonIndex => {
      if (buttonIndex === options.length - 1) {
        return;
      }
      setSound(buttonIndex);
    }
  )
  const onPressTypeDropdown = (options: [""]) => ActionSheetIOS.showActionSheetWithOptions(
    {
      options: options,
      destructiveButtonIndex: options.length - 1,
      cancelButtonIndex: options.length - 1,
      userInterfaceStyle: 'dark'
    },
    buttonIndex => {
      if (buttonIndex === options.length - 1) {
        return;
      }
      setType(options[buttonIndex]);
    }
  )
  const onPressCameraDropdown = (options: [""]) => ActionSheetIOS.showActionSheetWithOptions(
    {
      options: options,
      destructiveButtonIndex: options.length - 1,
      cancelButtonIndex: options.length - 1,
      userInterfaceStyle: 'dark'
    },
    buttonIndex => {
      if (buttonIndex === options.length - 1) {
        return;
      }
      setCamera(buttonIndex);
    }
  )
  const getTextColor = () => {
    return theme.colors.background === "rgb(1, 1, 1)" ? "#fff" : "#9c9c9c";
  }

  return (
    isFocused && (
      <View>
        <ScrollView>
          <View style={styles.container}>
            <View style={{}}>
              {/* // <Text style={[styles.text, { color: getTextColor() }]}>Title</Text> */}
              <TextInput
                placeholder='Enter Film Title'
                placeholderTextColor={"#636c72"}
                onChangeText={(v) => { setFilmTitle(v) }}
                style={styles.textInput}>
              </TextInput>
            </View>


            <View style={{ marginTop: "3%", }}>
              {/* // <Text style={[styles.text, { color: getTextColor() }]}>Date</Text> */}
              <View style={styles.datePickerContainer}>
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
                      borderWidth: 0,
                      paddingLeft: 0,
                    },
                    placeholderText: {
                      // marginLeft: Platform.OS === "android" ? -84 : -50,
                      fontSize: 16,
                      color: "#636c72"
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date: any) => { setDate(date) }}
                />
              </View>

            </View>

            <View style={{ marginTop: "3%", }}>
              {/* // <Text style={[styles.text, { color: getTextColor() }]}>Sound</Text> */}

              <DropDownPicker
                containerProps={{
                  height: openSound === true ? 120 : null,
                  // backgroundColor: "#fff",
                }}
                open={openSound}
                value={sound}
                items={soundItems}
                setOpen={setOpenSound}
                setValue={setSound}
                setItems={setSoundItems}
                dropDownDirection="BOTTOM"
                containerStyle={{ width: "100%" }}
              />

            </View>

            <View style={{ marginTop: "3%", }}>
              {/* // <Text style={[styles.text, { color: getTextColor() }]}>Type</Text> */}
              <>
                <DropDownPicker
                  placeholder='Select Film Type'
                  placeholderStyle={{ color: "#636c72" }}
                  containerProps={{
                    height: openType === true ? 240 : null,
                    // backgroundColor: "#fff",
                  }}
                  open={openType}
                  value={type}
                  items={typeItems}
                  setOpen={setOpenType}
                  setValue={setType}
                  setItems={setTypeItems}
                  dropDownDirection="BOTTOM"
                  containerStyle={{ width: "100%", }}
                />
              </>


            </View>


            <View style={{ marginTop: "3%", }}>
              {/* // <Text style={[styles.text, { color: getTextColor() }]}>Camera</Text> */}
              <>

                <DropDownPicker
                  placeholder='Select Camera Angle'
                  placeholderStyle={{ color: "#636c72" }}
                  containerProps={{
                    // height: openType === true ? 240 : null,
                    // backgroundColor: "#fff",
                  }}
                  open={openCamera}
                  value={camera}
                  items={cameraItems}
                  setOpen={setOpenCamera}
                  setValue={setCamera}
                  setItems={setCameraItems}
                  dropDownDirection="BOTTOM"
                  containerStyle={{ width: "100%" }}
                />
              </>

              {/* <View style={styles.pickerContainer}> */}
              {
                // !isIOS &&
                // <Picker
                //   selectedValue={camera}
                //   onValueChange={cam => setCamera(cam)}
                //   // style={{ width: 200, fontSize: 10 }}
                //   mode="dropdown"
                // >
                //   {/* <Picker.Item style={{ color: "#8e8e8e", fontSize: 16, }} value='' label='Select Camera Angle' /> */}
                //   <Picker.Item label="Sideline" value="0" />
                //   <Picker.Item label="Endzone" value="1" />
                //   <Picker.Item label="Pressbox" value="2" />
                //   <Picker.Item label="Drone" value="3" />
                //   <Picker.Item label="Stands" value="4" />
                //   <Picker.Item label="Body" value="5" />
                // </Picker>
              }

              {
                // isIOS &&
                // <Text
                //   style={[styles.text, { paddingLeft: 10, paddingTop: 12, fontWeight: "400" }]}
                //   onPress={() =>
                //     onPressCameraDropdown(["SideLine", "Endzone", "Pressbox", "Drone", "Stands", "Body", "cancel"])
                //   } >{camera}
                // </Text>
              }
              {/* </View> */}

            </View>

            <View style={{ marginTop: "3%", }}>
              {/* // <Text style={[styles.text, { color: getTextColor() }]}>Tags</Text> */}
              <TextInput
                placeholder='Create or Select Tag'
                onChangeText={v => { setTag(v) }}
                style={styles.textInput}>
              </TextInput>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
              <Pressable onPress={createFilmHandler}
                style={styles.pressableButton}>
                <Text style={{ color: 'white', fontSize: 20 }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={createFilmHandler}
                style={styles.pressableButton}>
                <Text style={{ color: 'white', fontSize: 20 }}>Create Film</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View >

    )
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "column",
    justifyContent: "center",
    padding: "5%",
    paddingBottom: 0,

  },
  text: {
    fontSize: 16,
    paddingTop: 7,
  },
  textInput: {
    height: 48,
    // borderColor: '#cccccc',
    borderRadius: 6,
    borderWidth: 1,
    paddingLeft: 8,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 50,
    marginBottom: "100%",
    width: 160,
    marginLeft: 120,
  },
  pressableButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "40%",
    height: 50,
    marginTop: "5%",
    marginBottom: Platform.OS == "android" ? 150 : 80,
    borderRadius: 10,
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

  datePicker: {
    height: "100%",
    width: Platform.OS == "android" ? "100%" : 180,
    borderWidth: 0
  },
  dateIcon: {
    position: 'absolute',
    right: 10,
    top: 4,
    marginLeft: 160
  },
  datePickerContainer: {
    height: 48,
    // borderColor: '#cccccc',
    borderRadius: 6,
    borderWidth: 1,
    paddingLeft: 8,
    backgroundColor: '#ffffff',
  },
  pickerItemStyle: {
    flex: 1,
    fontWeight: '100',
    fontSize: 20,
    paddingTop: 57,
    marginRight: 100,
    height: 60,
    width: 200,
  },
  pickerContainer: {
    borderWidth: 1,
    height: 40,
    width: Platform.OS == "android" ? 200 : 180,
    borderColor: "#cccccc",
    backgroundColor: "white"
  }


})
