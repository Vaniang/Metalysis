// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- PASTE YOUR FIREBASE CONFIG HERE ---
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.getElementById('btnLoader');
const errorMsg = document.getElementById('errorMessage');
const togglePassword = document.getElementById('togglePassword');

// 1. Handle Login Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset UI
    errorMsg.textContent = "";
    setLoading(true);

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // Step A: Login with Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Auth successful. Checking role...");

        // Step B: Check Firestore for User Role
        // We assume you have a collection 'users' where document ID matches the Auth UID
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;

            // Step C: Redirect based on Role
            switch(role) {
                case 'ADMIN':
                    window.location.href = "admin_dashboard.html";
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
            errorMsg.textContent = "Account exists, but no user profile found in database.";
            setLoading(false);
        }

    } catch (error) {
        console.error(error);
        // Handle common errors
        if (error.code === 'auth/invalid-credential') {
            errorMsg.textContent = "Incorrect email or password.";
        } else if (error.code === 'auth/too-many-requests') {
            errorMsg.textContent = "Too many failed attempts. Please try again later.";
        } else {
            errorMsg.textContent = "Login failed: " + error.message;
        }
        setLoading(false);
    }
});

// 2. Toggle Password Visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye-slash');
});

// Helper: Loading State
function setLoading(isLoading) {
    if (isLoading) {
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
    } else {
        loginBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    }
}
