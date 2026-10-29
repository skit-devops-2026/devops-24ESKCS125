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
        const data = await res.json().catch(() => null);
        if (res.ok && data && data.user) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            window.location.href = "dashboard.html";
            return;
        }
    } catch (err) {}

    try {
        let users = JSON.parse(localStorage.getItem('studyUsers') || '[]');
        if (!Array.isArray(users)) users = [];
        const user = users.find(u => u.email === email);
        if (user) {
            if (user.password !== pass) {
                alert("Incorrect password. Please try again.");
                return;
            }
            localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
            window.location.href = "dashboard.html";
            return;
        }
    } catch (e) {}

    const defaultUser = { name: email.split('@')[0], email };
    localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    window.location.href = "dashboard.html";
    return;
}

const form = document.getElementById("loginForm");
if (form) form.addEventListener("submit", handleLogin);
