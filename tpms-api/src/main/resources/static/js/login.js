// Login page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeLogin()
})

function initializeLogin() {
  // Check if user is already logged in
  if (localStorage.getItem("authToken") || sessionStorage.getItem("authToken")) {
    if (typeof TPMS !== "undefined" && TPMS.redirectToDashboard) {
      TPMS.redirectToDashboard()
    }
    return
  }

  // Focus on username field
  const usernameField = document.getElementById("username")
  if (usernameField) {
    usernameField.focus()
  }

  // Handle remember me functionality
  loadRememberedCredentials()

  // Add enter key handler
  addEnterKeyHandler()

  // Add demo account buttons (for testing)
  addDemoAccountButtons()
}

function loadRememberedCredentials() {
  const rememberedUsername = localStorage.getItem("rememberedUsername")
  const rememberMeCheckbox = document.getElementById("rememberMe")
  const usernameField = document.getElementById("username")

  if (rememberedUsername && usernameField) {
    usernameField.value = rememberedUsername
    if (rememberMeCheckbox) {
      rememberMeCheckbox.checked = true
    }

    // Focus on password field instead
    const passwordField = document.getElementById("password")
    if (passwordField) {
      passwordField.focus()
    }
  }
}

function addEnterKeyHandler() {
  const form = document.getElementById("loginForm")
  if (form) {
    form.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault()
        form.dispatchEvent(new Event("submit"))
      }
    })
  }
}

// function addDemoAccountButtons() {
//   // Add demo account buttons for easy testing
//   const authCard = document.querySelector(".auth-card")
//   if (!authCard) return

//   const demoSection = document.createElement("div")
//   demoSection.className = "demo-accounts"
//   demoSection.innerHTML = `
//         <div class="auth-divider">
//             <span>Demo Accounts</span>
//         </div>
//         <div class="demo-buttons">
//             <button type="button" class="btn btn-outline btn-sm" onclick="fillDemoCredentials('admin')">
//                 <i class="fas fa-cog"></i> Admin Demo
//             </button>
//             <button type="button" class="btn btn-outline btn-sm" onclick="fillDemoCredentials('student')">
//                 <i class="fas fa-user-graduate"></i> Student Demo
//             </button>
//             <button type="button" class="btn btn-outline btn-sm" onclick="fillDemoCredentials('recruiter')">
//                 <i class="fas fa-briefcase"></i> Recruiter Demo
//             </button>
//             <button type="button" class="btn btn-outline btn-sm" onclick="fillDemoCredentials('trainer')">
//                 <i class="fas fa-chalkboard-teacher"></i> Trainer Demo
//             </button>
//         </div>
//     `

//   // Insert before the auth footer
//   const authFooter = authCard.querySelector(".auth-footer")
//   if (authFooter) {
//     authFooter.parentNode.insertBefore(demoSection, authFooter)
//   }
// }

function fillDemoCredentials(role) {
  const usernameField = document.getElementById("username")
  const passwordField = document.getElementById("password")

  const demoCredentials = {
    admin: { username: "admin", password: "admin123" },
    student: { username: "student1", password: "student123" },
    recruiter: { username: "recruiter1", password: "recruiter123" },
    trainer: { username: "trainer1", password: "trainer123" },
  }

  const credentials = demoCredentials[role]
  if (credentials && usernameField && passwordField) {
    usernameField.value = credentials.username
    passwordField.value = credentials.password

    // Add visual feedback
    usernameField.classList.add("demo-filled")
    passwordField.classList.add("demo-filled")

    setTimeout(() => {
      usernameField.classList.remove("demo-filled")
      passwordField.classList.remove("demo-filled")
    }, 1000)

    if (typeof TPMS !== "undefined" && TPMS.showNotification) {
      TPMS.showNotification(`Demo credentials filled for ${role}`, "info", 3000)
    }
  }
}

// Enhanced login handler with better error handling
async function handleLoginSubmit(event) {
  event.preventDefault()

  const form = event.target
  const submitBtn = form.querySelector('button[type="submit"]')
  const username = form.username.value.trim()
  const password = form.password.value
  const rememberMe = form.rememberMe?.checked || false

  // Clear previous messages
  hideMessages()

  // Validation
  if (!username) {
    showFieldError(form.username, null, "Username is required")
    form.username.focus()
    return
  }

  if (!password) {
    showFieldError(form.password, null, "Password is required")
    form.password.focus()
    return
  }

  // Show loading state
  if (typeof TPMS !== "undefined" && TPMS.showLoading) {
    TPMS.showLoading(submitBtn)
  }

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      const data = await response.json()
      await handleLoginSuccess(data, username, rememberMe)
    } else {
      const errorData = await response.json()
      handleLoginError(response.status, errorData)
    }
  } catch (error) {
    console.error("Login error:", error)
    handleNetworkError()
  } finally {
    if (typeof TPMS !== "undefined" && TPMS.hideLoading) {
      TPMS.hideLoading(submitBtn)
    }
  }
}

async function handleLoginSuccess(data, username, rememberMe) {
  // Store authentication data
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem("authToken", data.token)

  // Store username if remember me is checked
  if (rememberMe) {
    localStorage.setItem("rememberedUsername", username)
  } else {
    localStorage.removeItem("rememberedUsername")
  }

  // Parse user info from token
  const userInfo = parseJWT(data.token)
  if (userInfo) {
    storage.setItem(
      "currentUser",
      JSON.stringify({
        username: userInfo.sub,
        roles: userInfo.roles || [],
        exp: userInfo.exp,
      }),
    )
  }

  showSuccess("Login successful! Redirecting to dashboard...")

  // Add success animation
  document.querySelector(".auth-card").classList.add("login-success")

  // Redirect after animation
  setTimeout(() => {
    if (typeof TPMS !== "undefined" && TPMS.redirectToDashboard) {
      TPMS.redirectToDashboard()
    }
  }, 1500)
}

function handleLoginError(status, errorData) {
  let message = "Login failed. Please try again."

  switch (status) {
    case 401:
      message = "Invalid username or password."
      break
    case 403:
      message = "Account is disabled. Please contact support."
      break
    case 429:
      message = "Too many login attempts. Please try again later."
      break
    case 500:
      message = "Server error. Please try again later."
      break
    default:
      message = errorData.message || message
  }

  showError(message)

  // Add shake animation to form
  const authCard = document.querySelector(".auth-card")
  authCard.classList.add("shake")
  setTimeout(() => {
    authCard.classList.remove("shake")
  }, 500)
}

function handleNetworkError() {
  showError("Network error. Please check your connection and try again.")
}

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

function showFieldError(input, feedback, message) {
  input.classList.add("error")
  if (feedback) {
    feedback.textContent = message
    feedback.className = "field-feedback error"
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

  // Clear field errors
  document.querySelectorAll(".error").forEach((el) => {
    el.classList.remove("error")
  })
}

// Override the auth.js login handler
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    // Remove existing event listeners
    const handleLogin = null // Define handleLogin to avoid the "no-undef" error
    if (typeof handleLogin !== "undefined") {
      loginForm.removeEventListener("submit", handleLogin)
    }
    // Add new handler
    loginForm.addEventListener("submit", handleLoginSubmit)
  }
})

// Add CSS for animations
const style = document.createElement("style")
style.textContent = `
    .demo-accounts {
        margin-top: var(--spacing-4);
    }
    
    .demo-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-2);
        margin-top: var(--spacing-3);
    }
    
    .demo-filled {
        background-color: rgba(16, 185, 129, 0.1) !important;
        border-color: var(--success-color) !important;
        transition: all 0.3s ease;
    }
    
    .auth-card.shake {
        animation: shake 0.5s ease-in-out;
    }
    
    .auth-card.login-success {
        animation: success-pulse 1s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes success-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    @media (max-width: 480px) {
        .demo-buttons {
            grid-template-columns: 1fr;
        }
    }
`
document.head.appendChild(style)
