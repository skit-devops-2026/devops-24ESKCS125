// ===============================================
// STUDY PLANNER - DYNAMIC DASHBOARD JAVASCRIPT
// Connects Tasks, Subjects, Exams, Notes, and User
// ===============================================

// 1. QUOTES OF THE DAY
const quotes = [
    "Success is the sum of small efforts, repeated day in and day out.",
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "Small progress is still progress.",
    "Believe you can and you're halfway there.",
    "Your future is created by what you do today.",
    "Focus on your goals, not your obstacles.",
    "Study today, succeed tomorrow."
];

// 2. USER GREETING & DATE
function initHeaderAndGreeting() {
    // Current date
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    const dateElement = document.getElementById("todayDate");
    if (dateElement) {
        dateElement.innerText = today.toLocaleDateString("en-IN", options);
    }

    // Dynamic greeting based on hour of day
    const hour = today.getHours();
    let timeGreeting = "Good Morning";
    if (hour >= 12 && hour < 17) {
        timeGreeting = "Good Afternoon";
    } else if (hour >= 17) {
        timeGreeting = "Good Evening";
    }

    // Get current user name if logged in
    let userName = "Student";
    try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && currentUser.name) {
            userName = currentUser.name;
        }
    } catch (e) {}

    const greetingElement = document.getElementById("greetingTitle");
    if (greetingElement) {
        greetingElement.innerText = `${timeGreeting}, ${userName}! 👋`;
    }

    const userNameElement = document.getElementById("userNameDisplay");
    if (userNameElement) {
        userNameElement.innerText = userName;
    }

    // Random quote
    const quoteElement = document.getElementById("dailyQuote");
    if (quoteElement) {
        const randIndex = Math.floor(Math.random() * quotes.length);
        quoteElement.innerText = `"${quotes[randIndex]}"`;
    }
}

// 3. TODAY'S TASK PROGRESS
function renderTaskProgress() {
    const tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const remaining = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const completedEl = document.getElementById("completedTasks");
    const totalDisplayEl = document.getElementById("totalTasksDisplay");
    const taskBarEl = document.getElementById("taskProgress");
    const percentEl = document.getElementById("taskProgressPercent");
    const remainingEl = document.getElementById("remainingTasks");

    if (completedEl) completedEl.innerText = completed;
    if (totalDisplayEl) totalDisplayEl.innerText = `/ ${total} Tasks Completed`;
    if (percentEl) percentEl.innerText = `${progress}%`;
    if (taskBarEl) taskBarEl.style.width = `${progress}%`;

    if (remainingEl) {
        if (total === 0) {
            remainingEl.innerText = "No tasks yet. Click View Tasks to add your first task!";
        } else if (remaining === 0) {
            remainingEl.innerText = "🎉 All tasks completed! Great job!";
        } else {
            remainingEl.innerText = `${remaining} task${remaining > 1 ? "s" : ""} remaining`;
        }
    }
}

// 4. SUBJECT PROGRESS
function renderSubjectProgress() {
    const container = document.getElementById("subjectProgressList");
    if (!container) return;

    const subjects = JSON.parse(localStorage.getItem("studySubjects")) || [];

    if (subjects.length === 0) {
        container.innerHTML = `
            <div style="padding: 20px 0; text-align: center; color: #777;">
                <p style="font-size: 14px; margin-bottom: 10px;">No subjects added yet.</p>
                <a href="subjects.html?action=add" style="display: inline-block; padding: 7px 15px; background: #5865d8; color: white; border-radius: 6px; text-decoration: none; font-size: 13px;">
                    + Add Subject
                </a>
            </div>
        `;
        return;
    }

    // Take top 3 subjects
    const topSubjects = subjects.slice(0, 3);
    let html = "";

    topSubjects.forEach(subjectName => {
        const topics = JSON.parse(localStorage.getItem("topics_" + subjectName)) || [];
        const total = topics.length;
        const done = topics.filter(t => t.completed === true).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        html += `
            <div class="subject" style="cursor: pointer;" onclick="openSubject('${encodeURIComponent(subjectName)}')">
                <div class="subject-info">
                    <span style="font-weight: 500;">${subjectName}</span>
                    <span>${pct}%</span>
                </div>
                <div class="progress">
                    <div class="progress-bar" style="width: ${pct}%;"></div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Global helper to open subject details
window.openSubject = function (encodedName) {
    const name = decodeURIComponent(encodedName);
    localStorage.setItem("selectedSubject", name);
    window.location.href = "subject-details.html";
};

// 5. UPCOMING EXAM
function renderUpcomingExam() {
    const container = document.getElementById("upcomingExamContainer");
    if (!container) return;

    const exams = JSON.parse(localStorage.getItem("examList")) || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter exams occurring today or in the future
    const upcoming = exams
        .map(e => {
            const examDate = new Date(e.date);
            examDate.setHours(0, 0, 0, 0);
            const daysLeft = Math.round((examDate - today) / (1000 * 60 * 60 * 24));
            return { ...e, daysLeft };
        })
        .filter(e => e.daysLeft >= 0)
        .sort((a, b) => a.daysLeft - b.daysLeft);

    if (upcoming.length === 0) {
        container.innerHTML = `
            <div style="padding: 15px 0; text-align: center; color: #777;">
                <p style="font-size: 14px; margin-bottom: 12px;">No upcoming exams scheduled.</p>
                <a href="exam-tracker.html?action=add" class="view-button" style="display: inline-block; width: auto; padding: 8px 18px;">
                    + Schedule Exam
                </a>
            </div>
        `;
        return;
    }

    const nextExam = upcoming[0];
    const examDateObj = new Date(nextExam.date);
    const dateFormatted = examDateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long"
    });

    const daysText = nextExam.daysLeft === 0 ? "Today" : nextExam.daysLeft;
    const labelText = nextExam.daysLeft === 0 ? "Exam Day!" : (nextExam.daysLeft === 1 ? "Day Left" : "Days Left");

    container.innerHTML = `
        <div class="exam-content">
            <div>
                <h3>${nextExam.subject || nextExam.name}</h3>
                <p>${nextExam.name || nextExam.subject}</p>
                <span class="exam-date">📅 ${dateFormatted}</span>
            </div>
            <div class="days-left">
                <strong>${daysText}</strong>
                <span>${labelText}</span>
            </div>
        </div>
        <a href="exam-tracker.html" class="view-button">
            View Exam
        </a>
    `;
}

// 6. HIGH PRIORITY TASKS
function renderHighPriorityTasks() {
    const container = document.getElementById("highPriorityContainer");
    if (!container) return;

    const tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
    const highPriority = tasks.filter(t => t.priority === "High" && t.status !== "Completed");

    if (highPriority.length === 0) {
        // Fallback: pending tasks or caught up
        const pending = tasks.filter(t => t.status !== "Completed");
        if (pending.length === 0) {
            container.innerHTML = `
                <div style="padding: 20px 0; text-align: center; color: #777;">
                    <p style="font-size: 14px; margin-bottom: 10px;">🎉 You're all caught up!</p>
                    <a href="task.html?action=add" style="color: #5865d8; text-decoration: none; font-size: 13px; font-weight: 600;">
                        + Add a new task
                    </a>
                </div>
            `;
            return;
        }

        // Show pending tasks
        let html = "";
        pending.slice(0, 3).forEach(task => {
            html += `
                <div class="priority-task" style="cursor: pointer;" onclick="window.location.href='task.html'">
                    <div class="priority-dot" style="background: #3b82f6;"></div>
                    <div>
                        <h3>${task.title}</h3>
                        <p>${task.subject ? task.subject + " • " : ""}Due: ${task.date || "Soon"}</p>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
        return;
    }

    let html = "";
    highPriority.slice(0, 3).forEach(task => {
        html += `
            <div class="priority-task" style="cursor: pointer;" onclick="window.location.href='task.html'">
                <div class="priority-dot"></div>
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.subject ? task.subject + " • " : ""}Due: ${task.date || "Today"}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// 7. INITIALIZE DASHBOARD
function initDashboard() {
    initHeaderAndGreeting();
    renderTaskProgress();
    renderSubjectProgress();
    renderUpcomingExam();
    renderHighPriorityTasks();

    // Listen for storage changes from other tabs/pages
    window.addEventListener("storage", function () {
        renderTaskProgress();
        renderSubjectProgress();
        renderUpcomingExam();
        renderHighPriorityTasks();
    });
}

// Run on load and bfcache restore
window.addEventListener("pageshow", initDashboard);
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDashboard);
} else {
    initDashboard();
}
