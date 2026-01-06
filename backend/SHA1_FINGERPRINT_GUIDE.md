# 🔑 Android SHA-1 Fingerprint - Complete Guide

## Method 1: Android Studio Gradle (Easiest) ⭐

### Step-by-Step:

1. **Open Android Studio**
   - Open your LabDash Android project
   - Location: `C:\Users\shrey\AndroidStudioProjects\app`

2. **Open Gradle Panel**
   ```
   - Look at RIGHT side of Android Studio window
   - Click on "Gradle" tab (looks like elephant icon)
   - If not visible: View → Tool Windows → Gradle
   ```

3. **Navigate in Gradle Tree**
   ```
   📁 app
    └── 📁 Tasks
         └── 📁 android
              └── 🔧 signingReport  ← DOUBLE CLICK THIS
   ```

4. **View Output**
   ```
   - Bottom me 'Run' tab automatically open hoga
   - Output me ye dikhega:

   Variant: debug
   Config: debug
   Store: C:\Users\shrey\.android\debug.keystore
   Alias: AndroidDebugKey
   MD5: XX:XX:XX:...
   SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD  ← COPY THIS
   SHA-256: ...
   ```

5. **Copy SHA-1**
   - SHA1 wali line ko copy karo
   - Format: `AA:BB:CC:DD:EE:FF:...` (20 pairs)

---

## Method 2: Terminal Command (Alternative)

### Option A: Android Studio Terminal

1. Android Studio me bottom pe **Terminal** tab click karo (or press `Alt+F12`)

2. Run command:
   ```bash
   cd C:\Users\shrey\AndroidStudioProjects\app
   .\gradlew signingReport
   ```

3. Output me SHA1 fingerprint dikhega

### Option B: PowerShell

1. Open PowerShell
2. Navigate to project:
   ```powershell
   cd C:\Users\shrey\AndroidStudioProjects\app
   .\gradlew.bat signingReport
   ```

3. SHA1 copy karo from output

---

## Method 3: keytool Command (Manual)

### Debug Keystore (Development):

```powershell
keytool -keystore "$env:USERPROFILE\.android\debug.keystore" -list -v -alias androiddebugkey -storepass android -keypass android
```

**Default password:** `android`

### Production Keystore (Release):

```powershell
keytool -keystore "path\to\your\release.keystore" -list -v -alias your-key-alias
```

Enter your keystore password when prompted.

---

## ⚠️ Common Issues

### Issue 1: "keytool is not recognized"
**Solution:** Add Java to PATH or use full path:
```powershell
& "C:\Program Files\Android\Android Studio\jbr\bin\keytool" -keystore ...
```

### Issue 2: Gradle task not showing
**Solution:** 
- Click Gradle refresh button (sync icon)
- File → Invalidate Caches / Restart

### Issue 3: Empty output
**Solution:**
- Make sure you're in correct directory
- Try `./gradlew clean` first, then `./gradlew signingReport`

---

## 🎯 Next Steps (After Getting SHA-1)

### 1. Go to Google Cloud Console
https://console.cloud.google.com/apis/credentials

### 2. Create OAuth 2.0 Client ID

- Click "Create Credentials" → "OAuth 2.0 Client ID"
- Application type: **Android**
- Name: `LabDash Android`
- Package name: `com.example.labdash` (from your app's build.gradle)
- SHA-1: Paste the fingerprint you copied
- Click **Create**

### 3. Copy Client ID

After creation, you'll get:
- **Client ID**: `xxxxx-xxxxx.apps.googleusercontent.com`

This is what you need for Android app!

### 4. Configure in Supabase

1. Go to: https://app.supabase.com/project/fnouqfyhksvxzarhxljz/auth/providers
2. Enable **Google** provider
3. Paste the **Client ID** and **Client Secret** (from Web OAuth, not Android)

---

## 📱 For Android App

You'll need **both**:

1. **Web OAuth Client** (for Supabase backend)
   - Type: Web application
   - Used in backend

2. **Android OAuth Client** (for Android app)
   - Type: Android
   - Uses SHA-1 fingerprint
   - Used in your Android app code

---

## Quick Reference

| Method | Difficulty | Time |
|--------|-----------|------|
| Gradle signingReport | Easy | 30 sec |
| Terminal gradlew | Medium | 1 min |
| keytool command | Hard | 2 min |

**Recommended:** Use Gradle signingReport (Method 1) ⭐

---

## 🚀 Summary

1. ✅ Open Android Studio
2. ✅ Gradle → app → Tasks → android → signingReport
3. ✅ Copy SHA-1 from output
4. ✅ Create Android OAuth Client in Google Cloud Console
5. ✅ Use Client ID in Android app

Done! 🎉
