// API Base URL
const API_BASE_URL = "http://localhost:8080"

// DOM Elements
const signupForm = document.getElementById("signupForm")
const submitBtn = document.getElementById("submitBtn")
const btnText = submitBtn.querySelector(".btn-text")
const btnLoader = submitBtn.querySelector(".btn-loader")
const successMessage = document.getElementById("successMessage")
const errorMessage = document.getElementById("errorMessage")

// Password toggle functionality
document.querySelectorAll(".toggle-password").forEach((toggle) => {
  toggle.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target")
    const targetInput = document.getElementById(targetId)
    const icon = this.querySelector("i")

    if (targetInput.type === "password") {
      targetInput.type = "text"
      icon.classList.remove("fa-eye")
      icon.classList.add("fa-eye-slash")
    } else {
      targetInput.type = "password"
      icon.classList.remove("fa-eye-slash")
      icon.classList.add("fa-eye")
    }
  })
})

// Form validation
function validateForm() {
  let isValid = true
  clearErrors()

  // Get form values
  const firstName = document.getElementById("firstName").value.trim()
  const lastName = document.getElementById("lastName").value.trim()
  const username = document.getElementById("username").value.trim()
  const email = document.getElementById("email").value.trim()
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const roles = document.getElementById("roles").value
  const termsAccepted = document.getElementById("termsAccepted").checked

  // First Name validation
  if (!firstName) {
    showError("firstNameError", "First name is required")
    isValid = false
  } else if (firstName.length < 2) {
    showError("firstNameError", "First name must be at least 2 characters")
    isValid = false
  }

  // Last Name validation
  if (!lastName) {
    showError("lastNameError", "Last name is required")
    isValid = false
  } else if (lastName.length < 2) {
    showError("lastNameError", "Last name must be at least 2 characters")
    isValid = false
  }

  // Username validation
  if (!username) {
    showError("usernameError", "Username is required")
    isValid = false
  } else if (username.length < 3) {
    showError("usernameError", "Username must be at least 3 characters")
    isValid = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showError("usernameError", "Username can only contain letters, numbers, and underscores")
    isValid = false
  }

  // Email validation
  if (!email) {
    showError("emailError", "Email is required")
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("emailError", "Please enter a valid email address")
    isValid = false
  }

  // Password validation
  if (!password) {
    showError("passwordError", "Password is required")
    isValid = false
  } else if (password.length < 8) {
    showError("passwordError", "Password must be at least 8 characters")
    isValid = false
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    showError(
      "passwordError",
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    )
    isValid = false
  }

  // Confirm Password validation
  if (!confirmPassword) {
    showError("confirmPasswordError", "Please confirm your password")
    isValid = false
  } else if (password !== confirmPassword) {
    showError("confirmPasswordError", "Passwords do not match")
    isValid = false
  }

  // Roles validation
  if (!roles) {
    showError("roleError", "Please select a roles")
    isValid = false
  }

  // Terms validation
  if (!termsAccepted) {
    showError("termsError", "You must accept the Terms of Service and Privacy Policy")
    isValid = false
  }

  return isValid
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId)
  if (errorElement) {
    errorElement.textContent = message
    errorElement.style.display = "block"
  }
}

function clearErrors() {
  const errorElements = document.querySelectorAll(".error-message")
  errorElements.forEach((element) => {
    element.textContent = ""
    element.style.display = "none"
  })
  hideMessage(successMessage)
  hideMessage(errorMessage)
}

function showMessage(element, message, isSuccess = false) {
  element.textContent = message
  element.classList.remove("hidden")
  element.style.display = "block"

  if (isSuccess) {
    setTimeout(() => {
      window.location.href = "login.html"
    }, 2000)
  }
}

function hideMessage(element) {
  element.classList.add("hidden")
  element.style.display = "none"
}

function setLoading(loading) {
  if (loading) {
    submitBtn.disabled = true
    btnText.style.opacity = "0"
    btnLoader.classList.remove("hidden")
    signupForm.classList.add("loading")
  } else {
    submitBtn.disabled = false
    btnText.style.opacity = "1"
    btnLoader.classList.add("hidden")
    signupForm.classList.remove("loading")
  }
}

// Form submission
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  if (!validateForm()) {
    return
  }

  setLoading(true)

  // Prepare form data
  const formData = {
    // firstName: document.getElementById("firstName").value.trim(),
    // lastName: document.getElementById("lastName").value.trim(),
    username: document.getElementById("username").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
    roles: [document.getElementById("roles").value]
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (response.ok) {
      showMessage(successMessage, "Account created successfully! Redirecting to login...", true)
      window.location.href = "/login.html"
    } else {
      // Handle specific error cases
      if (response.status === 409) {
        showMessage(errorMessage, data.message || "Username or email already exists")
      } else if (response.status === 400) {
        showMessage(errorMessage, data.message || "Invalid input data")
      } else {
        showMessage(errorMessage, data.message || "Failed to create account. Please try again.")
      }
    }
  } catch (error) {
    console.error("Signup error:", error)
    showMessage(errorMessage, "Network error. Please check your connection and try again.")
  } finally {
    setLoading(false)
  }
})

// Real-time validation
document.getElementById("username").addEventListener("blur", async function () {
  const username = this.value.trim()
  if (username && username.length >= 3) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check-username?username=${encodeURIComponent(username)}`)
      if (response.status === 409) {
        showError("usernameError", "Username is already taken")
      }
    } catch (error) {
      console.error("Username check error:", error)
    }
  }
})

document.getElementById("email").addEventListener("blur", async function () {
  const email = this.value.trim()
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check-email?email=${encodeURIComponent(email)}`)
      if (response.status === 409) {
        showError("emailError", "Email is already registered")
      }
    } catch (error) {
      console.error("Email check error:", error)
    }
  }
})

// Password strength indicator
document.getElementById("password").addEventListener("input", function () {
  const password = this.value
  const strengthIndicator = document.querySelector(".password-strength") || createPasswordStrengthIndicator()

  let strength = 0
  const feedback = []

  if (password.length >= 8) strength++
  else feedback.push("At least 8 characters")

  if (/[a-z]/.test(password)) strength++
  else feedback.push("One lowercase letter")

  if (/[A-Z]/.test(password)) strength++
  else feedback.push("One uppercase letter")

  if (/\d/.test(password)) strength++
  else feedback.push("One number")

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

  updatePasswordStrength(strengthIndicator, strength, feedback)
})

function createPasswordStrengthIndicator() {
  const indicator = document.createElement("div")
  indicator.className = "password-strength"
  indicator.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill"></div>
        </div>
        <div class="strength-text"></div>
    `

  const passwordGroup = document.getElementById("password").closest(".form-group")
  passwordGroup.appendChild(indicator)

  // Add styles
  const style = document.createElement("style")
  style.textContent = `
        .password-strength {
            margin-top: 8px;
        }
        .strength-bar {
            height: 4px;
            background: #e5e7eb;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 4px;
        }
        .strength-fill {
            height: 100%;
            transition: all 0.3s ease;
            border-radius: 2px;
        }
        .strength-text {
            font-size: 0.75rem;
            color: #6b7280;
        }
    `
  document.head.appendChild(style)

  return indicator
}

function updatePasswordStrength(indicator, strength, feedback) {
  const fill = indicator.querySelector(".strength-fill")
  const text = indicator.querySelector(".strength-text")

  const colors = ["#ef4444", "#f59e0b", "#f59e0b", "#10b981", "#059669"]
  const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"]

  fill.style.width = `${(strength / 5) * 100}%`
  fill.style.background = colors[strength - 1] || "#e5e7eb"

  if (strength === 0) {
    text.textContent = ""
  } else if (strength < 4) {
    text.textContent = `${labels[strength - 1]} - Missing: ${feedback.join(", ")}`
  } else {
    text.textContent = labels[strength - 1]
  }
}
