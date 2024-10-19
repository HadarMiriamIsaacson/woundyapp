import { useAdminContext } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";
import { useChoosenFileContext } from "@/context/ChoosenFileContex";
import { storage } from "@/firebase";
import { useLocalSearchParams } from "expo-router";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, Dimensions } from "react-native";
import WebView from "react-native-webview";
import * as XLSX from "xlsx";

const LabTestAdmin = () => {
  const { fileCurrent } = useChoosenFileContext();
  if (!fileCurrent) return null;
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: fileCurrent }}
        scalesPageToFit={true} // For older versions
        cacheEnabled
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        javaScriptEnabled={true} // Enable JavaScript for enhanced functionality
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
        textZoom={10}
        startInLoadingState={true}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        bounces={false}
      />
    </View>
  );
};

export default LabTestAdmin;
