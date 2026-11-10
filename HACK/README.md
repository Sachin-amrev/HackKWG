# KWG Web & Android APK Hybrid Solution

A robust, isolated hybrid application for **`https://kwg08.com/#/register?invitationCode=943E651356`** that fulfills the following specifications:

1. **Normal Web Version (Desktop / Mobile Browsers)**:
   - Leaves the external website completely untouched.
   - Does **NOT** disable, hide, replace, or interfere with Login or Sign Up buttons.
   - Works normally in standard browsers.

2. **Android APK Version (Packaged WebView App)**:
   - Automatically detects execution inside the Android APK / WebView wrapper.
   - Implements a clean state-based controller:
     - **Initial State (`signupRequired = true`)**: Sign Up is permitted, Login action is intercepted/blocked with a user alert card.
     - **Post-Registration State (`signupRequired = false`)**: Once registration is completed, Login is permanently unlocked and fully clickable.
   - Operates at the native wrapper and WebViewClient layer to bypass cross-origin DOM restrictions safely.

---

## 📁 Project Structure

```
.
├── public/
│   └── index.html                       # Web entrypoint (Zero modifications in standard browser)
├── server.js                            # Local Node.js server for web testing
├── package.json                         # Node package configuration
├── APK_CONFIGURATION.md                 # Detailed APK configuration and build guide
├── android/                             # Complete Android Studio Project
│   ├── build.gradle                     # Top-level Gradle config
│   ├── settings.gradle                  # Gradle settings
│   ├── gradle.properties                # Build properties
│   └── app/
│       ├── build.gradle                 # Android App module dependencies & SDK config
│       ├── proguard-rules.pro           # Proguard keep rules for JavascriptInterface
│       └── src/main/
│           ├── AndroidManifest.xml      # App permissions, intent filters, & hardware config
│           ├── java/com/kwg/app/
│           │   ├── MainActivity.kt      # WebView controller, route interceptor & overlay logic
│           │   ├── AppStateManager.kt   # Persistent state machine (signupRequired)
│           │   └── WebAppInterface.kt   # Native Android <-> JS bridge
│           └── res/
│               ├── layout/
│               │   └── activity_main.xml # Layout with WebView + Native Overlay & Alert Modal
│               ├── values/
│               │   ├── strings.xml      # Localized strings
│               │   ├── colors.xml       # Color definitions
│               │   └── themes.xml       # App theme definitions
│               └── drawable/
│                   └── banner_bg.xml    # Native overlay styling
```

---

## ⚙️ State-Based Flow Diagram

```
                    ┌────────────────────────┐
                    │    Application Start   │
                    └───────────┬────────────┘
                                │
                  ┌─────────────┴─────────────┐
                  ▼                           ▼
        [ Standard Browser ]          [ Android APK ]
                  │                           │
                  │              [ signupRequired = true ]
                  │                           │
                  │               ┌───────────┴───────────┐
                  │               ▼                       ▼
                  │         User clicks Sign Up     User clicks Login
                  │               │                       │
                  │          (Allowed)                (Blocked)
                  │               │                       │
                  │      Registration Success       Shows Native Alert:
                  │               │               "Sign Up Required First"
                  │               ▼                       │
                  │   [ signupRequired = false ]          │
                  │               │                       │
                  │       (Login Unlocked) ◄──────────────┘
                  │               │
                  ▼               ▼
          Normal Website    Full App Access
```

---

## 🚀 How to Run and Test

### 1. Running the Web Version
```bash
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in any browser (Chrome, Safari, Firefox). Notice that it loads the standard registration page with zero restrictions.

### 2. Building the Android APK
1. Open the `android/` directory in **Android Studio** (or use Gradle CLI if installed).
2. Sync the project with Gradle files.
3. Build the APK via **Build > Build Bundle(s) / APK(s) > Build APK(s)** or run directly on an Android device/emulator.
4. In the APK:
   - Attempting to click Login or navigate to `#/login` triggers the native overlay block.
   - Completing registration updates state (`signupRequired = false`) and unlocks Login permanently.
