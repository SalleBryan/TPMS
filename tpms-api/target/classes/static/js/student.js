// API Configuration
const API_BASE_URL = "http://localhost:8080"

// DOM Elements
const studentContainer = document.getElementById("studentContainer")

let currentStudent = {}
let userRole = ""

// Authentication check
function checkAuth() {
  const token = localStorage.getItem("authToken")
  const username = localStorage.getItem("username")
  const role = localStorage.getItem("userRole")

  if (!token || !username) {
    window.location.href = "login.html"
    return false
  }

  userRole = role
  return { token, username, role }
}

// Get student ID from URL
function getStudentIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("id")
}

// Fetch student data
async function fetchStudentData(studentId) {
  const auth = checkAuth()
  if (!auth) return

  try {
    const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const student = await response.json()
      return { success: true, data: student }
    } else if (response.status === 401) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("username")
      localStorage.removeItem("userRole")
      window.location.href = "login.html"
      return { success: false, error: "Unauthorized" }
    } else if (response.status === 404) {
      return { success: false, error: "Student not found" }
    } else {
      return { success: false, error: "Failed to fetch student data" }
    }
  } catch (error) {
    console.error("Student fetch error:", error)
    return { success: false, error: "Network error" }
  }
}

// Fetch student training history
async function fetchTrainingHistory(studentId) {
  const auth = checkAuth()
  if (!auth) return { success: false, data: [] }

  try {
    const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/training`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const history = await response.json()
      return { success: true, data: history }
    } else {
      return { success: false, data: [] }
    }
  } catch (error) {
    console.error("Training history fetch error:", error)
    return { success: false, data: [] }
  }
}

// Fetch student job applications
async function fetchJobApplications(studentId) {
  const auth = checkAuth()
  if (!auth) return { success: false, data: [] }

  try {
    const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/applications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const applications = await response.json()
      return { success: true, data: applications }
    } else {
      return { success: false, data: [] }
    }
  } catch (error) {
    console.error("Job applications fetch error:", error)
    return { success: false, data: [] }
  }
}

// Delete student (admin only)
async function deleteStudent(studentId) {
  const auth = checkAuth()
  if (!auth || auth.role !== "admin") return

  if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      alert("Student deleted successfully")
      window.location.href = "students.html"
    } else {
      alert("Failed to delete student")
    }
  } catch (error) {
    console.error("Delete student error:", error)
    alert("Network error occurred")
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Get status badge class
function getStatusBadgeClass(status) {
  switch (status?.toLowerCase()) {
    case "completed":
      return "completed"
    case "in-progress":
    case "enrolled":
      return "in-progress"
    case "pending":
      return "pending"
    case "rejected":
      return "rejected"
    default:
      return "pending"
  }
}

// Create training history HTML
function createTrainingHistoryHTML(trainingHistory) {
  if (trainingHistory.length === 0) {
    return `
      <div class="empty-state">
        <i class="fas fa-graduation-cap"></i>
        <h4>No training history</h4>
        <p>This student hasn't enrolled in any training programs yet.</p>
      </div>
    `
  }

  return `
    <ul class="history-list">
      ${trainingHistory
        .map(
          (training) => `
        <li class="history-item">
          <div class="history-header">
            <h4 class="history-title">${training.courseName || training.title || "Training Program"}</h4>
            <span class="history-date">${formatDate(training.enrollmentDate || training.startDate)}</span>
          </div>
          <p class="history-description">
            ${training.description || training.courseDescription || "No description available"}
          </p>
          <span class="status-badge ${getStatusBadgeClass(training.status)}">
            ${training.status || "Enrolled"}
          </span>
        </li>
      `,
        )
        .join("")}
    </ul>
  `
}

// Create job applications HTML
function createJobApplicationsHTML(applications) {
  if (applications.length === 0) {
    return `
      <div class="empty-state">
        <i class="fas fa-briefcase"></i>
        <h4>No job applications</h4>
        <p>This student hasn't applied for any jobs yet.</p>
      </div>
    `
  }

  return `
    <ul class="history-list">
      ${applications
        .map(
          (application) => `
        <li class="history-item">
          <div class="history-header">
            <h4 class="history-title">${application.jobTitle || application.position || "Job Application"}</h4>
            <span class="history-date">${formatDate(application.applicationDate || application.appliedDate)}</span>
          </div>
          <p class="history-description">
            <strong>Company:</strong> ${application.company || application.companyName || "N/A"}<br>
            ${application.description || application.jobDescription || "No description available"}
          </p>
          <span class="status-badge ${getStatusBadgeClass(application.status)}">
            ${application.status || "Applied"}
          </span>
        </li>
      `,
        )
        .join("")}
    </ul>
  `
}

// Create student profile HTML
function createStudentProfileHTML(student, trainingHistory, jobApplications) {
  const isAdmin = userRole === "admin"

  return `
    <div class="student-header">
      <div class="student-profile">
        <div class="student-avatar">
          ${(student.fullName || student.username || "S").charAt(0).toUpperCase()}
        </div>
        <div class="student-info">
          <h1>${student.fullName || student.username}</h1>
          <p><i class="fas fa-id-card"></i> Student ID: ${student.id || student.username}</p>
          <p><i class="fas fa-envelope"></i> ${student.email || "No email provided"}</p>
          <p><i class="fas fa-building"></i> ${student.department || "No department specified"}</p>
          <div class="student-badges">
            <span class="badge">
              <i class="fas fa-chart-line"></i>
              CGPA: ${student.cgpa ? student.cgpa.toFixed(2) : "N/A"}
            </span>
            <span class="badge">
              <i class="fas fa-calendar"></i>
              Joined: ${formatDate(student.joinDate || student.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-card">
      <h3>
        <i class="fas fa-user"></i>
        Personal Information
      </h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Full Name</span>
          <span class="info-value">${student.fullName || "Not provided"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Username</span>
          <span class="info-value">${student.username || "Not provided"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Email</span>
          <span class="info-value">${student.email || "Not provided"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Department</span>
          <span class="info-value">${student.department || "Not specified"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">CGPA</span>
          <span class="info-value">${student.cgpa ? student.cgpa.toFixed(2) : "Not available"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Phone</span>
          <span class="info-value">${student.phone || "Not provided"}</span>
        </div>
      </div>
    </div>

    <div class="profile-card">
      <h3>
        <i class="fas fa-history"></i>
        Academic & Career History
      </h3>
      <div class="history-section">
        <div class="history-tabs">
          <button class="tab-btn active" data-tab="training">
            <i class="fas fa-graduation-cap"></i>
            Training Programs
          </button>
          <button class="tab-btn" data-tab="applications">
            <i class="fas fa-briefcase"></i>
            Job Applications
          </button>
        </div>
        
        <div class="tab-content active" id="training-tab">
          ${createTrainingHistoryHTML(trainingHistory)}
        </div>
        
        <div class="tab-content" id="applications-tab">
          ${createJobApplicationsHTML(jobApplications)}
        </div>
      </div>
    </div>

    ${
      isAdmin
        ? `
      <div class="admin-actions">
        <h3>
          <i class="fas fa-tools"></i>
          Admin Actions
        </h3>
        <div class="action-buttons">
          <button class="btn-danger btn-edit" onclick="editStudent('${student.id || student.username}')">
            <i class="fas fa-edit"></i>
            Edit Student
          </button>
          <button class="btn-danger" onclick="deleteStudent('${student.id || student.username}')">
            <i class="fas fa-trash"></i>
            Delete Student
          </button>
        </div>
      </div>
    `
        : ""
    }
  `
}

// Show loading state
function showLoading() {
  studentContainer.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading student profile...</p>
    </div>
  `
}

// Show error state
function showError(message) {
  studentContainer.innerHTML = `
    <div class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Error</h3>
      <p>${message}</p>
      <a href="students.html" class="btn-primary" style="margin-top: 1rem;">
        <i class="fas fa-arrow-left"></i>
        Back to Directory
      </a>
    </div>
  `
}

// Edit student (placeholder)
function editStudent(studentId) {
  alert(`Edit functionality for student ${studentId} will be implemented in a future version.`)
}

// Handle tab switching
function setupTabSwitching() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all tabs and content
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"))
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"))

      // Add active class to clicked tab
      btn.classList.add("active")

      // Show corresponding content
      const tabName = btn.getAttribute("data-tab")
      document.getElementById(`${tabName}-tab`).classList.add("active")
    })
  })
}

// Load student profile
async function loadStudentProfile() {
  const studentId = getStudentIdFromURL()

  if (!studentId) {
    showError("No student ID provided")
    return
  }

  showLoading()

  try {
    // Fetch student data
    const studentResult = await fetchStudentData(studentId)

    if (!studentResult.success) {
      showError(studentResult.error)
      return
    }

    // Fetch additional data in parallel
    const [trainingResult, applicationsResult] = await Promise.all([
      fetchTrainingHistory(studentId),
      fetchJobApplications(studentId),
    ])

    const student = studentResult.data
    const trainingHistory = trainingResult.success ? trainingResult.data : []
    const jobApplications = applicationsResult.success ? applicationsResult.data : []

    // Display student profile
    studentContainer.innerHTML = createStudentProfileHTML(student, trainingHistory, jobApplications)

    // Setup tab switching
    setupTabSwitching()

    currentStudent = student
  } catch (error) {
    console.error("Load student profile error:", error)
    showError("An unexpected error occurred")
  }
}

// Make functions globally available
window.editStudent = editStudent
window.deleteStudent = deleteStudent

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  const auth = checkAuth()
  if (auth) {
    loadStudentProfile()
  }
})

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Escape to go back
  if (e.key === "Escape") {
    window.location.href = "students.html"
  }
})
