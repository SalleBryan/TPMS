// API Configuration
const API_BASE_URL = "http://localhost:8080"

// DOM Elements
const profileForm = document.getElementById("profileForm")
const profileAvatar = document.getElementById("profileAvatar")
const avatarText = document.getElementById("avatarText")
const profileName = document.getElementById("profileName")
const profileRole = document.getElementById("profileRole")
const fullNameInput = document.getElementById("fullName")
const usernameInput = document.getElementById("username")
const emailInput = document.getElementById("email")
const roleInput = document.getElementById("role")
const roleSpecificFields = document.getElementById("roleSpecificFields")
const saveBtn = document.getElementById("saveBtn")
const btnText = document.querySelector(".btn-text")
const btnLoader = document.querySelector(".btn-loader")
const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toastMessage")

// Error elements
const fullNameError = document.getElementById("fullNameError")
const emailError = document.getElementById("emailError")

let currentUserData = {}
let userId = null

// Authentication check
function checkAuth() {
  const token = localStorage.getItem("authToken")
  const username = localStorage.getItem("username")

  if (!token || !username) {
    window.location.href = "login.html"
    return false
  }

  return { token, username }
}

// Show toast notification
function showToast(message, isError = false) {
  toastMessage.textContent = message
  toast.className = `toast ${isError ? "error" : ""}`

  if (isError) {
    toast.querySelector("i").className = "fas fa-exclamation-circle"
  } else {
    toast.querySelector("i").className = "fas fa-check-circle"
  }

  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 4000)
}

// Loading state management
function setLoading(loading) {
  if (loading) {
    saveBtn.disabled = true
    btnText.classList.add("hidden")
    btnLoader.classList.remove("hidden")
  } else {
    saveBtn.disabled = false
    btnText.classList.remove("hidden")
    btnLoader.classList.add("hidden")
  }
}

// Validation functions
function validateFullName(name) {
  if (!name.trim()) return "Full name is required"
  if (name.trim().length < 2) return "Full name must be at least 2 characters"
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) return "Full name can only contain letters and spaces"
  return ""
}

function validateEmail(email) {
  if (!email.trim()) return "Email is required"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return "Please enter a valid email address"
  return ""
}

// Fetch user profile data
async function fetchUserProfile(username, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/${username}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const userData = await response.json()
      return { success: true, data: userData }
    } else if (response.status === 401) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("username")
      localStorage.removeItem("userRole")
      window.location.href = "login.html"
      return { success: false, error: "Unauthorized" }
    } else {
      return { success: false, error: "Failed to fetch profile" }
    }
  } catch (error) {
    console.error("Profile fetch error:", error)
    return { success: false, error: "Network error" }
  }
}

// Update profile data
async function updateUserProfile(userId, profileData, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })

    if (response.ok) {
      const updatedData = await response.json()
      return { success: true, data: updatedData }
    } else if (response.status === 401) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("username")
      localStorage.removeItem("userRole")
      window.location.href = "login.html"
      return { success: false, error: "Unauthorized" }
    } else {
      const errorData = await response.json()
      return { success: false, error: errorData.message || "Failed to update profile" }
    }
  } catch (error) {
    console.error("Profile update error:", error)
    return { success: false, error: "Network error" }
  }
}

// Create role-specific fields
function createRoleSpecificFields(role, userData) {
  let fieldsHTML = ""

  switch (role.toLowerCase()) {
    case "student":
      fieldsHTML = `
        <div class="profile-card">
          <h3>
            <i class="fas fa-graduation-cap"></i>
            Academic Information
          </h3>
          <div class="form-row">
            <div class="form-group">
              <label for="department">Department</label>
              <div class="input-wrapper">
                <i class="fas fa-building"></i>
                <input type="text" id="department" name="department" value="${userData.department || ""}" required>
              </div>
              <span class="error-message" id="departmentError"></span>
            </div>
            <div class="form-group">
              <label for="cgpa">CGPA</label>
              <div class="input-wrapper">
                <i class="fas fa-chart-line"></i>
                <input type="number" id="cgpa" name="cgpa" step="0.01" min="0" max="10" value="${userData.cgpa || ""}" required>
              </div>
              <span class="error-message" id="cgpaError"></span>
            </div>
          </div>
        </div>
      `
      break

    case "trainer":
      fieldsHTML = `
        <div class="profile-card">
          <h3>
            <i class="fas fa-chalkboard-teacher"></i>
            Professional Information
          </h3>
          <div class="form-row">
            <div class="form-group">
              <label for="expertise">Area of Expertise</label>
              <div class="input-wrapper">
                <i class="fas fa-lightbulb"></i>
                <input type="text" id="expertise" name="expertise" value="${userData.expertise || ""}" required>
              </div>
              <span class="error-message" id="expertiseError"></span>
            </div>
            <div class="form-group">
              <label for="experience">Years of Experience</label>
              <div class="input-wrapper">
                <i class="fas fa-calendar-alt"></i>
                <input type="number" id="experience" name="experience" min="0" value="${userData.experience || ""}" required>
              </div>
              <span class="error-message" id="experienceError"></span>
            </div>
          </div>
        </div>
      `
      break

    case "recruiter":
      fieldsHTML = `
        <div class="profile-card">
          <h3>
            <i class="fas fa-briefcase"></i>
            Company Information
          </h3>
          <div class="form-row">
            <div class="form-group">
              <label for="company">Company Name</label>
              <div class="input-wrapper">
                <i class="fas fa-building"></i>
                <input type="text" id="company" name="company" value="${userData.company || ""}" required>
              </div>
              <span class="error-message" id="companyError"></span>
            </div>
            <div class="form-group">
              <label for="position">Position</label>
              <div class="input-wrapper">
                <i class="fas fa-user-tie"></i>
                <input type="text" id="position" name="position" value="${userData.position || ""}" required>
              </div>
              <span class="error-message" id="positionError"></span>
            </div>
          </div>
        </div>
      `
      break
  }

  roleSpecificFields.innerHTML = fieldsHTML
}

// Populate form with user data
function populateForm(userData) {
  currentUserData = userData
  userId = userData.id

  // Basic information
  fullNameInput.value = userData.fullName || ""
  usernameInput.value = userData.username || ""
  emailInput.value = userData.email || ""
  roleInput.value = userData.role || ""

  // Update header
  profileName.textContent = userData.fullName || userData.username || "User"
  profileRole.textContent = userData.role || "User"
  avatarText.textContent = (userData.fullName || userData.username || "U").charAt(0).toUpperCase()

  // Create role-specific fields
  createRoleSpecificFields(userData.role, userData)

  // Update localStorage with fresh data
  localStorage.setItem("userFullName", userData.fullName || "")
  localStorage.setItem("userEmail", userData.email || "")
}

// Validate form
function validateForm() {
  let isValid = true

  // Clear previous errors
  fullNameError.textContent = ""
  emailError.textContent = ""

  // Validate basic fields
  const fullNameErr = validateFullName(fullNameInput.value)
  if (fullNameErr) {
    fullNameError.textContent = fullNameErr
    isValid = false
  }

  const emailErr = validateEmail(emailInput.value)
  if (emailErr) {
    emailError.textContent = emailErr
    isValid = false
  }

  // Validate role-specific fields
  const role = roleInput.value.toLowerCase()

  if (role === "student") {
    const department = document.getElementById("department")
    const cgpa = document.getElementById("cgpa")
    const departmentError = document.getElementById("departmentError")
    const cgpaError = document.getElementById("cgpaError")

    if (!department.value.trim()) {
      departmentError.textContent = "Department is required"
      isValid = false
    }

    if (!cgpa.value || cgpa.value < 0 || cgpa.value > 10) {
      cgpaError.textContent = "Please enter a valid CGPA (0-10)"
      isValid = false
    }
  } else if (role === "trainer") {
    const expertise = document.getElementById("expertise")
    const experience = document.getElementById("experience")
    const expertiseError = document.getElementById("expertiseError")
    const experienceError = document.getElementById("experienceError")

    if (!expertise.value.trim()) {
      expertiseError.textContent = "Area of expertise is required"
      isValid = false
    }

    if (!experience.value || experience.value < 0) {
      experienceError.textContent = "Please enter valid years of experience"
      isValid = false
    }
  } else if (role === "recruiter") {
    const company = document.getElementById("company")
    const position = document.getElementById("position")
    const companyError = document.getElementById("companyError")
    const positionError = document.getElementById("positionError")

    if (!company.value.trim()) {
      companyError.textContent = "Company name is required"
      isValid = false
    }

    if (!position.value.trim()) {
      positionError.textContent = "Position is required"
      isValid = false
    }
  }

  return isValid
}

// Collect form data
function collectFormData() {
  const formData = {
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
  }

  const role = roleInput.value.toLowerCase()

  if (role === "student") {
    formData.department = document.getElementById("department").value.trim()
    formData.cgpa = Number.parseFloat(document.getElementById("cgpa").value)
  } else if (role === "trainer") {
    formData.expertise = document.getElementById("expertise").value.trim()
    formData.experience = Number.parseInt(document.getElementById("experience").value)
  } else if (role === "recruiter") {
    formData.company = document.getElementById("company").value.trim()
    formData.position = document.getElementById("position").value.trim()
  }

  return formData
}

// Handle form submission
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  if (!validateForm()) {
    return
  }

  const auth = checkAuth()
  if (!auth) return

  setLoading(true)

  try {
    const formData = collectFormData()
    const result = await updateUserProfile(userId, formData, auth.token)

    if (result.success) {
      showToast("Profile updated successfully!")

      // Update localStorage with new data
      localStorage.setItem("userFullName", formData.fullName)
      localStorage.setItem("userEmail", formData.email)

      // Update header with new data
      profileName.textContent = formData.fullName
      avatarText.textContent = formData.fullName.charAt(0).toUpperCase()
    } else {
      showToast(result.error, true)
    }
  } catch (error) {
    showToast("An unexpected error occurred. Please try again.", true)
  } finally {
    setLoading(false)
  }
})

// Real-time validation
fullNameInput.addEventListener("input", function () {
  if (this.value.trim() && fullNameError.textContent) {
    const error = validateFullName(this.value)
    fullNameError.textContent = error
  }
})

emailInput.addEventListener("input", function () {
  if (this.value.trim() && emailError.textContent) {
    const error = validateEmail(this.value)
    emailError.textContent = error
  }
})

// Initialize profile page
async function initializeProfile() {
  const auth = checkAuth()
  if (!auth) return

  try {
    const result = await fetchUserProfile(auth.username, auth.token)

    if (result.success) {
      populateForm(result.data)
    } else {
      // Use fallback data from localStorage
      const fallbackData = {
        fullName: localStorage.getItem("userFullName") || auth.username,
        username: auth.username,
        email: localStorage.getItem("userEmail") || "",
        role: localStorage.getItem("userRole") || "student",
      }
      populateForm(fallbackData)
      showToast("Could not load latest profile data. Using cached information.", true)
    }
  } catch (error) {
    console.error("Profile initialization error:", error)
    showToast("Failed to load profile data.", true)
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initializeProfile)

// Avatar click handler (placeholder for future image upload)
profileAvatar.addEventListener("click", () => {
  showToast("Profile picture upload coming soon!", false)
})
