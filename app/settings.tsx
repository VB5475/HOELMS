import { Ionicons } from "@expo/vector-icons";
import { getAppIcon, setAppIcon } from "@howincodes/expo-dynamic-app-icon";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ICON_OPTIONS = [
  {
    key: null as string | null,
    label: "Default (Purple)",
    color: "#6366f1",
    preview: require("../assets/icons/default.png"),
  },
  {
    key: "dark",
    label: "Dark Mode",
    color: "#1e293b",
    preview: require("../assets/icons/dark.png"),
  },
  {
    key: "green",
    label: "Emerald",
    color: "#059669",
    preview: require("../assets/icons/green.png"),
  },
  {
    key: "red",
    label: "Rose",
    color: "#e11d48",
    preview: require("../assets/icons/red.png"),
  },
];

export default function SettingsScreen() {
  const [currentIcon, setCurrentIcon] = useState<string | null>(null);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const icon = await getAppIcon();
        setCurrentIcon(icon === "DEFAULT" ? null : icon);
      } catch {
        setCurrentIcon(null);
      }
    };
    load();
  }, []);

  async function handleChangeIcon(iconKey: string | null) {
    if (iconKey === currentIcon) return;

    setChanging(true);
    try {
      const result = await setAppIcon(iconKey, false);
      console.log("result:", result)
      if (result !== false) {
        setCurrentIcon(iconKey); 
        Alert.alert(
          "Icon Changed! ✨",
          "Your app icon has been updated. Check your home screen!",
          [{ text: "Got it" }]
        );
      } else {
        Alert.alert(
          "Error",
          "Could not change icon. This feature requires a native build."
        );
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message || "Could not change icon. This feature requires a native build."
      );
    } finally {
      setChanging(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="bg-white flex-row items-center px-4 pb-4 pt-2 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Settings</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* App Icon Section */}
        <View className="mx-4 mt-6">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
            App Icon
          </Text>
          <View className="bg-white rounded-2xl border border-gray-100 p-4">
            <Text className="text-gray-600 text-sm mb-4">
              Choose your preferred app icon
            </Text>

            <View className="flex-row flex-wrap gap-4 justify-center">
              {ICON_OPTIONS.map((icon) => {
                const isSelected = icon.key === currentIcon;
                return (
                  <TouchableOpacity
                    key={icon.key ?? "default"}
                    onPress={() => handleChangeIcon(icon.key)}
                    disabled={changing}
                    activeOpacity={0.7}
                    className="items-center"
                    style={{ width: "45%", marginBottom: 8 }}>
                    <View
                      style={{
                        borderWidth: 3,
                        borderColor: isSelected ? icon.color : "transparent",
                        borderRadius: 20,
                        padding: 3,
                      }}>
                      <Image
                        source={icon.preview}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 16,
                        }}
                      />
                    </View>
                    <Text
                      className={`text-sm mt-2 font-medium ${
                        isSelected ? "text-indigo-600" : "text-gray-600"
                      }`}>
                      {icon.label}
                    </Text>
                    {isSelected && (
                      <View className="flex-row items-center mt-1 gap-1">
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color={icon.color}
                        />
                        <Text className="text-indigo-600 text-xs font-semibold">
                          Active
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="text-gray-400 text-xs mt-4 text-center">
              On Android, icon changes apply when the app goes to background
            </Text>
          </View>
        </View>

       
      </ScrollView>
    </SafeAreaView>
  );
}