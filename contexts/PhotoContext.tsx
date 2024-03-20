import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useState, createContext, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';

interface PhotoContextType {
  image: string | null;
  takePhoto: () => Promise<void>;
  clearImage: () => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<string | null>(null);

  const compressImage = async (uri: string) => {
    const compressedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { height: 1000 } }],
      {
        compress: 0.5,
        base64: true,
      },
    );
    if (compressedImage.base64) {
      setImage(compressedImage.base64);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant camera permissions to take a photo.');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.back,
      quality: 1,
    });

    if (!result.canceled) {
      await compressImage(result.assets[0].uri);
    }
  };

  const clearImage = () => {
    setImage(null);
  };

  return (
    <PhotoContext.Provider value={{ image, takePhoto, clearImage }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhoto = () => {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('useUser must used in a PhotoProvider');
  }
  return context;
};
