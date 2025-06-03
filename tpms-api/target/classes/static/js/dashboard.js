// Dashboard management for TPMS

// Import API module (assuming it's in a separate file)
import * as api from "./api.js"

class DashboardManager {
  constructor() {
    this.currentUser = this.getCurrentUser()
    this.userRole = this.getUserRole()
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

  async generateDashboardContent() {
    try {
      switch (this.userRole) {
        case "student":
          return await this.generateStudentDashboard()
        case "trainer":
          return await this.generateTrainerDashboard()
        case "recruiter":
          return await this.generateRecruiterDashboard()
        case "admin":
          return await this.generateAdminDashboard()
        default:
          return this.generateDefaultDashboard()
      }
    } catch (error) {
      console.error("Error generating dashboard:", error)
      return this.generateErrorDashboard()
    }
  }

  async generateStudentDashboard() {
    try {
      // Fetch student data
      const [applications, interviews, enrollments, jobs] = await Promise.all([
        api.getStudentApplications().catch(() => []),
        api.getStudentInterviews().catch(() => []),
        api.getStudentEnrollments().catch(() => []),
        api.getAllJobs().catch(() => []),
      ])

      const stats = {
        applications: applications.length,
        interviews: interviews.length,
        enrollments: enrollments.length,
        availableJobs: jobs.length,
      }

      return `
        <div class="dashboard-content">
          <div class="welcome-section">
            <h2>Welcome back, ${this.currentUser.username}!</h2>
            <p>Here's your academic and career progress overview.</p>
          </div>

          <div class="dashboard-grid">
            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Applications</span>
                <div class="stat-icon primary">
                  <i class="fas fa-file-alt"></i>
                </div>
              </div>
              <div class="stat-value">${stats.applications}</div>
              <div class="stat-change">
                <span>Total submitted</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Interviews</span>
                <div class="stat-icon success">
                  <i class="fas fa-calendar-check"></i>
                </div>
              </div>
              <div class="stat-value">${stats.interviews}</div>
              <div class="stat-change">
                <span>Scheduled</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Trainings</span>
                <div class="stat-icon info">
                  <i class="fas fa-book"></i>
                </div>
              </div>
              <div class="stat-value">${stats.enrollments}</div>
              <div class="stat-change">
                <span>Enrolled</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Job Opportunities</span>
                <div class="stat-icon warning">
                  <i class="fas fa-suitcase"></i>
                </div>
              </div>
              <div class="stat-value">${stats.availableJobs}</div>
              <div class="stat-change">
                <span>Available</span>
              </div>
            </div>
          </div>

          <div class="dashboard-sections">
            <div class="section">
              <div class="section-header">
                <h3>Recent Applications</h3>
                <a href="#applications" class="section-link">View All</a>
              </div>
              <div class="section-content">
                ${this.renderRecentApplications(applications.slice(0, 3))}
              </div>
            </div>

            <div class="section">
              <div class="section-header">
                <h3>Upcoming Interviews</h3>
                <a href="#interviews" class="section-link">View All</a>
              </div>
              <div class="section-content">
                ${this.renderUpcomingInterviews(interviews.slice(0, 3))}
              </div>
            </div>

            <div class="section">
              <div class="section-header">
                <h3>Latest Job Opportunities</h3>
                <a href="#jobs" class="section-link">View All</a>
              </div>
              <div class="section-content">
                ${this.renderLatestJobs(jobs.slice(0, 3))}
              </div>
            </div>
          </div>
        </div>
      `
    } catch (error) {
      console.error("Error generating student dashboard:", error)
      return this.generateErrorDashboard()
    }
  }

  async generateTrainerDashboard() {
    try {
      const [trainings, students] = await Promise.all([
        api.getTrainerTrainings().catch(() => []),
        api.getAllStudents().catch(() => []),
      ])

      const stats = {
        trainings: trainings.length,
        students: students.length,
        activeTrainings: trainings.filter((t) => t.status === "ACTIVE").length,
        completedTrainings: trainings.filter((t) => t.status === "COMPLETED").length,
      }

      return `
        <div class="dashboard-content">
          <div class="welcome-section">
            <h2>Welcome back, ${this.currentUser.username}!</h2>
            <p>Manage your trainings and track student progress.</p>
          </div>

          <div class="dashboard-grid">
            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Total Trainings</span>
                <div class="stat-icon primary">
                  <i class="fas fa-chalkboard-teacher"></i>
                </div>
              </div>
              <div class="stat-value">${stats.trainings}</div>
              <div class="stat-change">
                <span>Created</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Active Trainings</span>
                <div class="stat-icon success">
                  <i class="fas fa-play-circle"></i>
                </div>
              </div>
              <div class="stat-value">${stats.activeTrainings}</div>
              <div class="stat-change">
                <span>Currently running</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Students</span>
                <div class="stat-icon info">
                  <i class="fas fa-user-graduate"></i>
                </div>
              </div>
              <div class="stat-value">${stats.students}</div>
              <div class="stat-change">
                <span>Total enrolled</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Completed</span>
                <div class="stat-icon warning">
                  <i class="fas fa-check-circle"></i>
                </div>
              </div>
              <div class="stat-value">${stats.completedTrainings}</div>
              <div class="stat-change">
                <span>Trainings finished</span>
              </div>
            </div>
          </div>

          <div class="dashboard-sections">
            <div class="section">
              <div class="section-header">
                <h3>My Trainings</h3>
                <a href="#trainings" class="section-link">View All</a>
              </div>
              <div class="section-content">
                ${this.renderTrainerTrainings(trainings.slice(0, 3))}
              </div>
            </div>

            <div class="section">
              <div class="section-header">
                <h3>Quick Actions</h3>
              </div>
              <div class="section-content">
                <div class="quick-actions">
                  <button class="action-btn" onclick="navigation.showTrainingModal()">
                    <i class="fas fa-plus"></i>
                    <span>Create Training</span>
                  </button>
                  <button class="action-btn" onclick="navigation.navigateTo('students')">
                    <i class="fas fa-users"></i>
                    <span>View Students</span>
                  </button>
                  <button class="action-btn" onclick="navigation.navigateTo('trainings')">
                    <i class="fas fa-book"></i>
                    <span>Manage Trainings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    } catch (error) {
      console.error("Error generating trainer dashboard:", error)
      return this.generateErrorDashboard()
    }
  }

  async generateRecruiterDashboard() {
    try {
      const [jobs, applications] = await Promise.all([
        api.getRecruiterJobs().catch(() => []),
        api.getAllApplications().catch(() => []),
      ])

      // Filter applications for recruiter's jobs
      const recruiterApplications = applications.filter((app) => jobs.some((job) => job.id === app.jobId))

      const stats = {
        jobs: jobs.length,
        applications: recruiterApplications.length,
        activeJobs: jobs.filter((j) => j.status === "ACTIVE").length,
        pendingApplications: recruiterApplications.filter((a) => a.status === "PENDING").length,
      }

      return `
        <div class="dashboard-content">
          <div class="welcome-section">
            <h2>Welcome back, ${this.currentUser.username}!</h2>
            <p>Manage your job postings and review applications.</p>
          </div>

          <div class="dashboard-grid">
            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Job Postings</span>
                <div class="stat-icon primary">
                  <i class="fas fa-briefcase"></i>
                </div>
              </div>
              <div class="stat-value">${stats.jobs}</div>
              <div class="stat-change">
                <span>Total posted</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Active Jobs</span>
                <div class="stat-icon success">
                  <i class="fas fa-play-circle"></i>
                </div>
              </div>
              <div class="stat-value">${stats.activeJobs}</div>
              <div class="stat-change">
                <span>Currently open</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Applications</span>
                <div class="stat-icon info">
                  <i class="fas fa-file-alt"></i>
                </div>
              </div>
              <div class="stat-value">${stats.applications}</div>
              <div class="stat-change">
                <span>Total received</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Pending Review</span>
                <div class="stat-icon warning">
                  <i class="fas fa-clock"></i>
                </div>
              </div>
              <div class="stat-value">${stats.pendingApplications}</div>
              <div class="stat-change">
                <span>Need attention</span>
              </div>
            </div>
          </div>

          <div class="dashboard-sections">
            <div class="section">
              <div class="section-header">
                <h3>My Job Postings</h3>
                <a href="#jobs" class="section-link">View All</a>
              </div>
              <div class="section-content">
                ${this.renderRecruiterJobs(jobs.slice(0, 3))}
              </div>
            </div>

            <div class="section">
              <div class="section-header">
                <h3>Recent Applications</h3>
                <a href="#applications" class="section-link">View All</a>
              </div>
              <div class="section-content">
                ${this.renderRecentApplications(recruiterApplications.slice(0, 3))}
              </div>
            </div>

            <div class="section">
              <div class="section-header">
                <h3>Quick Actions</h3>
              </div>
              <div class="section-content">
                <div class="quick-actions">
                  <button class="action-btn" onclick="navigation.showJobModal()">
                    <i class="fas fa-plus"></i>
                    <span>Post Job</span>
                  </button>
                  <button class="action-btn" onclick="navigation.navigateTo('applications')">
                    <i class="fas fa-file-alt"></i>
                    <span>Review Applications</span>
                  </button>
                  <button class="action-btn" onclick="navigation.navigateTo('interviews')">
                    <i class="fas fa-calendar-check"></i>
                    <span>Schedule Interviews</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    } catch (error) {
      console.error("Error generating recruiter dashboard:", error)
      return this.generateErrorDashboard()
    }
  }

  async generateAdminDashboard() {
    try {
      const [students, trainers, recruiters, jobs, trainings] = await Promise.all([
        api.getAllStudents().catch(() => []),
        api.getAllTrainers().catch(() => []),
        api.getAllRecruiters().catch(() => []),
        api.getAllJobs().catch(() => []),
        api.getAllTrainings().catch(() => []),
      ])

      const stats = {
        students: students.length,
        trainers: trainers.length,
        recruiters: recruiters.length,
        totalUsers: students.length + trainers.length + recruiters.length,
        jobs: jobs.length,
        trainings: trainings.length,
      }

      return `
        <div class="dashboard-content">
          <div class="welcome-section">
            <h2>Admin Dashboard</h2>
            <p>System overview and management tools.</p>
          </div>

          <div class="dashboard-grid">
            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Total Users</span>
                <div class="stat-icon primary">
                  <i class="fas fa-users"></i>
                </div>
              </div>
              <div class="stat-value">${stats.totalUsers}</div>
              <div class="stat-change">
                <span>Registered</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Students</span>
                <div class="stat-icon success">
                  <i class="fas fa-user-graduate"></i>
                </div>
              </div>
              <div class="stat-value">${stats.students}</div>
              <div class="stat-change">
                <span>Active students</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Job Postings</span>
                <div class="stat-icon info">
                  <i class="fas fa-briefcase"></i>
                </div>
              </div>
              <div class="stat-value">${stats.jobs}</div>
              <div class="stat-change">
                <span>Available</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-title">Trainings</span>
                <div class="stat-icon warning">
                  <i class="fas fa-chalkboard-teacher"></i>
                </div>
              </div>
              <div class="stat-value">${stats.trainings}</div>
              <div class="stat-change">
                <span>Available</span>
              </div>
            </div>
          </div>

          <div class="dashboard-sections">
            <div class="section">
              <div class="section-header">
                <h3>User Distribution</h3>
              </div>
              <div class="section-content">
                <div class="user-distribution">
                  <div class="distribution-item">
                    <span class="label">Students</span>
                    <span class="value">${stats.students}</span>
                    <div class="bar">
                      <div class="fill" style="width: ${(stats.students / stats.totalUsers) * 100}%"></div>
                    </div>
                  </div>
                  <div class="distribution-item">
                    <span class="label">Trainers</span>
                    <span class="value">${stats.trainers}</span>
                    <div class="bar">
                      <div class="fill" style="width: ${(stats.trainers / stats.totalUsers) * 100}%"></div>
                    </div>
                  </div>
                  <div class="distribution-item">
                    <span class="label">Recruiters</span>
                    <span class="value">${stats.recruiters}</span>
                    <div class="bar">
                      <div class="fill" style="width: ${(stats.recruiters / stats.totalUsers) * 100}%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-header">
                <h3>Quick Actions</h3>
              </div>
              <div class="section-content">
                <div class="quick-actions">
                  <button class="action-btn" onclick="window.location.href='/admin.html'">
                    <i class="fas fa-cogs"></i>
                    <span>Admin Panel</span>
                  </button>
                  <button class="action-btn" onclick="navigation.navigateTo('users')">
                    <i class="fas fa-users"></i>
                    <span>Manage Users</span>
                  </button>
                  <button class="action-btn" onclick="navigation.navigateTo('reports')">
                    <i class="fas fa-chart-bar"></i>
                    <span>View Reports</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    } catch (error) {
      console.error("Error generating admin dashboard:", error)
      return this.generateErrorDashboard()
    }
  }

  generateDefaultDashboard() {
    return `
      <div class="dashboard-content">
        <div class="welcome-section">
          <h2>Welcome to TPMS</h2>
          <p>Training and Placement Management System</p>
        </div>
        <div class="default-dashboard">
          <p>Please contact your administrator to set up your account properly.</p>
        </div>
      </div>
    `
  }

  generateErrorDashboard() {
    return `
      <div class="dashboard-content">
        <div class="error-dashboard">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Dashboard</h3>
          <p>Unable to load dashboard data. Please try refreshing the page.</p>
          <button class="btn btn-primary" onclick="window.location.reload()">
            <i class="fas fa-refresh"></i> Refresh Page
          </button>
        </div>
      </div>
    `
  }

  // Render helper methods
  renderRecentApplications(applications) {
    if (!applications || applications.length === 0) {
      return '<p class="empty-message">No recent applications</p>'
    }

    return applications
      .map(
        (app) => `
      <div class="dashboard-item">
        <div class="item-header">
          <h4>${app.jobTitle || "Job Application"}</h4>
          <span class="status-badge ${app.status?.toLowerCase()}">${app.status}</span>
        </div>
        <p class="item-meta">Applied on ${new Date(app.applicationDate).toLocaleDateString()}</p>
      </div>
    `,
      )
      .join("")
  }

  renderUpcomingInterviews(interviews) {
    if (!interviews || interviews.length === 0) {
      return '<p class="empty-message">No upcoming interviews</p>'
    }

    return interviews
      .map(
        (interview) => `
      <div class="dashboard-item">
        <div class="item-header">
          <h4>${interview.jobTitle || "Interview"}</h4>
          <span class="status-badge ${interview.status?.toLowerCase()}">${interview.status}</span>
        </div>
        <p class="item-meta">Scheduled for ${new Date(interview.interviewDate).toLocaleDateString()}</p>
      </div>
    `,
      )
      .join("")
  }

  renderLatestJobs(jobs) {
    if (!jobs || jobs.length === 0) {
      return '<p class="empty-message">No job opportunities available</p>'
    }

    return jobs
      .map(
        (job) => `
      <div class="dashboard-item">
        <div class="item-header">
          <h4>${job.title}</h4>
          <span class="company">${job.companyName || "Company"}</span>
        </div>
        <p class="item-meta">${job.location || "Location not specified"}</p>
      </div>
    `,
      )
      .join("")
  }

  renderTrainerTrainings(trainings) {
    if (!trainings || trainings.length === 0) {
      return '<p class="empty-message">No trainings created</p>'
    }

    return trainings
      .map(
        (training) => `
      <div class="dashboard-item">
        <div class="item-header">
          <h4>${training.title}</h4>
          <span class="status-badge ${training.status?.toLowerCase()}">${training.status || "Active"}</span>
        </div>
        <p class="item-meta">Duration: ${training.duration || "Not specified"}</p>
      </div>
    `,
      )
      .join("")
  }

  renderRecruiterJobs(jobs) {
    if (!jobs || jobs.length === 0) {
      return '<p class="empty-message">No job postings</p>'
    }

    return jobs
      .map(
        (job) => `
      <div class="dashboard-item">
        <div class="item-header">
          <h4>${job.title}</h4>
          <span class="status-badge ${job.status?.toLowerCase()}">${job.status || "Active"}</span>
        </div>
        <p class="item-meta">${job.location || "Location not specified"}</p>
      </div>
    `,
      )
      .join("")
  }
}

// Create global dashboard manager instance
window.dashboardManager = new DashboardManager()

// Initialize dashboard functionality
document.addEventListener("DOMContentLoaded", () => {
  // Dashboard-specific initialization
  initializeDashboard()
})

function initializeDashboard() {
  // Check authentication
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  if (!token) {
    window.location.href = "/login.html"
    return
  }

  // Initialize sidebar toggle
  initializeSidebarToggle()

  // Initialize user menu
  initializeUserMenu()

  // Initialize notifications
  initializeNotifications()

  // Initialize search
  initializeGlobalSearch()

  // Load user info
  loadUserInfo()
}

function initializeSidebarToggle() {
  const sidebarToggle = document.getElementById("sidebarToggle")
  const mobileMenuToggle = document.getElementById("mobileMenuToggle")
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.querySelector(".main-content")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
      mainContent.classList.toggle("sidebar-collapsed")
    })
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  // Close sidebar on mobile when clicking outside
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        sidebar.classList.remove("show")
      }
    }
  })
}

function initializeUserMenu() {
  const userMenuToggle = document.getElementById("userMenuToggle")
  const userDropdown = document.getElementById("userDropdown")

  if (userMenuToggle && userDropdown) {
    userMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      userDropdown.classList.toggle("show")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      userDropdown.classList.remove("show")
    })
  }
}

function initializeNotifications() {
  const notificationBtn = document.getElementById("notificationBtn")
  const notificationPanel = document.getElementById("notificationPanel")
  const closeNotifications = document.getElementById("closeNotifications")

  if (notificationBtn && notificationPanel) {
    notificationBtn.addEventListener("click", () => {
      notificationPanel.classList.toggle("show")
      loadNotifications()
    })
  }

  if (closeNotifications) {
    closeNotifications.addEventListener("click", () => {
      notificationPanel.classList.remove("show")
    })
  }
}

function initializeGlobalSearch() {
  const searchInput = document.getElementById("globalSearch")

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce((e) => {
        const query = e.target.value.trim()
        if (query.length > 2) {
          performGlobalSearch(query)
        }
      }, 300),
    )
  }
}

async function performGlobalSearch(query) {
  // Implement global search functionality
  console.log("Searching for:", query)
}

async function loadNotifications() {
  const notificationList = document.getElementById("notificationList")
  if (!notificationList) return

  try {
    // Mock notifications for now
    const notifications = [
      {
        id: 1,
        type: "info",
        title: "New Job Posted",
        message: "A new job opportunity has been posted",
        time: new Date(),
        unread: true,
      },
      {
        id: 2,
        type: "success",
        title: "Application Submitted",
        message: "Your application has been successfully submitted",
        time: new Date(Date.now() - 3600000),
        unread: false,
      },
    ]

    const html = notifications
      .map(
        (notification) => `
      <div class="notification-item ${notification.unread ? "unread" : ""}">
        <div class="notification-content">
          <div class="notification-icon ${notification.type}">
            <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
          </div>
          <div class="notification-text">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">${formatTimeAgo(notification.time)}</div>
          </div>
        </div>
      </div>
    `,
      )
      .join("")

    notificationList.innerHTML = html
  } catch (error) {
    console.error("Error loading notifications:", error)
    notificationList.innerHTML = '<div class="error-message">Error loading notifications</div>'
  }
}

function getNotificationIcon(type) {
  const icons = {
    info: "info-circle",
    success: "check-circle",
    warning: "exclamation-triangle",
    error: "exclamation-circle",
  }
  return icons[type] || "info-circle"
}

function formatTimeAgo(date) {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

async function loadUserInfo() {
  const userName = document.getElementById("userName")
  const userRole = document.getElementById("userRole")

  if (userName && userRole) {
    const currentUser = window.dashboardManager.currentUser
    if (currentUser) {
      userName.textContent = currentUser.username || "User"
      userRole.textContent = window.dashboardManager.userRole || "user"
    }
  }
}

function logout() {
  // Clear authentication data
  localStorage.removeItem("authToken")
  sessionStorage.removeItem("authToken")
  localStorage.removeItem("currentUser")
  sessionStorage.removeItem("currentUser")

  // Redirect to login page
  window.location.href = "/login.html"
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
