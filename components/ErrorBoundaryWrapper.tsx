import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
 children: React.ReactNode;
}

function FallbackUI() {
 return (
  <View
   style={{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    padding: 24,
   }}>
   <Ionicons name="warning-outline" size={56} color="#d1d5db" />
   <Text
    style={{
     color: "#374151",
     fontWeight: "600",
     fontSize: 18,
     marginTop: 16,
     textAlign: "center",
    }}>
    Something went wrong
   </Text>
   <Text
    style={{
     color: "#9ca3af",
     fontSize: 14,
     textAlign: "center",
     marginTop: 8,
    }}>
    An unexpected error occurred. Please restart the app.
   </Text>
   <TouchableOpacity
    onPress={() => {
     Sentry.captureMessage("User tapped Report Issue from ErrorBoundary fallback");
    }}
    style={{
     backgroundColor: "#6366f1",
     paddingHorizontal: 24,
     paddingVertical: 12,
     borderRadius: 12,
     marginTop: 20,
    }}>
    <Text style={{ color: "#fff", fontWeight: "600" }}>Report Issue</Text>
   </TouchableOpacity>
  </View>
 );
}

export default function ErrorBoundaryWrapper({ children }: Props) {
 return (
  <Sentry.ErrorBoundary
   fallback={<FallbackUI />}
   onError={(error, componentStack) => {
    Sentry.captureException(error, {
     extra: { componentStack },
    });
   }}>
   {children}
  </Sentry.ErrorBoundary>
 );
}
