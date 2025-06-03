// API Configuration
const API_BASE_URL = "http://localhost:8080"

// DOM Elements
const searchForm = document.getElementById("searchForm")
const searchNameInput = document.getElementById("searchName")
const searchDepartmentSelect = document.getElementById("searchDepartment")
const clearBtn = document.getElementById("clearBtn")
const tableContainer = document.getElementById("tableContainer")
const resultsCount = document.getElementById("resultsCount")

let currentStudents = []
let userRole = ""

// Authentication check
function checkAuth() {
  const token = localStorage.getItem("authToken")
  const username = localStorage.getItem("username")
  const role = localStorage.getItem("userRole")

  if (!token || !username) {
    window.location.href = "/login.html"
    return false
  }

  // Check if user has permission to view students
  if (role !== "admin" && role !== "recruiter") {
    window.location.href = "dashboard.html"
    return false
  }

  userRole = role
  return { token, username, role }
}

// Fetch students data
async function fetchStudents(searchParams = {}) {
  const auth = checkAuth()
  if (!auth) return

  try {
    let url = `${API_BASE_URL}/api/students`

    // Build query parameters
    const params = new URLSearchParams()
    if (searchParams.name) params.append("name", searchParams.name)
    if (searchParams.department) params.append("department", searchParams.department)

    if (params.toString()) {
      url = `${API_BASE_URL}/api/search/students?${params.toString()}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const students = await response.json()
      return { success: true, data: students }
    } else if (response.status === 401) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("username")
      localStorage.removeItem("userRole")
      window.location.href = "login.html"
      return { success: false, error: "Unauthorized" }
    } else {
      return { success: false, error: "Failed to fetch students" }
    }
  } catch (error) {
    console.error("Students fetch error:", error)
    return { success: false, error: "Network error" }
  }
}

// Get CGPA badge class
function getCGPABadgeClass(cgpa) {
  if (cgpa >= 8.0) return "high"
  if (cgpa >= 6.0) return "medium"
  return "low"
}

// Create students table
function createStudentsTable(students) {
  if (students.length === 0) {
    return `
      <div class="empty-state">
        <i class="fas fa-user-graduate"></i>
        <h3>No students found</h3>
        <p>Try adjusting your search criteria</p>
      </div>
    `
  }

  const tableHTML = `
    <table class="students-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Department</th>
          <th>Email</th>
          <th>CGPA</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${students
          .map(
            (student) => `
          <tr>
            <td>
              <div class="student-info">
                <div class="student-avatar">
                  ${(student.fullName || student.username || "S").charAt(0).toUpperCase()}
                </div>
                <div class="student-details">
                  <h4>${student.fullName || student.username}</h4>
                  <p>ID: ${student.id || student.username}</p>
                </div>
              </div>
            </td>
            <td>${student.department || "N/A"}</td>
            <td>${student.email || "N/A"}</td>
            <td>
              <span class="cgpa-badge ${getCGPABadgeClass(student.cgpa || 0)}">
                ${student.cgpa ? student.cgpa.toFixed(2) : "N/A"}
              </span>
            </td>
            <td>
              <a href="student.html?id=${student.id || student.username}" class="action-btn">
                <i class="fas fa-eye"></i>
                View
              </a>
            </td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `

  return tableHTML
}

// Display students
function displayStudents(students) {
  currentStudents = students
  tableContainer.innerHTML = createStudentsTable(students)
  resultsCount.textContent = `${students.length} student${students.length !== 1 ? "s" : ""} found`
}

// Show loading state
function showLoading() {
  tableContainer.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading students...</p>
    </div>
  `
  resultsCount.textContent = "Loading..."
}

// Show error state
function showError(message) {
  tableContainer.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Error</h3>
      <p>${message}</p>
    </div>
  `
  resultsCount.textContent = "Error loading data"
}

// Handle search form submission
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  showLoading()

  const searchParams = {
    name: searchNameInput.value.trim(),
    department: searchDepartmentSelect.value,
  }

  try {
    const result = await fetchStudents(searchParams)

    if (result.success) {
      displayStudents(result.data)
    } else {
      showError(result.error)
    }
  } catch (error) {
    showError("An unexpected error occurred")
  }
})

// Handle clear button
clearBtn.addEventListener("click", () => {
  searchNameInput.value = ""
  searchDepartmentSelect.value = ""
  loadAllStudents()
})

// Load all students
async function loadAllStudents() {
  showLoading()

  try {
    const result = await fetchStudents()

    if (result.success) {
      displayStudents(result.data)
    } else {
      showError(result.error)
    }
  } catch (error) {
    showError("An unexpected error occurred")
  }
}

// Real-time search (debounced)
let searchTimeout
searchNameInput.addEventListener("input", () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchNameInput.value.trim().length >= 2 || searchNameInput.value.trim().length === 0) {
      searchForm.dispatchEvent(new Event("submit"))
    }
  }, 500)
})

searchDepartmentSelect.addEventListener("change", () => {
  searchForm.dispatchEvent(new Event("submit"))
})

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  const auth = checkAuth()
  if (auth) {
    loadAllStudents()
  }
})

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + F to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "f") {
    e.preventDefault()
    searchNameInput.focus()
  }

  // Escape to clear search
  if (e.key === "Escape") {
    clearBtn.click()
  }
})
