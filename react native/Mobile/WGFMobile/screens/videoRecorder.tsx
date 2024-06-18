import React, { useState, useEffect } from 'react';
import { RootDrawerScreenProps } from "../types";
import { StyleSheet, Text, View, Pressable, ToastAndroid, Modal, Platform, ActionSheetIOS, StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { createNewFilm, uploadVideo } from '../services/VideoUploadService';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { BASE_URL } from '../const';
import { preferencesContext } from './PreferenceHelper';
import ProcessingIndicator from '../components/ProcessingIndicator';
import { Formik, } from "formik";
import * as yup from "yup";
import { TextInput, Button, Colors, Title, useTheme } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import { Value } from 'react-native-reanimated';
import { PreferencesContext } from '../PreferencesContext';
// import { useThemeColor } from '../components/Themed';

const initialState = {
  filmTitle: "",
  type: -1,
  sound: 0,
  camera: 0,
  tags: "",
};
export default function VideoRecorderScreen({ navigation, route }: RootDrawerScreenProps<'VideoRecord'>) {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [date, setDate] = useState(`${new Date().toISOString().slice(0, 10)}`);
  let [sound, setSound] = React.useState(0);
  let [type, setType] = React.useState(1);
  let [typeErrorMessage, setTypeErrorMessage] = React.useState("");
  let [camera, setCamera] = React.useState(0);
  let [tag, setTag] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [filmTitle, setFilmTitle] = React.useState("");
  const [filmTitleErrorMessage, setFilmTitleErrorMessage] = React.useState("");
  const [isIOS, setIsIOS] = React.useState(false);
  const [filmGuid, setFilmGuid] = React.useState("");
  const [playListid, setplayListid] = React.useState("");
  const [openSound, setOpenSound] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [recordData, setRecordData] = useState(initialState);

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
  const [createFilmDisabled, setCreateFilmDisabled] = useState(false);
  const [isPreviousScreen, setIsPreviousScreen] = useState("");
  const { updateUserContext, userContext } = React.useContext(PreferencesContext);
  const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

  const typeList = ["Game", "Practice", "Scout", "Training", "Other"];

  useEffect(() => {
    (async () => {
      if (Platform.OS === "ios") {
        setIsIOS(true);
      }
    })();
  }, []);

  const filmModal = { TeamId: 0, UserId: 0, Title: "", Date: "", Audio: 0, Group: "", Angle: 0, Tags: "" };

  const createFilmHandler = async (values: any) => {

    if (values.filmTitle.length <= 0 && parseInt(type.toString()) < 0) {
      setTypeErrorMessage("Film type is required");
      setFilmTitleErrorMessage("Film title is required!");
      return;
    } else if (values.filmTitle.length <= 0) {
      setFilmTitleErrorMessage("Film title is required!");
      return;
    } else if (parseInt(type.toString()) < 0) {
      setTypeErrorMessage("Film type is required!");
      return;
    }


    setCreateFilmDisabled(true);

    filmModal.Title = values.filmTitle;
    filmModal.Date = date;
    filmModal.Audio = parseInt(sound.toString());
    filmModal.Group = typeList[type];
    filmModal.Angle = parseInt(camera.toString());
    filmModal.Tags = values.tags;

    var result = await createNewFilm(filmModal);

    setFilmGuid(result?.data["filmguid"]);
    setplayListid(result?.data["playlistid"]);

    navigation.navigate("RecorderTemp", {
      filmTitle: filmTitle,
      filmGuid: result.data["filmguid"],
      playListid: result.data["playlistid"]
    });

  }

  const validateSchema = yup.object({
    filmTitle: yup.string().trim().required("Film title is required."),
  });

  const getTextColor = () => {
    return theme.colors.background === "rgb(1, 1, 1)" ? "#fff" : "black";
  }

  return (
    isFocused && (

      <SafeAreaView style={styles.container}>
        {
          isSubmitting && isSubmitting == true ? (
            <View style={styles.processingIndicator}>
              <ProcessingIndicator isLoading={isSubmitting} indicatorColor={theme.colors.text} />
            </View>
          ) :
            (
              <>
                <ScrollView style={{ height: 'auto' }}>
                  <View style={[{ flex: 1, padding: 20 }]}>
                    <Formik
                      enableReinitialize={true}
                      initialValues={recordData}
                      validationSchema={validateSchema}
                      onSubmit={(values) => createFilmHandler(values)}
                    >
                      {(props) => (
                        <>
                          <View>
                            <TextInput
                              error={
                                props.touched.filmTitle && props.errors.filmTitle
                                  ? true
                                  : false
                              }
                              mode="flat"
                              //autoComplete='filmTitle'

                              onChangeText={props.handleChange("filmTitle")}
                              onBlur={props.handleBlur("filmTitle")}
                              placeholder=""
                              placeholderTextColor={theme.colors.placeholder}
                              label="Film Title *"
                              autoCapitalize="none"
                              keyboardType="default"
                              returnKeyType="next"
                              activeUnderlineColor={Colors.blue700}
                              blurOnSubmit={false}
                              value={props.values.filmTitle}
                            />

                            <Text style={{ color: theme.colors.error }}>
                              {/* {props.touched.firstName && props.errors.firstName} */}
                            </Text>


                            <DropDown
                              label={"Type *"}
                              mode={"flat"}
                              visible={openType}
                              showDropDown={() => setOpenType(true)}
                              onDismiss={() => setOpenType(false)}
                              list={typeItems}
                              activeColor={userTeamColor}
                              value={type}
                              setValue={setType}
                              inputProps={{ error: (typeErrorMessage.length > 0) ? true : false }}
                            />
                            <Text>
                            </Text>

                            <DropDown
                              label={"Sound"}
                              mode={"flat"}
                              visible={openSound}
                              showDropDown={() => setOpenSound(true)}
                              onDismiss={() => setOpenSound(false)}
                              value={sound}
                              setValue={setSound}
                              list={soundItems}
                              activeColor={userTeamColor}

                            />

                            <Text>

                            </Text>

                            <DropDown
                              label={"Camera"}
                              mode={"flat"}
                              visible={openCamera}
                              showDropDown={() => setOpenCamera(true)}
                              onDismiss={() => setOpenCamera(false)}
                              value={camera}
                              setValue={setCamera}
                              list={cameraItems}
                              activeColor={userTeamColor}
                            />

                            <Text>
                            </Text>

                            <TextInput
                              error={
                                props.touched.tags && props.errors.tags
                                  ? true
                                  : false
                              }
                              mode="flat"
                              //autoComplete='Tags'
                              onChangeText={props.handleChange("tags")}
                              value={props.values.tags}
                              placeholder=""
                              placeholderTextColor={theme.colors.placeholder}
                              label="Tags"
                              autoCapitalize="none"
                              keyboardType="default"
                              returnKeyType="next"
                              activeUnderlineColor={Colors.blue700}
                              onBlur={props.handleBlur("tags")}
                              blurOnSubmit={false}
                            />
                            <Text style={{ color: theme.colors.error }}>
                              {/* {props.touched.tags && props.errors.tags} */}
                            </Text>

                          </View>


                          <View style={[styles.buttonContainter, { backgroundColor: theme.colors.background }]} >
                            <Button
                              disabled={isSubmitting}
                              loading={isSubmitting}
                              mode="contained"
                              onPress={props.handleSubmit}
                              style={{ backgroundColor: userTeamColor, width: '100%', paddingVertical: 10 }}
                            >
                              <Text style={{ color: 'white' }}>Create Film</Text>
                            </Button>
                          </View>
                        </>
                      )}
                    </Formik>
                  </View>
                </ScrollView >
              </>
            )
        }
      </SafeAreaView >
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 0, margin: 0,
  },


  text: {
    fontWeight: "bold",
    paddingTop: 7,
  },
  buttonContainter:
  {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  textInput: {
    height: 48,
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
    // backgroundColor: "#6c757d",
    width: "100%",
    height: 50,
    marginTop: "10%",
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
  },
  processingIndicator: {
    flex: 1,
    justifyContent: 'center',
  }


})
