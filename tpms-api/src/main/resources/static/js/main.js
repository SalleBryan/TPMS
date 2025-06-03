// Main JavaScript file for common functionality

// Global variables
let currentUser = null
let authToken = null

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Check for stored authentication
  checkAuthStatus()

  // Initialize common event listeners
  initializeEventListeners()

  // Initialize tooltips and other UI components
  initializeUIComponents()
}

function checkAuthStatus() {
  const token = localStorage.getItem("authToken")
  const user = localStorage.getItem("currentUser")

  if (token && user) {
    authToken = token
    currentUser = JSON.parse(user)

    // Verify token is still valid
    verifyToken()
  }
}

async function verifyToken() {
  try {
    const response = await fetch("/api/auth/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // Token is invalid, clear auth data
      clearAuthData()
      redirectToLogin()
    }
  } catch (error) {
    console.error("Token verification failed:", error)
    clearAuthData()
    redirectToLogin()
  }
}

function initializeEventListeners() {
  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      hamburger.classList.toggle("active")
    })
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (navMenu && navMenu.classList.contains("active")) {
      if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        navMenu.classList.remove("active")
        hamburger.classList.remove("active")
      }
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

function initializeUIComponents() {
  // Initialize any tooltips, modals, or other UI components
  initializeTooltips()
  initializeModals()
}

function initializeTooltips() {
  // Add tooltip functionality if needed
  const tooltipElements = document.querySelectorAll("[data-tooltip]")
  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip)
    element.addEventListener("mouseleave", hideTooltip)
  })
}

function showTooltip(event) {
  const text = event.target.getAttribute("data-tooltip")
  const tooltip = document.createElement("div")
  tooltip.className = "tooltip"
  tooltip.textContent = text
  document.body.appendChild(tooltip)

  const rect = event.target.getBoundingClientRect()
  tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
  tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px"
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip")
  if (tooltip) {
    tooltip.remove()
  }
}

function initializeModals() {
  // Modal functionality
  const modals = document.querySelectorAll(".modal")
  const modalTriggers = document.querySelectorAll("[data-modal]")
  const modalCloses = document.querySelectorAll(".modal-close, [data-modal-close]")

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const modalId = this.getAttribute("data-modal")
      const modal = document.getElementById(modalId)
      if (modal) {
        showModal(modal)
      }
    })
  })

  modalCloses.forEach((close) => {
    close.addEventListener("click", function () {
      const modal = this.closest(".modal")
      if (modal) {
        hideModal(modal)
      }
    })
  })

  // Close modal when clicking outside
  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        hideModal(modal)
      }
    })
  })
}

function showModal(modal) {
  modal.classList.add("show")
  document.body.style.overflow = "hidden"
}

function hideModal(modal) {
  modal.classList.remove("show")
  document.body.style.overflow = ""
}

// Utility functions
function showNotification(message, type = "info", duration = 5000) {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `

  const container = getNotificationContainer()
  container.appendChild(notification)

  // Auto remove after duration
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, duration)

  // Animate in
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)
}

function getNotificationIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    warning: "exclamation-triangle",
    info: "info-circle",
  }
  return icons[type] || "info-circle"
}

function getNotificationContainer() {
  let container = document.getElementById("notification-container")
  if (!container) {
    container = document.createElement("div")
    container.id = "notification-container"
    container.className = "notification-container"
    document.body.appendChild(container)
  }
  return container
}

function formatDate(date, format = "short") {
  const options = {
    short: { year: "numeric", month: "short", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" },
    time: { hour: "2-digit", minute: "2-digit" },
  }

  return new Date(date).toLocaleDateString("en-US", options[format])
}

function formatNumber(number, decimals = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number)
}

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

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Authentication helpers
function clearAuthData() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("currentUser")
  authToken = null
  currentUser = null
}

function redirectToLogin() {
  if (window.location.pathname !== "/login.html" && window.location.pathname !== "/") {
    window.location.href = "/login.html"
  }
}

function redirectToDashboard() {
  window.location.href = "/dashboard.html"
}

function requireAuth() {
  if (!authToken || !currentUser) {
    redirectToLogin()
    return false
  }
  return true
}

function hasRole(role) {
  if (!currentUser || !currentUser.roles) {
    return false
  }
  return currentUser.roles.includes(role)
}

// Loading states
function showLoading(element) {
  if (typeof element === "string") {
    element = document.getElementById(element)
  }
  if (element) {
    element.classList.add("loading")
    element.disabled = true
  }
}

function hideLoading(element) {
  if (typeof element === "string") {
    element = document.getElementById(element)
  }
  if (element) {
    element.classList.remove("loading")
    element.disabled = false
  }
}

// Form validation helpers
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return re.test(password)
}

function getPasswordStrength(password) {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[@$!%*?&]/.test(password)) strength++

  return {
    score: strength,
    text: ["Very Weak", "Weak", "Fair", "Good", "Strong"][strength] || "Very Weak",
  }
}

// Export functions for use in other files
window.TPMS = {
  showNotification,
  formatDate,
  formatNumber,
  debounce,
  throttle,
  clearAuthData,
  redirectToLogin,
  redirectToDashboard,
  requireAuth,
  hasRole,
  showLoading,
  hideLoading,
  validateEmail,
  validatePassword,
  getPasswordStrength,
  showModal,
  hideModal,
}
