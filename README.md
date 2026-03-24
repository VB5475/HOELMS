# LMS App

**📺 [Click Here to Watch the Demo Video](https://drive.google.com/file/d/1AvBMX41cKq3Zv8HxEnYm7IEIuWJdTiGI/view?usp=sharing)**

A React Native Expo app built as an LMS assignment. It demonstrates proficiency in native features, WebView integration, and state management. The app uses `freeapi.app` for data — random products as courses, and random users as instructors.

## Setup Instructions

### Prerequisites
- Node.js 20+
- Expo CLI: `npm install -g expo-cli`
- Android Studio or Xcode (for emulator) or Expo Go on a physical device

### Installation
```bash
git clone https://github.com/VB5475/HOELMS.git
cd HOELMS
npm install
```

### Running the Project Locally
```bash
# Start the Metro bundler
npx expo start --clear

# Press 'a' to open on Android, or 'i' to open on iOS
```

---

## Environment Variables

No `.env` file is required to run this project. The API base URL (`https://api.freeapi.app`) is pre-configured and hardcoded in `lib/api.ts` to ensure the project runs smoothly out-of-the box for evaluators. 

```ts
// lib/api.ts
const BASE_URL = "https://api.freeapi.app"; 
```

---

## Build Instructions (APK)

To make evaluation as smooth as possible, instructions for both Development and Release (Standalone) builds are provided below:

### 1. Development Build APK (As Requested)
As requested in the assignment deliverables, you can generate a development build:
```bash
npx expo run:android
```
**Important Evaluator Note:** A development build relies on a local server. If you install the Development APK, you **must** also run `npx expo start` in the project directory so the app can fetch the JavaScript bundle.

### 2. Standalone Release APK (Recommended for Testing)
To evaluate the app without needing to run any terminals or servers, a fully standalone Release APK has been generated.
```bash
npx expo run:android --variant release
```
*You can find the generated Release APK attached to the GitHub Releases section of this repository. It can be installed on any Android device directly.*

---

## Key Architectural Decisions

We prioritized a senior-level engineering approach by enforcing strict typing, robust error handling, and performance optimization.

1. **Strict Authentication Guard (`app/_layout.tsx`)**
   We use `useSegments()` and `useEffect` to protect routes. The auth guard runs dynamically after every state change. A loading spinner is shown while the token is validated on startup, preventing "flashes" to the login screen for already-authenticated users.

2. **Dual-Tier State Management & Persistence (`context/`)**
   - **Expo SecureStore:** Used strictly for sensitive data (Auth Tokens).
   - **React Native AsyncStorage:** Used for standard app data (Bookmarks, User Preferences).
   - **useReducer:** Selected over `useState` for complex state tracking (auth states, course data). This makes state transitions highly predictable and manageable.

3. **Performance Optimization**
   - **List Optimization:** We implemented `React.memo` on CourseCard components attached to a highly optimized `FlatList` (utilizing `removeClippedSubviews`, `maxToRenderPerBatch: 8`, and `windowSize: 10`) to guarantee extreme performance and prevent re-rendering UI lockups.
   - **Image Caching:** Utilizing `expo-image` over the standard `Image` component to actively cache course thumbnails.

4. **Network & Error Resilience (`lib/api.ts`)**
   - Implemented a custom API fetch wrapper that automatically retries requests up to 2 times with backoff before failing. 
   - Uses an `AbortController` to handle 10-second request timeouts.
   - Intercepts 401 Unauthorized errors to automatically attempt background token refreshing.
   - Utilizes offline detection (`@react-native-community/netinfo`) to render an **OfflineBanner** when network connectivity drops.

5. **Bidirectional WebView Communication (`app/webview.tsx`)**
   - The React Native app injects contextual course data directly into the WebView using `injectedJavaScriptBeforeContentLoaded`. 
   - The WebView reports lesson interactions back to the native app via `window.ReactNativeWebView.postMessage()`, managed by the native `onMessage` handler.

6. **Native Features (Notifications & NetInfo)**
   - Smart local notifications (`expo-notifications`) trigger conditionally based on logic: immediately upon reaching 5+ bookmarks, and a recurring 24-hour reminder metric that overrides previous schedules upon app launch.

---

## Project Structure

```text
app/
  _layout.tsx          Root layout, auth guard, context providers
  (auth)/              Login + Register screens
  (tabs)/              Bottom tab screens (Courses, Bookmarks, Profile)
  course/[id].tsx      Course detail native screen
  webview.tsx          Embedded WebView content viewer
context/
  AuthContext.tsx      Auth state + SecureStore token management
  CourseContext.tsx    Courses, bookmarks, enrolled — AsyncStorage persistence
lib/
  api.ts               Fetch wrapper with retry logic + token refresh
  notifications.ts     Expo-notifications helper module
hooks/
  useNetworkStatus.ts  NetInfo-based offline detection hook
components/
  CourseCard.tsx       Memoized course list item
  OfflineBanner.tsx    Red banner shown when device is offline
types/
  index.ts             Comprehensive TypeScript interfaces (Strict Mode)
```

---

## Known Issues / Limitations

1. **LegendList:** The assignment recommended `LegendList`, however, standard `FlatList` was implemented with significant performance memoization instead to avoid introducing excess external dependencies out of the React Native core.
2. **Profile Picture Update:** The UI for updating profile pictures exists, but the associated multi-part upload API call requires a specific structure on the `freeapi` mock backend that isn't fully supported.
3. **Pagination limitations:** The mock `freeapi`/randomproducts endpoint returns the same conceptual data repeatedly, so true `loadMore` pagination will essentially cycle the same placeholder content.
4. **Android 13+ Notifications:** Requires explicit system permission granted by the user on startup. This is handled gracefully with an active permission request.
5. **Orientation:** The app gracefully handles basic screen resizing for landscape, but layouts are explicitly optimized for Portrait mode as per standard LMS mobile patterns.
