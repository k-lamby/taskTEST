//=================== FilePreviewScreen.js =======================//
// file preview for viewing and zooming in on images and pdfs
//================================================================//

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import { Linking } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { X } from "lucide-react-native";
import { WebView } from "react-native-webview";
import GlobalStyles from "../styles/styles";

const FilePreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // get the file details from the route params
  const { fileUrl, fileType, fileName = "Attachment" } = route.params;

  // regex to get the image types, or pdf
  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)(\?|$)/i.test(fileUrl);
  const isPdf = /\.pdf(\?|$)/i.test(fileUrl);

  // if the file type is unsupported we have a fallback to open
  // the file in the browser
  const openInBrowser = async () => {
    const supported = await Linking.canOpenURL(fileUrl);
    if (supported) {
      Linking.openURL(fileUrl);
    } else {
      Alert.alert("Unable to open file in browser.");
    }
  };

  // then returns the three different view types depending on the situation
  // image, pdf or not support
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#001524" }}>
      <View style={[GlobalStyles.container.base, { flex: 1 }]}>
        <View style={GlobalStyles.nav.topBarContainer}>
          <Text
            style={[GlobalStyles.text.white, { flex: 1 }]}
            numberOfLines={1}
            accessibilityLabel={`Previewing file: ${fileName}`}
          >
            {fileName}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityLabel="Close file preview"
            accessibilityRole="button"
            style={GlobalStyles.nav.iconContainer}
          >
            <X size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          {isImage ? (
            <ScrollView
              maximumZoomScale={5}
              minimumZoomScale={1}
              contentContainerStyle={GlobalStyles.filePreview.zoomableContainer}
              accessibilityLabel="Zoomable image container"
            >
              <Image
                source={{ uri: fileUrl }}
                style={GlobalStyles.filePreview.zoomableImage}
                resizeMode="contain"
                accessibilityLabel={`Image preview: ${fileName}`}
              />
            </ScrollView>
          ) : isPdf ? (
            <WebView
              source={{ uri: fileUrl }}
              style={{ flex: 1, backgroundColor: "#001524" }}
              startInLoadingState={true}
              accessibilityLabel="PDF preview"
            />
          ) : (
            <View style={GlobalStyles.filePreview.unsupportedContainer}>
              <Text
                style={GlobalStyles.text.translucent}
                accessibilityLabel="Unsupported file type message"
              >
                This file type is not supported for in app preview.
              </Text>

              <TouchableOpacity
                onPress={openInBrowser}
                accessibilityRole="button"
                accessibilityLabel="Open file in browser"
                style={GlobalStyles.button.secondary}
              >
                <Text style={GlobalStyles.button.textSmall}>Open in browser</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FilePreviewScreen;