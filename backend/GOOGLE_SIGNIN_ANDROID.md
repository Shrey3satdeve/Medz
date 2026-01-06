# 🔐 Google Sign-In Integration - Android App

## ✅ Setup Complete

### Your Credentials:
```
Client ID: 349781407827-srb7p2ftu6h2g52m2t9cp4q0f6u8th2g.apps.googleusercontent.com
Package: com.example.labdash
SHA-1: D2:8E:FB:99:D4:77:8E:49:81:33:54:88:33:9E:41:0B:39:5A:5B:5C
```

---

## 📱 Android App Integration

### Step 1: Add Dependencies

In `app/build.gradle.kts`:

```kotlin
dependencies {
    // Supabase
    implementation("io.github.jan-tennert.supabase:postgrest-kt:2.0.0")
    implementation("io.github.jan-tennert.supabase:gotrue-kt:2.0.0")
    implementation("io.ktor:ktor-client-android:2.3.5")
    
    // Google Sign-In
    implementation("com.google.android.gms:play-services-auth:20.7.0")
}
```

### Step 2: Configure Supabase Client

Create `SupabaseClient.kt`:

```kotlin
package com.example.labdash

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.Auth
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.postgrest.Postgrest

object SupabaseClient {
    val client = createSupabaseClient(
        supabaseUrl = "https://fnouqfyhksvxzarhxljz.supabase.co",
        supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZub3VxZnloa3N2eHphcmh4bGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDkyNDQsImV4cCI6MjA3NzIyNTI0NH0.SG5lhK1PLCzInYQeapgL3YYkb49Oe_u-ktKDFtvtiAY"
    ) {
        install(Auth)
        install(Postgrest)
    }
}
```

### Step 3: Google Sign-In Implementation

Create `AuthViewModel.kt`:

```kotlin
package com.example.labdash

import android.content.Context
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.gotrue.providers.Google
import io.github.jan.supabase.gotrue.providers.builtin.IDToken
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class AuthViewModel : ViewModel() {
    
    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    val authState: StateFlow<AuthState> = _authState

    fun signInWithGoogle(context: Context) {
        viewModelScope.launch {
            try {
                _authState.value = AuthState.Loading

                val credentialManager = CredentialManager.create(context)
                
                val googleIdOption = GetGoogleIdOption.Builder()
                    .setFilterByAuthorizedAccounts(false)
                    .setServerClientId("349781407827-srb7p2ftu6h2g52m2t9cp4q0f6u8th2g.apps.googleusercontent.com")
                    .build()

                val request = GetCredentialRequest.Builder()
                    .addCredentialOption(googleIdOption)
                    .build()

                val result = credentialManager.getCredential(
                    request = request,
                    context = context,
                )

                val credential = result.credential
                val googleIdTokenCredential = GoogleIdTokenCredential
                    .createFrom(credential.data)

                val googleIdToken = googleIdTokenCredential.idToken

                // Sign in to Supabase with Google ID token
                SupabaseClient.client.auth.signInWith(IDToken) {
                    idToken = googleIdToken
                    provider = Google
                }

                val user = SupabaseClient.client.auth.currentUserOrNull()
                
                if (user != null) {
                    _authState.value = AuthState.Success(user)
                } else {
                    _authState.value = AuthState.Error("Sign-in failed")
                }

            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.message ?: "Unknown error")
            }
        }
    }

    fun signOut() {
        viewModelScope.launch {
            try {
                SupabaseClient.client.auth.signOut()
                _authState.value = AuthState.Idle
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.message ?: "Sign out failed")
            }
        }
    }

    fun getCurrentUser() {
        viewModelScope.launch {
            val user = SupabaseClient.client.auth.currentUserOrNull()
            if (user != null) {
                _authState.value = AuthState.Success(user)
            }
        }
    }
}

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    data class Success(val user: io.github.jan.supabase.gotrue.user.UserInfo) : AuthState()
    data class Error(val message: String) : AuthState()
}
```

### Step 4: UI Integration (Compose)

```kotlin
@Composable
fun LoginScreen(
    viewModel: AuthViewModel = viewModel()
) {
    val context = LocalContext.current
    val authState by viewModel.authState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.getCurrentUser()
    }

    when (val state = authState) {
        is AuthState.Idle, is AuthState.Loading -> {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                if (state is AuthState.Loading) {
                    CircularProgressIndicator()
                } else {
                    Button(onClick = { viewModel.signInWithGoogle(context) }) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                painter = painterResource(R.drawable.ic_google),
                                contentDescription = "Google"
                            )
                            Text("Sign in with Google")
                        }
                    }
                }
            }
        }

        is AuthState.Success -> {
            // Navigate to home screen
            HomeScreen(user = state.user)
        }

        is AuthState.Error -> {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text("Error: ${state.message}")
                Spacer(modifier = Modifier.height(16.dp))
                Button(onClick = { viewModel.signInWithGoogle(context) }) {
                    Text("Try Again")
                }
            }
        }
    }
}
```

### Step 5: Get User Info

```kotlin
// After successful login
val user = SupabaseClient.client.auth.currentUserOrNull()

user?.let {
    val email = it.email
    val name = it.userMetadata?.get("full_name")
    val avatar = it.userMetadata?.get("avatar_url")
    
    // Use user data
}
```

---

## 🔌 Backend API Calls with Auth Token

### Add Auth Token to API Requests

Update your `ApiClient.kt`:

```kotlin
object ApiClient {
    private const val BASE_URL = "http://10.0.2.2:5000/api/"

    private val client = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val token = runBlocking {
                SupabaseClient.client.auth.currentAccessTokenOrNull()
            }
            
            val request = if (token != null) {
                chain.request().newBuilder()
                    .addHeader("Authorization", "Bearer $token")
                    .build()
            } else {
                chain.request()
            }
            
            chain.proceed(request)
        }
        .build()

    val api: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
```

---

## 🧪 Testing

### Test Sign-In Flow:
1. Run app
2. Click "Sign in with Google"
3. Select Google account
4. App redirects back with user data

### Check if user is logged in:
```kotlin
val isLoggedIn = SupabaseClient.client.auth.currentUserOrNull() != null
```

---

## ⚠️ Important Notes

1. **Client ID**: Already configured in code above
2. **SHA-1**: Already registered in Google Cloud Console
3. **Supabase**: Automatically handles auth, no extra backend code needed!

---

## 🎯 Complete Flow

```
User clicks "Sign in with Google"
    ↓
Android shows Google account picker
    ↓
User selects account
    ↓
App gets ID token
    ↓
Supabase verifies token
    ↓
User logged in! ✅
    ↓
Auth token auto-attached to API calls
```

---

## 📊 User Data Available

After login, you get:
- Email
- Name
- Profile picture
- User ID (for database queries)

All managed by Supabase! 🚀

---

## 🔧 Troubleshooting

### Error: "Sign-in failed"
- Check Client ID in code
- Verify SHA-1 in Google Console
- Check package name matches

### Error: "Invalid credentials"
- Regenerate credentials in Google Console
- Clear app cache and retry

### Error: "Network error"
- Check backend is running
- Verify Supabase URL in code

---

Your Google Sign-In is ready! 🎉
