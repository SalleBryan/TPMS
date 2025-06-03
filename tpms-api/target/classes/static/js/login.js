// API Configuration
const API_BASE_URL = "http://localhost:8080"
const API_ENDPOINTS = {
  login: "/api/auth/login",
}

// DOM Elements
const loginForm = document.getElementById("loginForm")
const usernameInput = document.getElementById("username")
const passwordInput = document.getElementById("password")
const rememberMeCheckbox = document.getElementById("rememberMe")
const submitBtn = document.getElementById("submitBtn")
const btnText = document.querySelector(".btn-text")
const btnLoader = document.querySelector(".btn-loader")
const successMessage = document.getElementById("successMessage")
const errorMessage = document.getElementById("errorMessage")
const togglePasswordBtn = document.querySelector(".toggle-password")

// Error message elements
const usernameError = document.getElementById("usernameError")
const passwordError = document.getElementById("passwordError")

// Utility Functions
function showElement(element) {
  element.classList.remove("hidden")
}

function hideElement(element) {
  element.classList.add("hidden")
}

function setLoadingState(isLoading) {
  if (isLoading) {
    submitBtn.disabled = true
    hideElement(btnText)
    showElement(btnLoader)
  } else {
    submitBtn.disabled = false
    showElement(btnText)
    hideElement(btnLoader)
  }
}

function clearMessages() {
  hideElement(successMessage)
  hideElement(errorMessage)
  usernameError.textContent = ""
  passwordError.textContent = ""
}

function showSuccessMessage(message) {
  successMessage.textContent = message
  showElement(successMessage)
  hideElement(errorMessage)
}

function showErrorMessage(message) {
  errorMessage.textContent = message
  showElement(errorMessage)
  hideElement(successMessage)
}

function showFieldError(field, message) {
  const errorElement = document.getElementById(`${field}Error`)
  if (errorElement) {
    errorElement.textContent = message
  }
}

// Validation Functions
function validateUsername(username) {
  if (!username.trim()) {
    showFieldError("username", "Username is required")
    return false
  }
  if (username.length < 3) {
    showFieldError("username", "Username must be at least 3 characters")
    return false
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showFieldError("username", "Username can only contain letters, numbers, and underscores")
    return false
  }
  return true
}

function validatePassword(password) {
  if (!password) {
    showFieldError("password", "Password is required")
    return false
  }
  if (password.length < 6) {
    showFieldError("password", "Password must be at least 6 characters")
    return false
  }
  return true
}

function validateForm() {
  const username = usernameInput.value.trim()
  const password = passwordInput.value

  clearMessages()

  const isUsernameValid = validateUsername(username)
  const isPasswordValid = validatePassword(password)

  return isUsernameValid && isPasswordValid
}

// Token Management
function saveAuthToken(token, remember = false) {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem("authToken", token)
  storage.setItem("tokenTimestamp", Date.now().toString())

  // If remember me is checked, also save to localStorage
  if (remember) {
    localStorage.setItem("rememberMe", "true")
  }
}

function getAuthToken() {
  return localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
}

function clearAuthToken() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("tokenTimestamp")
  localStorage.removeItem("rememberMe")
  localStorage.removeItem("username")
  sessionStorage.removeItem("authToken")
  sessionStorage.removeItem("tokenTimestamp")
}

function isTokenExpired() {
  const timestamp = localStorage.getItem("tokenTimestamp") || sessionStorage.getItem("tokenTimestamp")
  if (!timestamp) return true

  const tokenAge = Date.now() - Number.parseInt(timestamp)
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours

  return tokenAge > maxAge
}

// API Functions
async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.login}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("Login API Error:", error)

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Unable to connect to server. Please check if the backend is running on localhost:8080")
    }

    throw error
  }
}

// Event Handlers
async function handleLogin(event) {
  event.preventDefault()

  if (!validateForm()) {
    return
  }

  const credentials = {
    username: usernameInput.value.trim(),
    password: passwordInput.value,
  }

  const rememberMe = rememberMeCheckbox.checked

  setLoadingState(true)
  clearMessages()

  try {
    const response = await loginUser(credentials)

    // Handle successful login
    if (response.token || response.accessToken || response.authToken) {
      const token = response.token || response.accessToken || response.authToken

      // Save token and user info
      saveAuthToken(token, rememberMe)

      if (response.username || credentials.username) {
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem("username", response.username || credentials.username)
      }

      showSuccessMessage("Login successful! Redirecting to dashboard...")

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = "/dashboard.html"
      }, 1500)
    } else {
      throw new Error("Invalid response format from server")
    }
  } catch (error) {
    console.error("Login error:", error)

    let errorMsg = "Login failed. Please try again."

    if (error.message.includes("401") || error.message.includes("Unauthorized")) {
      errorMsg = "Invalid username or password"
    } else if (error.message.includes("403") || error.message.includes("Forbidden")) {
      errorMsg = "Account access denied. Please contact support."
    } else if (error.message.includes("404")) {
      errorMsg = "Login service not found. Please contact support."
    } else if (error.message.includes("500")) {
      errorMsg = "Server error. Please try again later."
    } else if (error.message.includes("connect") || error.message.includes("localhost:8080")) {
      errorMsg = "Cannot connect to server. Please ensure the backend is running."
    } else if (error.message) {
      errorMsg = error.message
    }

    showErrorMessage(errorMsg)
  } finally {
    setLoadingState(false)
  }
}

function handlePasswordToggle() {
  const passwordField = document.getElementById("password")
  const toggleIcon = togglePasswordBtn.querySelector("i")

  if (passwordField.type === "password") {
    passwordField.type = "text"
    toggleIcon.classList.remove("fa-eye")
    toggleIcon.classList.add("fa-eye-slash")
  } else {
    passwordField.type = "password"
    toggleIcon.classList.remove("fa-eye-slash")
    toggleIcon.classList.add("fa-eye")
  }
}

// Real-time validation
function handleUsernameInput() {
  const username = usernameInput.value.trim()
  if (username && !validateUsername(username)) {
    // Error message is already shown by validateUsername
  } else {
    usernameError.textContent = ""
  }
}

function handlePasswordInput() {
  const password = passwordInput.value
  if (password && !validatePassword(password)) {
    // Error message is already shown by validatePassword
  } else {
    passwordError.textContent = ""
  }
}

// Check if user is already logged in
function checkExistingAuth() {
  const token = getAuthToken()
  const username = localStorage.getItem("username") || sessionStorage.getItem("username")

  if (token && !isTokenExpired() && username) {
    // User is already logged in, redirect to dashboard
    window.location.href = "dashboard.html"
  }
}

// Load saved username if "Remember Me" was checked
function loadSavedCredentials() {
  const rememberMe = localStorage.getItem("rememberMe") === "true"
  const savedUsername = localStorage.getItem("username")

  if (rememberMe && savedUsername) {
    usernameInput.value = savedUsername
    rememberMeCheckbox.checked = true
  }
}

// Initialize
function init() {
  // Check if already authenticated
  checkExistingAuth()

  // Load saved credentials
  loadSavedCredentials()

  // Event listeners
  loginForm.addEventListener("submit", handleLogin)
  togglePasswordBtn.addEventListener("click", handlePasswordToggle)

  // Real-time validation
  usernameInput.addEventListener("input", handleUsernameInput)
  passwordInput.addEventListener("input", handlePasswordInput)

  // Clear errors when user starts typing
  usernameInput.addEventListener("focus", () => {
    usernameError.textContent = ""
  })

  passwordInput.addEventListener("focus", () => {
    passwordError.textContent = ""
  })

  // Handle Enter key in form fields
  usernameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      passwordInput.focus()
    }
  })

  passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleLogin(e)
    }
  })

  console.log("Login page initialized")
}

// Start the application when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}

// Export functions for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validateUsername,
    validatePassword,
    validateForm,
    saveAuthToken,
    getAuthToken,
    clearAuthToken,
    isTokenExpired,
  }
}
