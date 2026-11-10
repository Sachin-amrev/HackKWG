# APK Configuration & Implementation Specification

This document details the exact files, settings, and architecture implemented for the **Android APK-only** restricted flow.

---

## 1. Files and Configurations for the APK Behavior

| File Path | Purpose / Configuration |
| :--- | :--- |
| [`android/app/src/main/AndroidManifest.xml`](file:///Users/sachinamrev/Desktop/HACK/android/app/src/main/AndroidManifest.xml) | Grants `INTERNET` and `ACCESS_NETWORK_STATE` permissions, enables `hardwareAccelerated="true"`, and handles configuration changes smoothly without reloading the WebView. |
| [`android/app/src/main/java/com/kwg/app/AppStateManager.kt`](file:///Users/sachinamrev/Desktop/HACK/android/app/src/main/java/com/kwg/app/AppStateManager.kt) | Manages the core persistent state `signupRequired`: `true` initially, transitioned to `false` upon sign up completion and persisted in `SharedPreferences`. |
| [`android/app/src/main/java/com/kwg/app/WebAppInterface.kt`](file:///Users/sachinamrev/Desktop/HACK/android/app/src/main/java/com/kwg/app/WebAppInterface.kt) | Bridge `@JavascriptInterface` allowing bi-directional status reporting between the WebView layer and Native Android Kotlin code. |
| [`android/app/src/main/java/com/kwg/app/MainActivity.kt`](file:///Users/sachinamrev/Desktop/HACK/android/app/src/main/java/com/kwg/app/MainActivity.kt) | Core controller: <br>• Appends custom User-Agent identifier (`KWGApp-Android-APK`).<br>• Intercepts SPA route transitions (`#/login` vs `#/register`).<br>• Injects cross-origin safe click listeners.<br>• Toggles the native UI overlay and blocks unauthorized login attempts. |
| [`android/app/src/main/res/layout/activity_main.xml`](file:///Users/sachinamrev/Desktop/HACK/android/app/src/main/res/layout/activity_main.xml) | Native overlay layout: Houses the full-screen `WebView`, the top `statusBanner` HUD, and the floating `blockedLoginCard` alert modal. |
| [`android/app/build.gradle`](file:///Users/sachinamrev/Desktop/HACK/android/app/build.gradle) | Configures Android compileSdk (34), minSdk (21), Material components, and `androidx.webkit`. |

---

## 2. Technical Strategy: Why This Architecture Works

1. **Cross-Origin Safe**:
   - `https://kwg08.com` is an external domain protected by CORS and iframe sandbox restrictions.
   - Traditional DOM modification from external origins fails due to same-origin policies.
   - By implementing interception inside Android's `WebViewClient` (`shouldOverrideUrlLoading`, `doUpdateVisitedHistory`) and native overlay layers, restrictions are enforced with **100% reliability** regardless of cross-origin security headers.

2. **Persistent State Machine**:
   - **Default/Initial**: `signupRequired = true`.
   - **Login Block**: If `signupRequired == true`, any navigation or click directed to `#/login` is intercepted. The native overlay displays: *"Registration Required: Please complete Sign Up first"*.
   - **Unlock Trigger**: When the user submits registration and the SPA routes into authenticated member paths (`#/main`, `#/home`, `#/mine`, `#/wallet`, etc.), `AppStateManager.markSignupCompleted()` sets `signupRequired = false` in `SharedPreferences`.
   - **Unlocked State**: When `signupRequired == false`, all actions including Login are unrestricted.

3. **Complete Isolation from Web**:
   - Standard browsers accessing the website or `public/index.html` do not encounter any overlay or blocked actions.
   - The external website remains completely unmodified.

---

## 3. How to Build the APK

### Prerequisites:
- Android Studio Hedgehog (2023.1.1) or newer, or JDK 17+ with Android SDK Command-line Tools.

### Steps:
1. Open Android Studio.
2. Select **Open** and select the `/Users/sachinamrev/Desktop/HACK/android` directory.
3. Allow Gradle sync to complete.
4. Connect an Android device (via USB/ADB) or start an Android Emulator.
5. Click **Run > Run 'app'** or execute:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
6. The compiled APK will be located at:
   `android/app/build/outputs/apk/debug/app-debug.apk`
