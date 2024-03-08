// import { useState, useEffect, useRef } from "react";
// import { View, Text, StyleSheet, Button, Alert } from "react-native";
// import * as ImagePicker from 'expo-image-picker'

// export default function CameraPage() {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [image, setImage] = useState<string|null>(null)

//   const pickImage = async()=>{
//     let result = await ImagePicker.launchImageLibraryAsync({})
//   }
//   const takePhoto = async ()=>{
//     const
//   }
//   // const cameraRef = useRef<Camera | null>(null);
//   // useEffect(() => {
//   //   (async () => {
//   //     const { status } = await Camera.requestCameraPermissionsAsync();
//   //     setHasPermission(status === "granted");
//   //   })();
//   // }, []);

//   // if (hasPermission === null) {
//   //   return <View />;
//   // }
//   // if (hasPermission === false) {
//   //   return (
//   //     <View>
//   //       <Text>No access to camera</Text>
//   //     </View>
//   //   );
//   // }
//   // const takePicture = async () => {
//   //   console.log("take picture", cameraRef.current);
//   //   if (cameraRef.current) {
//   //     const photo = await cameraRef.current.takePictureAsync();
//   //     // Here you can handle the photo (e.g., display it or upload it)
//   //     Alert.alert("Photo Taken", "Photo location: " + photo.uri);
//   //   }
//   // };
//   return (
//     <View style={styles.cameraContainer}>
//       <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
//         <View style={styles.buttonContainer}>
//           <Button title="Take Photo" onPress={takePicture} />
//         </View>
//       </Camera>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   cameraContainer: {
//     flex: 1,
//     width: "100%",
//   },
//   camera: {
//     flex: 1,
//     width: "100%",
//   },
//   buttonContainer: {
//     flex: 1,
//     backgroundColor: "transparent",
//     flexDirection: "row",
//     margin: 20,
//     justifyContent: "center",
//     alignItems: "flex-end",
//   },
// });
