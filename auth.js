// 1. Import the specific Firebase SDKs using CDN URLs (for browser support)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// 2. Your Specific Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfhfZ_c8wbTTviu4MrhvbRknqzyBkzI_s",
  authDomain: "metalysis-f38ef.firebaseapp.com",
  projectId: "metalysis-f38ef",
  storageBucket: "metalysis-f38ef.firebasestorage.app",
  messagingSenderId: "666983988939",
  appId: "1:666983988939:web:f70937a2572ed08015a54e",
  measurementId: "G-96ZPLMV4J7"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// 4. DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.getElementById('btnLoader');
const errorMsg = document.getElementById('errorMessage');
const togglePassword = document.getElementById('togglePassword');

// 5. Handle Login Submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        errorMsg.textContent = "";
        setLoading(true);

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // Step A: Login with Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("Auth successful. Checking role for UID:", user.uid);

            // Step B: Check Firestore for User Role
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role;
                console.log("Role found:", role);

                // Step C: Redirect based on Role
                // Note: Make sure these HTML files exist in your folder!
                switch(role) {
                    case 'ADMIN':
                        window.location.href = "admin/dashboard.html";
                        break;
                    case 'TABULATION':
                        window.location.href = "tabulation_dashboard.html";
                        break;
                    case 'RSAC':
                        window.location.href = "rsac_dashboard.html";
                        break;
                    case 'SOCIAL':
                        window.location.href = "social_dashboard.html";
                        break;
                    default:
                        errorMsg.textContent = "Error: No valid role assigned to this account.";
                        setLoading(false);
                }
            } else {
                console.error("No user document found in Firestore.");
                errorMsg.textContent = "Account exists, but no user profile found in database.";
                setLoading(false);
            }

        } catch (error) {
            console.error("Login Error:", error);
            if (error.code === 'auth/invalid-credential') {
                errorMsg.textContent = "Incorrect email or password.";
            } else if (error.code === 'auth/user-not-found') {
                errorMsg.textContent = "User not found.";
            } else if (error.code === 'auth/wrong-password') {
                errorMsg.textContent = "Invalid password.";
            } else {
                errorMsg.textContent = "Login failed: " + error.message;
            }
            setLoading(false);
        }
    });
}

// 6. Toggle Password Visibility
if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye-slash');
    });
}

// Helper: Loading State
function setLoading(isLoading) {
    if (isLoading) {
        if(loginBtn) loginBtn.disabled = true;
        if(btnText) btnText.style.display = 'none';
        if(btnLoader) btnLoader.style.display = 'inline-block';
    } else {
        if(loginBtn) loginBtn.disabled = false;
        if(btnText) btnText.style.display = 'inline-block';
        if(btnLoader) btnLoader.style.display = 'none';
    }
}
