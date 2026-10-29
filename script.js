const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (togglePassword && password) {
    togglePassword.addEventListener("click", () => {
        password.type = password.type === "password" ? "text" : "password";
        togglePassword.textContent = password.type === "password" ? "👁️" : "🙈";
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const pass = document.getElementById("password").value;
    const loginBtn = document.getElementById("loginBtn");

    if (!email || !pass) {
        alert("Please enter your email and password.");
        return;
    }

    const originalText = loginBtn ? loginBtn.innerText : "Login";
    if (loginBtn) { loginBtn.disabled = true; loginBtn.innerText = "Logging in..."; }

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.user) {
            alert(data.error || "Login failed. Please sign up first.");
            return;
        }
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        window.location.href = "dashboard.html";
    } catch (err) {
        alert("Cannot connect to StudyPlanner. Start the Node.js server and MongoDB, then try again.");
    } finally {
        if (loginBtn) { loginBtn.disabled = false; loginBtn.innerText = originalText; }
    }
}

const form = document.getElementById("loginForm");
if (form) form.addEventListener("submit", handleLogin);
