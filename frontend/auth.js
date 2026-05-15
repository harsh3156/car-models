// auth.js  —  Vanilla JS frontend auth utility

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

function saveAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

function isLoggedIn() {
    return !!getToken();
}

function isAdmin() {
    const user = getUser();
    return user?.role === "admin";
}

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "/index.html";
}

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
    };
}

// Guard: redirect if not logged in
function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = "/index.html";
    }
}

// Guard: redirect if not admin
function requireAdmin() {
    if (!isLoggedIn() || !isAdmin()) {
        window.location.href = "/index.html";
    }
}

// USER LOGIN
async function loginUser(email, password) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
        saveAuth(data.token, data.user);
        window.location.href = "/dashboard.html";
    } else {
        alert(data.message || "Login failed.");
    }
}

// ADMIN LOGIN
async function loginAdmin(email, password) {
    const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
        saveAuth(data.token, data.admin);
        window.location.href = "/admin/dashboard.html";
    } else {
        alert(data.message || "Admin login failed.");
    }
}
