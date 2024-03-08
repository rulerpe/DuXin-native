import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Alert } from "react-native";

export function useTakePhoto() {
  const [image, setImage] = useState<string | null>(null);

  const compressImage = async (uri: string) => {
    let result = await await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { height: 1000 } }],
      { compress: 0.5 }
    );
    setImage(result.uri);
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "You need to grant camera permissions to take a photo."
      );
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.back,
      quality: 1,
    });

    if (!result.canceled) {
      compressImage(result.assets[0].uri);
    }
  };

  return { image, takePhoto };
}
