// 1. Import specific SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfhfZ_c8wbTTviu4MrhvbRknqzyBkzI_s",
  authDomain: "metalysis-f38ef.firebaseapp.com",
  projectId: "metalysis-f38ef",
  storageBucket: "metalysis-f38ef.firebasestorage.app",
  messagingSenderId: "666983988939",
  appId: "1:666983988939:web:f70937a2572ed08015a54e",
  measurementId: "G-96ZPLMV4J7"
};

// 3. Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 4. DOM Elements
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMessage');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.getElementById('btnLoader');

// 5. Handle Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        errorMsg.textContent = "";
        setLoading(true);

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // STEP A: Authenticate
            console.log("Attempting login for:", email);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log("Login success! UID:", user.uid);
            // alert("Step 1 Success: Logged in as " + email); // Uncomment if needed

            // STEP B: Check Database
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role;
                
                console.log("Database Role found:", role);
                
                // STEP C: Redirect
                if (role === 'ADMIN') {
                    // alert("Redirecting to Admin Dashboard...");
                    window.location.href = "admin/dashboard.html";
                } 
                else if (role === 'TABULATION') {
                    window.location.href = "tabulation_dashboard.html"; // Make sure this file exists!
                }
                else if (role === 'RSAC') {
                    window.location.href = "rsac_dashboard.html"; // Make sure this file exists!
                }
                else if (role === 'SOCIAL') {
                    window.location.href = "social_dashboard.html"; // Make sure this file exists!
                }
                else {
                    throw new Error("User has no valid role assigned.");
                }
            } else {
                console.error("User document missing in Firestore 'users' collection");
                throw new Error("Account exists, but your DATA is missing in the 'users' database collection.");
            }

        } catch (error) {
            console.error("Full Error Object:", error);
            
            // Show human-readable error
            let message = error.message;
            if (error.code === 'auth/invalid-credential') message = "Wrong email or password.";
            if (error.code === 'auth/user-not-found') message = "User not found.";
            
            errorMsg.textContent = message;
            alert("Login Failed: " + message); // Popup to ensure you see it
            setLoading(false);
        }
    });
}

// Helper function
function setLoading(isLoading) {
    if (loginBtn) {
        loginBtn.disabled = isLoading;
        if (btnText) btnText.style.display = isLoading ? 'none' : 'inline-block';
        if (btnLoader) btnLoader.style.display = isLoading ? 'inline-block' : 'none';
    }
}
