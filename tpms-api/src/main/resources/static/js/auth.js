// Authentication JavaScript

// Password toggle functionality
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const toggle = input.parentElement.querySelector(".password-toggle i")

  if (input.type === "password") {
    input.type = "text"
    toggle.classList.remove("fa-eye")
    toggle.classList.add("fa-eye-slash")
  } else {
    input.type = "password"
    toggle.classList.remove("fa-eye-slash")
    toggle.classList.add("fa-eye")
  }
}

// Password strength checker
function checkPasswordStrength(password) {
  const strengthBar = document.querySelector(".strength-fill")
  const strengthText = document.querySelector(".strength-text")

  if (!strengthBar || !strengthText) return

  // Assuming TPMS is a global object or imported module
  // You might need to import it or define it if it's not already available
  // For example: import TPMS from './tpms'; or window.TPMS = { ... };
  // The following is a placeholder, replace with your actual TPMS implementation
  const TPMS = {
    getPasswordStrength: (password) => {
      // Implement your password strength logic here
      // This is just a placeholder
      let score = 0
      if (password.length >= 8) score++
      if (password.match(/[a-z]/)) score++
      if (password.match(/[A-Z]/)) score++
      if (password.match(/[0-9]/)) score++
      if (password.match(/[^a-zA-Z0-9]/)) score++

      let text = "Very Weak"
      if (score == 1) text = "Weak"
      if (score == 2) text = "Fair"
      if (score == 3) text = "Good"
      if (score == 4) text = "Strong"
      if (score == 5) text = "Very Strong"

      return { score: Math.min(score, 4), text: text }
    },
    validateEmail: (email) => {
      // Basic email validation
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(String(email).toLowerCase())
    },
    validatePassword: (password) => {
      // Basic password validation
      return password.length >= 8
    },
    showLoading: (button) => {
      button.disabled = true
      button.textContent = "Loading..."
    },
    hideLoading: (button) => {
      button.disabled = false
      button.textContent = "Submit"
    },
    redirectToDashboard: () => {
      window.location.href = "/dashboard.html"
    },
  }

  const strength = TPMS.getPasswordStrength(password)
  const colors = ["#ef4444", "#f59e0b", "#f59e0b", "#10b981", "#10b981"]
  const widths = [20, 40, 60, 80, 100]

  strengthBar.style.width = widths[strength.score] + "%"
  strengthBar.style.backgroundColor = colors[strength.score]
  strengthText.textContent = strength.text
}

// Real-time validation
function setupRealTimeValidation() {
  const usernameInput = document.getElementById("username")
  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")

  if (usernameInput) {
    usernameInput.addEventListener("input", debounce(validateUsername, 500))
    usernameInput.addEventListener("blur", validateUsername)
  }

  if (emailInput) {
    emailInput.addEventListener("input", debounce(validateEmail, 500))
    emailInput.addEventListener("blur", validateEmail)
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      checkPasswordStrength(this.value)
      validatePassword()
      if (confirmPasswordInput && confirmPasswordInput.value) {
        validateConfirmPassword()
      }
    })
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", validateConfirmPassword)
    confirmPasswordInput.addEventListener("blur", validateConfirmPassword)
  }
}

async function validateUsername() {
  const input = document.getElementById("username")
  const feedback = document.getElementById("usernameFeedback")
  const username = input.value.trim()

  if (!username) {
    showFieldError(input, feedback, "")
    return false
  }

  if (username.length < 3) {
    showFieldError(input, feedback, "Username must be at least 3 characters long")
    return false
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showFieldError(input, feedback, "Username can only contain letters, numbers, and underscores")
    return false
  }

  // Check if username is available (only during signup)
  if (window.location.pathname.includes("signup")) {
    try {
      const response = await fetch(`/api/auth/check-username?username=${username}`)
      const data = await response.json()

      if (!data.available) {
        showFieldError(input, feedback, "Username is already taken")
        return false
      }
    } catch (error) {
      console.error("Username check failed:", error)
    }
  }

  showFieldSuccess(input, feedback, "Username is available")
  return true
}

async function validateEmail() {
  const input = document.getElementById("email")
  const feedback = document.getElementById("emailFeedback")
  const email = input.value.trim()

  if (!email) {
    showFieldError(input, feedback, "")
    return false
  }

  if (!TPMS.validateEmail(email)) {
    showFieldError(input, feedback, "Please enter a valid email address")
    return false
  }

  // Check if email is available (only during signup)
  if (window.location.pathname.includes("signup")) {
    try {
      const response = await fetch(`/api/auth/check-email?email=${email}`)
      const data = await response.json()

      if (!data.available) {
        showFieldError(input, feedback, "Email is already registered")
        return false
      }
    } catch (error) {
      console.error("Email check failed:", error)
    }
  }

  showFieldSuccess(input, feedback, "Email is valid")
  return true
}

function validatePassword() {
  const input = document.getElementById("password")
  const password = input.value

  if (!password) {
    return false
  }

  if (!TPMS.validatePassword(password)) {
    input.classList.add("error")
    return false
  }

  input.classList.remove("error")
  input.classList.add("success")
  return true
}

function validateConfirmPassword() {
  const passwordInput = document.getElementById("password")
  const confirmInput = document.getElementById("confirmPassword")
  const feedback = document.getElementById("confirmPasswordFeedback")

  const password = passwordInput.value
  const confirmPassword = confirmInput.value

  if (!confirmPassword) {
    showFieldError(confirmInput, feedback, "")
    return false
  }

  if (password !== confirmPassword) {
    showFieldError(confirmInput, feedback, "Passwords do not match")
    return false
  }

  showFieldSuccess(confirmInput, feedback, "Passwords match")
  return true
}

function showFieldError(input, feedback, message) {
  input.classList.remove("success")
  input.classList.add("error")
  if (feedback) {
    feedback.textContent = message
    feedback.className = "field-feedback error"
  }
}

function showFieldSuccess(input, feedback, message) {
  input.classList.remove("error")
  input.classList.add("success")
  if (feedback) {
    feedback.textContent = message
    feedback.className = "field-feedback success"
  }
}

// Form submission handlers
async function handleLogin(event) {
  event.preventDefault()

  const form = event.target
  const submitBtn = form.querySelector('button[type="submit"]')
  const username = form.username.value.trim()
  const password = form.password.value
  const rememberMe = form.rememberMe?.checked || false

  // Basic validation
  if (!username || !password) {
    showError("Please fill in all fields")
    return
  }

  // Show loading state
  TPMS.showLoading(submitBtn)
  hideMessages()

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (response.ok) {
      // Store authentication data
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem("authToken", data.token)

      // Decode JWT to get user info (simplified)
      const userInfo = parseJWT(data.token)
      storage.setItem("currentUser", JSON.stringify(userInfo))

      showSuccess("Login successful! Redirecting...")

      // Redirect after short delay
      setTimeout(() => {
        TPMS.redirectToDashboard()
      }, 1500)
    } else {
      showError(data.message || "Login failed. Please check your credentials.")
    }
  } catch (error) {
    console.error("Login error:", error)
    showError("Network error. Please try again.")
  } finally {
    TPMS.hideLoading(submitBtn)
  }
}

async function handleSignup(event) {
  event.preventDefault()

  const form = event.target
  const submitBtn = form.querySelector('button[type="submit"]')

  // Validate all fields
  const isValid = await validateSignupForm(form)
  if (!isValid) {
    return
  }

  const formData = new FormData(form)
  const userData = {
    username: formData.get("username").trim(),
    email: formData.get("email").trim(),
    password: formData.get("password"),
    roles: [formData.get("role")],
  }

  // Show loading state
  TPMS.showLoading(submitBtn)
  hideMessages()

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (response.ok) {
      showSuccess("Account created successfully! Please sign in.")

      // Redirect to login after delay
      setTimeout(() => {
        window.location.href = "/login.html"
      }, 2000)
    } else {
      showError(data.message || "Registration failed. Please try again.")
    }
  } catch (error) {
    console.error("Signup error:", error)
    showError("Network error. Please try again.")
  } finally {
    TPMS.hideLoading(submitBtn)
  }
}

async function validateSignupForm(form) {
  const username = await validateUsername()
  const email = await validateEmail()
  const password = validatePassword()
  const confirmPassword = validateConfirmPassword()
  const agreeTerms = form.agreeTerms.checked

  if (!agreeTerms) {
    showError("Please agree to the Terms of Service and Privacy Policy")
    return false
  }

  return username && email && password && confirmPassword
}

// Utility functions
function parseJWT(token) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("JWT parsing error:", error)
    return null
  }
}

function showError(message) {
  const errorDiv = document.getElementById("errorMessage")
  if (errorDiv) {
    errorDiv.textContent = message
    errorDiv.style.display = "block"
  }
}

function showSuccess(message) {
  const successDiv = document.getElementById("successMessage")
  if (successDiv) {
    successDiv.textContent = message
    successDiv.style.display = "block"
  }
}

function hideMessages() {
  const errorDiv = document.getElementById("errorMessage")
  const successDiv = document.getElementById("successMessage")

  if (errorDiv) errorDiv.style.display = "none"
  if (successDiv) successDiv.style.display = "none"
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupRealTimeValidation()

  // Set up form handlers
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
  }

  // Check for role parameter in signup
  if (window.location.pathname.includes("signup")) {
    const urlParams = new URLSearchParams(window.location.search)
    const role = urlParams.get("role")

    if (role) {
      const roleMap = {
        student: "ROLE_STUDENT",
        trainer: "ROLE_TRAINER",
        recruiter: "ROLE_RECRUITER",
      }

      const roleInput = document.querySelector(`input[value="${roleMap[role]}"]`)
      if (roleInput) {
        roleInput.checked = true
      }
    }
  }
})

// Debounce function for validation
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
