// ===============================================
// SETTINGS JAVASCRIPT
// ===============================================

function loadProfile() {
    try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
        const nameInput = document.getElementById("profileName");
        const emailInput = document.getElementById("profileEmail");

        if (nameInput) nameInput.value = currentUser.name || "Student";
        if (emailInput) emailInput.value = currentUser.email || "student@example.com";
    } catch (e) {}
}

function saveProfile(event) {
    if (event) event.preventDefault();

    const name = document.getElementById("profileName").value.trim();
    const email = document.getElementById("profileEmail").value.trim();

    if (!name || !email) {
        alert("Please enter both your name and email.");
        return;
    }

    const updatedUser = { name, email };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    alert("Profile saved successfully! Changes will appear across your dashboard.");
}

function initTheme() {
    const isDark = localStorage.getItem("theme") === "dark";
    if (isDark) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

function loadStats() {
    const tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
    const subjects = JSON.parse(localStorage.getItem("studySubjects")) || [];
    const exams = JSON.parse(localStorage.getItem("examList")) || [];
    const notes = JSON.parse(localStorage.getItem("studyNotes")) || [];

    const tasksEl = document.getElementById("statTasks");
    const subjectsEl = document.getElementById("statSubjects");
    const examsEl = document.getElementById("statExams");
    const notesEl = document.getElementById("statNotes");

    if (tasksEl) tasksEl.innerText = tasks.length;
    if (subjectsEl) subjectsEl.innerText = subjects.length;
    if (examsEl) examsEl.innerText = exams.length;
    if (notesEl) notesEl.innerText = notes.length;
}

function clearAllData() {
    const confirmed = confirm("Are you sure you want to clear all your local study data? This will reset tasks, notes, exams, and subjects.");
    if (!confirmed) return;

    localStorage.removeItem("studyTasks");
    localStorage.removeItem("studySubjects");
    localStorage.removeItem("examList");
    localStorage.removeItem("studyNotes");
    localStorage.removeItem("focusSessions");
    localStorage.removeItem("studyPlannerCalendarEvents");

    alert("Local workspace data cleared.");
    loadStats();
}

document.addEventListener("DOMContentLoaded", function () {
    loadProfile();
    initTheme();
    loadStats();
});
