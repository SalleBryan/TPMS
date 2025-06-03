// Signup page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeSignup()
})

function initializeSignup() {
  // Check if user is already logged in
  if (localStorage.getItem("authToken") || sessionStorage.getItem("authToken")) {
    if (typeof TPMS !== "undefined" && TPMS.redirectToDashboard) {
      TPMS.redirectToDashboard()
    }
    return
  }

  // Initialize form validation
  setupSignupValidation()

  // Handle role selection from URL
  handleRoleFromURL()

  // Focus on first field
  const usernameField = document.getElementById("username")
  if (usernameField) {
    usernameField.focus()
  }
}

function setupSignupValidation() {
  const form = document.getElementById("signupForm")
  if (!form) return

  // Real-time validation for all fields
  const fields = {
    username: {
      element: document.getElementById("username"),
      feedback: document.getElementById("usernameFeedback"),
      validator: validateUsernameField,
    },
    email: {
      element: document.getElementById("email"),
      feedback: document.getElementById("emailFeedback"),
      validator: validateEmailField,
    },
    password: {
      element: document.getElementById("password"),
      feedback: null,
      validator: validatePasswordField,
    },
    confirmPassword: {
      element: document.getElementById("confirmPassword"),
      feedback: document.getElementById("confirmPasswordFeedback"),
      validator: validateConfirmPasswordField,
    },
  }

  // Set up event listeners for each field
  Object.values(fields).forEach((field) => {
    if (field.element) {
      field.element.addEventListener(
        "input",
        debounce(() => {
          field.validator()
        }, 300),
      )

      field.element.addEventListener("blur", () => {
        field.validator()
      })
    }
  })

  // Password strength indicator
  const passwordField = document.getElementById("password")
  if (passwordField) {
    passwordField.addEventListener("input", updatePasswordStrength)
  }

  // Form submission
  form.addEventListener("submit", handleSignupSubmit)
}

async function validateUsernameField() {
  const input = document.getElementById("username")
  const feedback = document.getElementById("usernameFeedback")
  const username = input.value.trim()

  // Clear previous state
  clearFieldState(input, feedback)

  if (!username) {
    return false
  }

  // Length check
  if (username.length < 3) {
    setFieldError(input, feedback, "Username must be at least 3 characters long")
    return false
  }

  if (username.length > 20) {
    setFieldError(input, feedback, "Username must be less than 20 characters")
    return false
  }

  // Character check
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    setFieldError(input, feedback, "Username can only contain letters, numbers, and underscores")
    return false
  }

  // Reserved usernames
  const reserved = ["admin", "root", "system", "test", "demo"]
  if (reserved.includes(username.toLowerCase())) {
    setFieldError(input, feedback, "This username is reserved")
    return false
  }

  // Check availability
  try {
    setFieldLoading(input, feedback, "Checking availability...")

    const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`)
    const data = await response.json()

    if (response.ok) {
      if (data.available) {
        setFieldSuccess(input, feedback, "Username is available")
        return true
      } else {
        setFieldError(input, feedback, "Username is already taken")
        return false
      }
    } else {
      setFieldError(input, feedback, "Unable to check username availability")
      return false
    }
  } catch (error) {
    console.error("Username check error:", error)
    setFieldError(input, feedback, "Network error checking username")
    return false
  }
}

async function validateEmailField() {
  const input = document.getElementById("email")
  const feedback = document.getElementById("emailFeedback")
  const email = input.value.trim()

  clearFieldState(input, feedback)

  if (!email) {
    return false
  }

  // Email format validation
  if (!validateEmail(email)) {
    setFieldError(input, feedback, "Please enter a valid email address")
    return false
  }

  // Check availability
  try {
    setFieldLoading(input, feedback, "Checking availability...")

    const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`)
    const data = await response.json()

    if (response.ok) {
      if (data.available) {
        setFieldSuccess(input, feedback, "Email is available")
        return true
      } else {
        setFieldError(input, feedback, "Email is already registered")
        return false
      }
    } else {
      setFieldError(input, feedback, "Unable to check email availability")
      return false
    }
  } catch (error) {
    console.error("Email check error:", error)
    setFieldError(input, feedback, "Network error checking email")
    return false
  }
}

function validatePasswordField() {
  const input = document.getElementById("password")
  const password = input.value

  clearFieldState(input)

  if (!password) {
    return false
  }

  if (!validatePassword(password)) {
    setFieldError(input, null, "")
    return false
  }

  setFieldSuccess(input, null, "")

  // Also validate confirm password if it has a value
  const confirmInput = document.getElementById("confirmPassword")
  if (confirmInput && confirmInput.value) {
    validateConfirmPasswordField()
  }

  return true
}

function validateConfirmPasswordField() {
  const passwordInput = document.getElementById("password")
  const confirmInput = document.getElementById("confirmPassword")
  const feedback = document.getElementById("confirmPasswordFeedback")

  const password = passwordInput.value
  const confirmPassword = confirmInput.value

  clearFieldState(confirmInput, feedback)

  if (!confirmPassword) {
    return false
  }

  if (password !== confirmPassword) {
    setFieldError(confirmInput, feedback, "Passwords do not match")
    return false
  }

  setFieldSuccess(confirmInput, feedback, "Passwords match")
  return true
}

function updatePasswordStrength() {
  const passwordInput = document.getElementById("password")
  const strengthBar = document.querySelector(".strength-fill")
  const strengthText = document.querySelector(".strength-text")

  if (!passwordInput || !strengthBar || !strengthText) return

  const password = passwordInput.value
  const strength = getPasswordStrength(password)

  const colors = ["#ef4444", "#f59e0b", "#f59e0b", "#10b981", "#10b981"]
  const widths = [20, 40, 60, 80, 100]

  strengthBar.style.width = (password.length > 0 ? widths[strength.score] : 0) + "%"
  strengthBar.style.backgroundColor = colors[strength.score]
  strengthText.textContent = password.length > 0 ? strength.text : "Password strength"

  // Add requirements checklist
  updatePasswordRequirements(password)
}

function updatePasswordRequirements(password) {
  const requirements = [
    { test: password.length >= 8, text: "At least 8 characters" },
    { test: /[a-z]/.test(password), text: "One lowercase letter" },
    { test: /[A-Z]/.test(password), text: "One uppercase letter" },
    { test: /\d/.test(password), text: "One number" },
    { test: /[@$!%*?&]/.test(password), text: "One special character" },
  ]

  let requirementsList = document.querySelector(".password-requirements")
  if (!requirementsList && password.length > 0) {
    requirementsList = document.createElement("div")
    requirementsList.className = "password-requirements"

    const passwordGroup = document.getElementById("password").closest(".form-group")
    passwordGroup.appendChild(requirementsList)
  }

  if (requirementsList) {
    if (password.length === 0) {
      requirementsList.remove()
      return
    }

    requirementsList.innerHTML = requirements
      .map(
        (req) => `
            <div class="requirement ${req.test ? "met" : "unmet"}">
                <i class="fas fa-${req.test ? "check" : "times"}"></i>
                <span>${req.text}</span>
            </div>
        `,
      )
      .join("")
  }
}

async function handleSignupSubmit(event) {
  event.preventDefault()

  const form = event.target
  const submitBtn = form.querySelector('button[type="submit"]')

  // Validate all fields
  const validations = await Promise.all([
    validateUsernameField(),
    validateEmailField(),
    validatePasswordField(),
    validateConfirmPasswordField(),
  ])

  const isValid = validations.every((v) => v === true)

  // Check terms agreement
  const agreeTerms = form.agreeTerms.checked
  if (!agreeTerms) {
    showNotification("Please agree to the Terms of Service and Privacy Policy", "error")
    return
  }

  if (!isValid) {
    showNotification("Please fix the errors above", "error")
    return
  }

  // Prepare data
  const formData = new FormData(form)
  const userData = {
    username: formData.get("username").trim(),
    email: formData.get("email").trim(),
    password: formData.get("password"),
    roles: [formData.get("role")],
  }

  // Show loading state
  showLoading(submitBtn)
  hideMessages()

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (response.ok) {
      const data = await response.json()
      handleSignupSuccess(data)
    } else {
      const errorData = await response.json()
      handleSignupError(response.status, errorData)
    }
  } catch (error) {
    console.error("Signup error:", error)
    handleNetworkError()
  } finally {
    hideLoading(submitBtn)
  }
}

function handleSignupSuccess(data) {
  showSuccess("Account created successfully! Redirecting to login...")

  // Add success animation
  document.querySelector(".auth-card").classList.add("signup-success")

  // Redirect to login page
  setTimeout(() => {
    window.location.href = "/login.html"
  }, 2000)
}

function handleSignupError(status, errorData) {
  let message = "Registration failed. Please try again."

  switch (status) {
    case 400:
      message = errorData.message || "Invalid data provided."
      break
    case 409:
      message = "Username or email already exists."
      break
    case 429:
      message = "Too many registration attempts. Please try again later."
      break
    case 500:
      message = "Server error. Please try again later."
      break
    default:
      message = errorData.message || message
  }

  showError(message)

  // Add shake animation
  const authCard = document.querySelector(".auth-card")
  authCard.classList.add("shake")
  setTimeout(() => {
    authCard.classList.remove("shake")
  }, 500)
}

function handleNetworkError() {
  showError("Network error. Please check your connection and try again.")
}

function handleRoleFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  const role = urlParams.get("role")

  if (role) {
    const roleMap = {
      student: "ROLE_STUDENT",
      trainer: "ROLE_TRAINER",
      recruiter: "ROLE_RECRUITER",
    }

    const roleValue = roleMap[role.toLowerCase()]
    if (roleValue) {
      const roleInput = document.querySelector(`input[value="${roleValue}"]`)
      if (roleInput) {
        roleInput.checked = true

        // Highlight the selected role
        const roleCard = roleInput.closest(".role-option")
        if (roleCard) {
          roleCard.classList.add("pre-selected")
        }
      }
    }
  }
}

// Field state management functions
function clearFieldState(input, feedback) {
  input.classList.remove("error", "success", "loading")
  if (feedback) {
    feedback.textContent = ""
    feedback.className = "field-feedback"
  }
}

function setFieldError(input, feedback, message) {
  input.classList.remove("success", "loading")
  input.classList.add("error")
  if (feedback) {
    feedback.textContent = message
    feedback.className = "field-feedback error"
  }
}

function setFieldSuccess(input, feedback, message) {
  input.classList.remove("error", "loading")
  input.classList.add("success")
  if (feedback) {
    feedback.textContent = message
    feedback.className = "field-feedback success"
  }
}

function setFieldLoading(input, feedback, message) {
  input.classList.remove("error", "success")
  input.classList.add("loading")
  if (feedback) {
    feedback.textContent = message
    feedback.className = "field-feedback loading"
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

// Utility functions
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

function validatePassword(password) {
  return password.length >= 8
}

function getPasswordStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[@$!%*?&]/.test(password)) score++

  let text = "Very Weak"
  if (score == 1) text = "Weak"
  if (score == 2) text = "Fair"
  if (score == 3) text = "Good"
  if (score == 4) text = "Strong"
  if (score == 5) text = "Very Strong"

  return { score: Math.min(score, 4), text: text }
}

function showLoading(button) {
  button.disabled = true
  const btnText = button.querySelector(".btn-text")
  const btnLoader = button.querySelector(".btn-loader")
  if (btnText) btnText.style.display = "none"
  if (btnLoader) btnLoader.style.display = "inline-flex"
}

function hideLoading(button) {
  button.disabled = false
  const btnText = button.querySelector(".btn-text")
  const btnLoader = button.querySelector(".btn-loader")
  if (btnText) btnText.style.display = "inline"
  if (btnLoader) btnLoader.style.display = "none"
}

function showNotification(message, type = "info") {
  const container = document.querySelector(".notification-container") || createNotificationContainer()
  const notification = document.createElement("div")
  notification.classList.add("notification", `notification-${type}`, "show")
  notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `
  container.appendChild(notification)

  // Close button functionality
  notification.querySelector(".notification-close").addEventListener("click", () => {
    notification.classList.remove("show")
    setTimeout(() => notification.remove(), 300)
  })

  // Auto-close after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => notification.remove(), 300)
  }, 5000)
}

function createNotificationContainer() {
  const container = document.createElement("div")
  container.classList.add("notification-container")
  document.body.appendChild(container)
  return container
}

// Debounce function
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

// Add CSS for additional styling
const style = document.createElement("style")
style.textContent = `
    .field-feedback.loading {
        color: var(--info-color);
    }
    
    .field-feedback.loading::before {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid var(--info-color);
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }
    
    .password-requirements {
        margin-top: var(--spacing-2);
        padding: var(--spacing-3);
        background-color: var(--gray-50);
        border-radius: var(--radius-md);
        border: 1px solid var(--gray-200);
    }
    
    .requirement {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-1);
    }
    
    .requirement:last-child {
        margin-bottom: 0;
    }
    
    .requirement.met {
        color: var(--success-color);
    }
    
    .requirement.unmet {
        color: var(--gray-500);
    }
    
    .requirement i {
        width: 12px;
        text-align: center;
    }
    
    .role-option.pre-selected .role-card {
        border-color: var(--primary-color);
        background-color: rgba(37, 99, 235, 0.05);
        animation: highlight 2s ease-in-out;
    }
    
    .auth-card.signup-success {
        animation: success-bounce 1s ease-in-out;
    }
    
    @keyframes highlight {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    
    @keyframes success-bounce {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.02); }
        50% { transform: scale(1.05); }
        75% { transform: scale(1.02); }
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .input-group input.loading {
        background-image: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.1), transparent);
        background-size: 200% 100%;
        animation: loading-shimmer 1.5s infinite;
    }
    
    @keyframes loading-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .notification {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid var(--success-color);
    }
    
    .notification-error {
        border-left: 4px solid var(--error-color);
    }
    
    .notification-warning {
        border-left: 4px solid var(--warning-color);
    }
    
    .notification-info {
        border-left: 4px solid var(--info-color);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--gray-500);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
    }
    
    .notification-close:hover {
        background-color: var(--gray-100);
    }
`
document.head.appendChild(style)
