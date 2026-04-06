import * as Sentry from '@sentry/react-native';
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import ErrorBoundaryWrapper from "../components/ErrorBoundaryWrapper";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { CourseProvider } from "../context/CourseContext";
import "../global.css";
import { handleAppOpenNotification } from "../lib/notifications";

Sentry.init({
 dsn: __DEV__ ? undefined : 'https://b4098f02574c72081ce4252a5ea8de7f@o4511167868698624.ingest.de.sentry.io/4511167870468176',

  sendDefaultPii: true,

  enableLogs: true,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(
    {
  maskAllText: true,
  maskAllImages: true,
  maskAllVectors: true,
}
  ), Sentry.feedbackIntegration()],
});

function AuthGuard({ children }: { children: React.ReactNode }) {
 const { isLoggedIn, isLoading } = useAuth();
 const segments = useSegments();

 useEffect(() => {
  if (isLoading) return;

  const inAuthGroup = segments[0] === "(auth)";

  if (!isLoggedIn && !inAuthGroup) {
   router.replace("/(auth)/login");
  } else if (isLoggedIn && inAuthGroup) {
   router.replace("/(tabs)");
  }
 }, [isLoggedIn, isLoading, segments]);

 if (isLoading) {
  return (
   <View
    style={{
     flex: 1,
     alignItems: "center",
     justifyContent: "center",
     backgroundColor: "#fff",
    }}>
    <ActivityIndicator size="large" color="#6366f1" />
   </View>
  );
 }

 return <>{children}</>;
}

export default function RootLayout() {
 useEffect(() => {
  handleAppOpenNotification().catch(() => {});
 }, []);

 return (
  <ErrorBoundaryWrapper>
      <AuthProvider>
   <CourseProvider>
    <AuthGuard>
     <StatusBar style="dark" />
     <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen
       name="course/[id]"
       options={{
        presentation: "card",
        headerShown: true,
        headerTitle: "",
        headerBackTitle: "",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#374151",
       }}
      />
      <Stack.Screen name="webview" options={{ presentation: "card" }} />
      <Stack.Screen name="settings" options={{ presentation: "card", headerShown: false }} />
     </Stack>
    </AuthGuard>
   </CourseProvider>
  </AuthProvider>
  </ErrorBoundaryWrapper>

 );
};
