//================== FilePreviewScreen.js ========================//
// Displays a hybrid file preview screen with consistent branding.
// - Images: in-app zoom
// - PDFs: via WebView
// - Other files: open in browser
// - Includes SafeAreaView for full device compatibility
//===============================================================//

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
  const { fileUrl, fileType, fileName = "Attachment" } = route.params;

  // 🔎 Detect file types
  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)(\?|$)/i.test(fileUrl);
  const isPdf = /\.pdf(\?|$)/i.test(fileUrl);

  /**
   * 🌐 Fallback for unsupported file types
   */
  const openInBrowser = async () => {
    const supported = await Linking.canOpenURL(fileUrl);
    if (supported) {
      Linking.openURL(fileUrl);
    } else {
      Alert.alert("Unable to open file in browser.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#001524" }}>
      <View style={[GlobalStyles.container.base, { flex: 1 }]}>
        {/* 🔝 Branded Top Header */}
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

        {/* 📄 File Preview Area */}
        <View style={{ flex: 1 }}>
          {isImage ? (
            // 🖼️ Image Preview
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
            // 📄 PDF Preview
            <WebView
              source={{ uri: fileUrl }}
              style={{ flex: 1, backgroundColor: "#001524" }}
              startInLoadingState={true}
              accessibilityLabel="PDF preview"
            />
          ) : (
            // 🚫 Unsupported File Type
            <View style={GlobalStyles.filePreview.unsupportedContainer}>
              <Text
                style={GlobalStyles.text.translucent}
                accessibilityLabel="Unsupported file type message"
              >
                This file type is not supported for in-app preview.
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