import { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import theme from "../theme";
import ButtonComponent from "../components/ButtonComponent";
import LanguageSelector from "../components/LanguageSelector";
import { useTakePhoto } from "../hooks/useTakePhoto";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { image, takePhoto } = useTakePhoto();

  useEffect(() => {
    const uploadImage = async () => {
      console.log("uploading image", image);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.navigate("/summary-generate");
      }, 1000);
      // const formData = new FormData();
      // formData.append('photo',{

      // })
    };
    if (image) {
      uploadImage();
    }
  }, [image]);

  const handleLanguageChange = async (language: string) => {
    console.log("language changed", language);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("make request to update user language");
    }, 1000);
  };
  return (
    <View style={styles.homePage}>
      <Text style={styles.welcomeText}>
        Take a picture of a letter see summary and translation
      </Text>
      <ButtonComponent
        label="Take a photo"
        onPress={takePhoto}
        isLoading={isLoading}
      />
      <LanguageSelector
        onLanguageChange={handleLanguageChange}
        isDisabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  homePage: {
    paddingHorizontal: 15,
  },
  welcomeText: {
    fontSize: theme.font.large,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
});
