// Profile page JavaScript

class ProfileManager {
  constructor() {
    this.currentUser = this.getCurrentUser()
    this.userRole = this.getUserRole()
    this.currentTab = "personal"
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
    return userStr ? JSON.parse(userStr) : null
  }

  getUserRole() {
    if (!this.currentUser || !this.currentUser.roles) {
      return null
    }

    const role = this.currentUser.roles[0]
    return role ? role.replace("ROLE_", "").toLowerCase() : null
  }

  async initialize() {
    // Check authentication
    if (!this.currentUser) {
      window.location.href = "/login.html"
      return
    }

    // Setup tabs based on user role
    this.setupTabs()

    // Load profile data
    await this.loadProfileData()

    // Initialize form handlers
    this.initializeFormHandlers()

    // Initialize tab switching
    this.initializeTabSwitching()
  }

  setupTabs() {
    const academicTab = document.getElementById("academicTab")
    const professionalTab = document.getElementById("professionalTab")

    // Show/hide tabs based on user role
    if (academicTab) {
      academicTab.style.display = this.userRole === "student" ? "block" : "none"
    }

    if (professionalTab) {
      professionalTab.style.display = this.userRole === "trainer" || this.userRole === "recruiter" ? "block" : "none"
    }
  }

  async loadProfileData() {
    try {
      // Show loading state
      this.showLoading()

      // Load profile data from API
      const profileData = await window.api.getCurrentUserProfile()

      // Update profile header
      this.updateProfileHeader(profileData)

      // Load profile stats
      await this.loadProfileStats()

      // Populate forms
      this.populateForms(profileData)
    } catch (error) {
      console.error("Error loading profile data:", error)
      this.showError("Failed to load profile data")
    } finally {
      this.hideLoading()
    }
  }

  updateProfileHeader(profileData) {
    const profileName = document.getElementById("profileName")
    const profileRole = document.getElementById("profileRole")

    if (profileName) {
      profileName.textContent = profileData.fullName || this.currentUser.username
    }

    if (profileRole) {
      profileRole.textContent = this.userRole.charAt(0).toUpperCase() + this.userRole.slice(1)
    }
  }

  async loadProfileStats() {
    const profileStats = document.getElementById("profileStats")
    if (!profileStats) return

    try {
      let stats = []

      switch (this.userRole) {
        case "student":
          const [applications, interviews, enrollments] = await Promise.all([
            window.api.getStudentApplications().catch(() => []),
            window.api.getStudentInterviews().catch(() => []),
            window.api.getStudentEnrollments().catch(() => []),
          ])

          stats = [
            { value: applications.length, label: "Applications" },
            { value: interviews.length, label: "Interviews" },
            { value: enrollments.length, label: "Trainings" },
          ]
          break

        case "trainer":
          const trainings = await window.api.getTrainerTrainings().catch(() => [])
          stats = [
            { value: trainings.length, label: "Trainings" },
            { value: trainings.filter((t) => t.status === "ACTIVE").length, label: "Active" },
            { value: trainings.filter((t) => t.status === "COMPLETED").length, label: "Completed" },
          ]
          break

        case "recruiter":
          const [jobs, jobApplications] = await Promise.all([
            window.api.getRecruiterJobs().catch(() => []),
            window.api.getAllApplications().catch(() => []),
          ])

          const recruiterApplications = jobApplications.filter((app) => jobs.some((job) => job.id === app.jobId))

          stats = [
            { value: jobs.length, label: "Job Posts" },
            { value: recruiterApplications.length, label: "Applications" },
            { value: jobs.filter((j) => j.status === "ACTIVE").length, label: "Active Jobs" },
          ]
          break

        default:
          stats = [
            { value: 0, label: "Activity" },
            { value: 0, label: "Completed" },
            { value: 0, label: "Pending" },
          ]
      }

      profileStats.innerHTML = stats
        .map(
          (stat) => `
        <div class="stat">
          <span class="stat-value">${stat.value}</span>
          <span class="stat-label">${stat.label}</span>
        </div>
      `,
        )
        .join("")
    } catch (error) {
      console.error("Error loading profile stats:", error)
      profileStats.innerHTML = '<div class="error">Error loading stats</div>'
    }
  }

  populateForms(profileData) {
    // Personal information form
    this.populatePersonalForm(profileData)

    // Role-specific forms
    if (this.userRole === "student") {
      this.populateAcademicForm(profileData)
    } else if (this.userRole === "trainer" || this.userRole === "recruiter") {
      this.populateProfessionalForm(profileData)
    }
  }

  populatePersonalForm(profileData) {
    const fields = {
      fullName: profileData.fullName || "",
      email: profileData.email || this.currentUser.username,
      phone: profileData.phone || "",
      dateOfBirth: profileData.dateOfBirth || "",
      address: profileData.address || "",
      city: profileData.city || "",
      state: profileData.state || "",
      zipCode: profileData.zipCode || "",
      country: profileData.country || "",
    }

    Object.entries(fields).forEach(([fieldName, value]) => {
      const field = document.getElementById(fieldName)
      if (field) {
        field.value = value
      }
    })
  }

  populateAcademicForm(profileData) {
    const fields = {
      studentId: profileData.studentId || "",
      department: profileData.department || "",
      cgpa: profileData.cgpa || "",
      graduationYear: profileData.graduationYear || "",
    }

    Object.entries(fields).forEach(([fieldName, value]) => {
      const field = document.getElementById(fieldName)
      if (field) {
        field.value = value
      }
    })
  }

  populateProfessionalForm(profileData) {
    const fields = {
      company: profileData.company || "",
      position: profileData.position || "",
      experience: profileData.experience || "",
      expertise: profileData.expertise || "",
    }

    Object.entries(fields).forEach(([fieldName, value]) => {
      const field = document.getElementById(fieldName)
      if (field) {
        field.value = value
      }
    })
  }

  initializeFormHandlers() {
    // Personal form
    const personalForm = document.getElementById("personalForm")
    if (personalForm) {
      personalForm.addEventListener("submit", (e) => this.handlePersonalFormSubmit(e))
    }

    // Academic form
    const academicForm = document.getElementById("academicForm")
    if (academicForm) {
      academicForm.addEventListener("submit", (e) => this.handleAcademicFormSubmit(e))
    }

    // Professional form
    const professionalForm = document.getElementById("professionalForm")
    if (professionalForm) {
      professionalForm.addEventListener("submit", (e) => this.handleProfessionalFormSubmit(e))
    }

    // Security form
    const securityForm = document.getElementById("securityForm")
    if (securityForm) {
      securityForm.addEventListener("submit", (e) => this.handleSecurityFormSubmit(e))
    }

    // Password validation
    const newPassword = document.getElementById("newPassword")
    const confirmNewPassword = document.getElementById("confirmNewPassword")

    if (newPassword) {
      newPassword.addEventListener("input", () => this.validatePasswords())
    }

    if (confirmNewPassword) {
      confirmNewPassword.addEventListener("input", () => this.validatePasswords())
    }
  }

  initializeTabSwitching() {
    const tabButtons = document.querySelectorAll(".tab-btn")

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabName = button.textContent.toLowerCase().replace(/\s+/g, "")
        this.switchTab(tabName)
      })
    })
  }

  switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active")
    })

    const activeButton = Array.from(document.querySelectorAll(".tab-btn")).find((btn) =>
      btn.textContent.toLowerCase().replace(/\s+/g, "").includes(tabName),
    )

    if (activeButton) {
      activeButton.classList.add("active")
    }

    // Update active tab pane
    document.querySelectorAll(".tab-pane").forEach((pane) => {
      pane.classList.remove("active")
    })

    const tabMap = {
      personalinfo: "personalTab",
      personal: "personalTab",
      academic: "academicTab",
      professional: "professionalTab",
      security: "securityTab",
    }

    const targetTab = document.getElementById(tabMap[tabName])
    if (targetTab) {
      targetTab.classList.add("active")
    }

    this.currentTab = tabName
  }

  async handlePersonalFormSubmit(event) {
    event.preventDefault()

    const form = event.target
    const submitBtn = form.querySelector('button[type="submit"]')

    try {
      this.showFormLoading(form, submitBtn)

      const formData = new FormData(form)
      const profileData = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        dateOfBirth: formData.get("dateOfBirth"),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        zipCode: formData.get("zipCode"),
        country: formData.get("country"),
      }

      await window.api.updateCurrentUserProfile(profileData)

      this.showSuccess("Personal information updated successfully!")
      this.markFormAsSuccess(form)
    } catch (error) {
      console.error("Error updating personal information:", error)
      this.showError("Failed to update personal information")
      this.markFormAsError(form)
    } finally {
      this.hideFormLoading(form, submitBtn)
    }
  }

  async handleAcademicFormSubmit(event) {
    event.preventDefault()

    const form = event.target
    const submitBtn = form.querySelector('button[type="submit"]')

    try {
      this.showFormLoading(form, submitBtn)

      const formData = new FormData(form)
      const academicData = {
        studentId: formData.get("studentId"),
        department: formData.get("department"),
        cgpa: Number.parseFloat(formData.get("cgpa")) || null,
        graduationYear: Number.parseInt(formData.get("graduationYear")) || null,
      }

      await window.api.updateStudentProfile(academicData)

      this.showSuccess("Academic information updated successfully!")
      this.markFormAsSuccess(form)
    } catch (error) {
      console.error("Error updating academic information:", error)
      this.showError("Failed to update academic information")
      this.markFormAsError(form)
    } finally {
      this.hideFormLoading(form, submitBtn)
    }
  }

  async handleProfessionalFormSubmit(event) {
    event.preventDefault()

    const form = event.target
    const submitBtn = form.querySelector('button[type="submit"]')

    try {
      this.showFormLoading(form, submitBtn)

      const formData = new FormData(form)
      const professionalData = {
        company: formData.get("company"),
        position: formData.get("position"),
        experience: Number.parseInt(formData.get("experience")) || null,
        expertise: formData.get("expertise"),
      }

      // Use appropriate API based on user role
      if (this.userRole === "trainer") {
        await window.api.updateTrainerProfile(professionalData)
      } else if (this.userRole === "recruiter") {
        await window.api.updateRecruiterProfile(professionalData)
      }

      this.showSuccess("Professional information updated successfully!")
      this.markFormAsSuccess(form)
    } catch (error) {
      console.error("Error updating professional information:", error)
      this.showError("Failed to update professional information")
      this.markFormAsError(form)
    } finally {
      this.hideFormLoading(form, submitBtn)
    }
  }

  async handleSecurityFormSubmit(event) {
    event.preventDefault()

    const form = event.target
    const submitBtn = form.querySelector('button[type="submit"]')

    // Validate passwords
    if (!this.validatePasswords()) {
      this.showError("Please check your password entries")
      return
    }

    try {
      this.showFormLoading(form, submitBtn)

      const formData = new FormData(form)
      const passwordData = {
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
      }

      await window.api.changePassword(passwordData)

      this.showSuccess("Password updated successfully!")
      this.markFormAsSuccess(form)

      // Clear password fields
      form.reset()
    } catch (error) {
      console.error("Error updating password:", error)
      this.showError("Failed to update password. Please check your current password.")
      this.markFormAsError(form)
    } finally {
      this.hideFormLoading(form, submitBtn)
    }
  }

  validatePasswords() {
    const newPassword = document.getElementById("newPassword")
    const confirmNewPassword = document.getElementById("confirmNewPassword")

    if (!newPassword || !confirmNewPassword) return true

    const password = newPassword.value
    const confirmPassword = confirmNewPassword.value

    // Clear previous validation states
    newPassword.classList.remove("error", "success")
    confirmNewPassword.classList.remove("error", "success")

    // Validate password strength
    if (password && password.length < 8) {
      newPassword.classList.add("error")
      this.showFieldError(newPassword, "Password must be at least 8 characters long")
      return false
    }

    // Validate password match
    if (password && confirmPassword && password !== confirmPassword) {
      confirmNewPassword.classList.add("error")
      this.showFieldError(confirmNewPassword, "Passwords do not match")
      return false
    }

    // Mark as valid
    if (password && password.length >= 8) {
      newPassword.classList.add("success")
    }

    if (confirmPassword && password === confirmPassword) {
      confirmNewPassword.classList.add("success")
    }

    return true
  }

  showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentNode.querySelector(".field-message")
    if (existingError) {
      existingError.remove()
    }

    // Add new error message
    const errorDiv = document.createElement("div")
    errorDiv.className = "field-message error"
    errorDiv.textContent = message
    field.parentNode.appendChild(errorDiv)
  }

  showFormLoading(form, submitBtn) {
    form.classList.add("form-loading")
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'
    }
  }

  hideFormLoading(form, submitBtn) {
    form.classList.remove("form-loading")
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.innerHTML = "Save Changes"
    }
  }

  markFormAsSuccess(form) {
    form.classList.add("form-success")
    setTimeout(() => {
      form.classList.remove("form-success")
    }, 3000)
  }

  markFormAsError(form) {
    form.classList.add("form-error")
    setTimeout(() => {
      form.classList.remove("form-error")
    }, 3000)
  }

  showLoading() {
    const loadingElements = document.querySelectorAll("#profileName, #profileRole")
    loadingElements.forEach((el) => {
      if (el) el.textContent = "Loading..."
    })
  }

  hideLoading() {
    // Loading state will be cleared when data is populated
  }

  showSuccess(message) {
    this.showNotification(message, "success")
  }

  showError(message) {
    this.showNotification(message, "error")
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `profile-notification ${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `

    // Add to page
    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove()
        }
      }, 300)
    }, 5000)
  }

  getNotificationIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    }
    return icons[type] || "info-circle"
  }
}

// Global profile manager instance
window.profileManager = new ProfileManager()

// Global functions for onclick handlers
function switchTab(tabName) {
  window.profileManager.switchTab(tabName)
}

function resetForm(formId) {
  const form = document.getElementById(formId)
  if (form) {
    form.reset()

    // Clear validation states
    form.querySelectorAll(".error, .success").forEach((el) => {
      el.classList.remove("error", "success")
    })

    // Clear error messages
    form.querySelectorAll(".field-message").forEach((el) => {
      el.remove()
    })
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.profileManager.initialize()
})

// Add CSS for profile notifications
const style = document.createElement("style")
style.textContent = `
  .profile-notification {
    position: fixed;
    top: 20px;
    right: 20px;
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
    z-index: 10000;
  }

  .profile-notification.show {
    transform: translateX(0);
  }

  .profile-notification.success {
    border-left: 4px solid var(--success-color);
  }

  .profile-notification.error {
    border-left: 4px solid var(--error-color);
  }

  .profile-notification.warning {
    border-left: 4px solid var(--warning-color);
  }

  .profile-notification.info {
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

  .form-loading {
    opacity: 0.6;
    pointer-events: none;
  }

  .form-success {
    animation: success-flash 0.5s ease-in-out;
  }

  .form-error {
    animation: error-shake 0.5s ease-in-out;
  }

  @keyframes success-flash {
    0%, 100% { background-color: transparent; }
    50% { background-color: rgba(16, 185, 129, 0.1); }
  }

  @keyframes error-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  .field-message {
    margin-top: var(--spacing-1);
    font-size: var(--font-size-sm);
  }

  .field-message.error {
    color: var(--error-color);
  }

  .field-message.success {
    color: var(--success-color);
  }
`
document.head.appendChild(style)
