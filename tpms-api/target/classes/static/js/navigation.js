// Navigation management for TPMS

// Import API module (assuming it's in api.js)
import * as api from "./api.js"

class NavigationManager {
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

    // Return the primary role (first one)
    const role = this.currentUser.roles[0]
    return role ? role.replace("ROLE_", "").toLowerCase() : null
  }

  generateNavigation() {
    const navContainer = document.getElementById("sidebarNav")
    if (!navContainer) return

    const navigationItems = this.getNavigationItems()
    navContainer.innerHTML = this.renderNavigationHTML(navigationItems)

    // Add event listeners
    this.attachNavigationListeners()
  }

  getNavigationItems() {
    const baseItems = [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: "fas fa-tachometer-alt",
        section: "main",
      },
    ]

    const roleSpecificItems = this.getRoleSpecificItems()
    const commonItems = [
      {
        id: "profile",
        title: "Profile",
        icon: "fas fa-user",
        section: "account",
      },
      {
        id: "settings",
        title: "Settings",
        icon: "fas fa-cog",
        section: "account",
      },
    ]

    return {
      main: [...baseItems, ...roleSpecificItems],
      account: commonItems,
    }
  }

  getRoleSpecificItems() {
    switch (this.userRole) {
      case "student":
        return [
          {
            id: "applications",
            title: "My Applications",
            icon: "fas fa-file-alt",
            section: "main",
          },
          {
            id: "interviews",
            title: "Interviews",
            icon: "fas fa-calendar-check",
            section: "main",
          },
          {
            id: "enrollments",
            title: "My Trainings",
            icon: "fas fa-book",
            section: "main",
          },
          {
            id: "jobs",
            title: "Job Opportunities",
            icon: "fas fa-suitcase",
            section: "main",
          },
        ]

      case "trainer":
        return [
          {
            id: "trainings",
            title: "My Trainings",
            icon: "fas fa-chalkboard-teacher",
            section: "main",
          },
          {
            id: "students",
            title: "Students",
            icon: "fas fa-user-graduate",
            section: "main",
          },
        ]

      case "recruiter":
        return [
          {
            id: "jobs",
            title: "My Jobs",
            icon: "fas fa-briefcase",
            section: "main",
          },
          {
            id: "applications",
            title: "Applications",
            icon: "fas fa-file-alt",
            section: "main",
          },
          {
            id: "interviews",
            title: "Interviews",
            icon: "fas fa-calendar-check",
            section: "main",
          },
        ]

      case "admin":
        return [
          {
            id: "admin",
            title: "Admin Panel",
            icon: "fas fa-cogs",
            section: "main",
          },
          {
            id: "users",
            title: "User Management",
            icon: "fas fa-users",
            section: "main",
          },
          {
            id: "reports",
            title: "Reports",
            icon: "fas fa-chart-bar",
            section: "main",
          },
        ]

      default:
        return []
    }
  }

  renderNavigationHTML(navigationItems) {
    let html = ""

    // Main section
    if (navigationItems.main && navigationItems.main.length > 0) {
      html += '<div class="nav-section">'
      html += '<div class="nav-section-title">Main</div>'
      navigationItems.main.forEach((item) => {
        html += this.renderNavItem(item)
      })
      html += "</div>"
    }

    // Account section
    if (navigationItems.account && navigationItems.account.length > 0) {
      html += '<div class="nav-section">'
      html += '<div class="nav-section-title">Account</div>'
      navigationItems.account.forEach((item) => {
        html += this.renderNavItem(item)
      })
      html += "</div>"
    }

    return html
  }

  renderNavItem(item) {
    const isActive = this.isActiveItem(item.id)
    const activeClass = isActive ? "active" : ""

    return `
      <a href="#" class="nav-item ${activeClass}" data-nav-id="${item.id}">
        <i class="${item.icon}"></i>
        <span>${item.title}</span>
      </a>
    `
  }

  isActiveItem(itemId) {
    const currentPage = this.getCurrentPage()
    return currentPage === itemId
  }

  getCurrentPage() {
    const hash = window.location.hash.replace("#", "")
    return hash || "dashboard"
  }

  attachNavigationListeners() {
    const navItems = document.querySelectorAll(".nav-item[data-nav-id]")

    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault()
        const navId = item.getAttribute("data-nav-id")
        this.navigateTo(navId)
      })
    })
  }

  navigateTo(pageId) {
    // Update URL hash
    window.location.hash = pageId

    // Update active nav item
    this.updateActiveNavItem(pageId)

    // Load page content
    this.loadPageContent(pageId)

    // Update page title
    this.updatePageTitle(pageId)
  }

  updateActiveNavItem(pageId) {
    // Remove active class from all nav items
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active")
    })

    // Add active class to current nav item
    const activeItem = document.querySelector(`[data-nav-id="${pageId}"]`)
    if (activeItem) {
      activeItem.classList.add("active")
    }
  }

  updatePageTitle(pageId) {
    const titleElement = document.getElementById("pageTitle")
    if (!titleElement) return

    const titles = {
      dashboard: "Dashboard",
      applications: this.userRole === "student" ? "My Applications" : "Applications",
      interviews: "Interviews",
      enrollments: "My Trainings",
      trainings: "Trainings",
      jobs: this.userRole === "student" ? "Job Opportunities" : "My Jobs",
      students: "Students",
      admin: "Admin Panel",
      users: "User Management",
      reports: "Reports",
      profile: "Profile",
      settings: "Settings",
    }

    titleElement.textContent = titles[pageId] || "Dashboard"
  }

  async loadPageContent(pageId) {
    const contentArea = document.getElementById("contentArea")
    if (!contentArea) return

    // Show loading spinner
    contentArea.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <span>Loading...</span>
      </div>
    `

    try {
      let content = ""

      switch (pageId) {
        case "dashboard":
          content = await this.loadDashboardContent()
          break
        case "applications":
          content = await this.loadApplicationsContent()
          break
        case "interviews":
          content = await this.loadInterviewsContent()
          break
        case "enrollments":
          content = await this.loadEnrollmentsContent()
          break
        case "trainings":
          content = await this.loadTrainingsContent()
          break
        case "jobs":
          content = await this.loadJobsContent()
          break
        case "students":
          content = await this.loadStudentsContent()
          break
        case "admin":
          window.location.href = "/admin.html"
          return
        case "profile":
          window.location.href = "/profile.html"
          return
        case "settings":
          content = await this.loadSettingsContent()
          break
        default:
          content = await this.loadDashboardContent()
      }

      contentArea.innerHTML = content

      // Initialize page-specific functionality
      this.initializePageFunctionality(pageId)
    } catch (error) {
      console.error("Error loading page content:", error)
      contentArea.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Content</h3>
          <p>Unable to load the requested page. Please try again.</p>
          <button class="btn btn-primary" onclick="navigation.loadPageContent('${pageId}')">
            Retry
          </button>
        </div>
      `
    }
  }

  async loadDashboardContent() {
    // This will be implemented in dashboard.js
    if (window.dashboardManager) {
      return await window.dashboardManager.generateDashboardContent()
    }

    return `
      <div class="dashboard-placeholder">
        <h2>Welcome to TPMS Dashboard</h2>
        <p>Dashboard content is loading...</p>
      </div>
    `
  }

  async loadApplicationsContent() {
    return `
      <div class="applications-content">
        <div class="content-header">
          <h2>Applications</h2>
          <div class="content-actions">
            <button class="btn btn-primary" onclick="navigation.showApplicationModal()">
              <i class="fas fa-plus"></i> New Application
            </button>
          </div>
        </div>
        <div class="applications-list" id="applicationsList">
          <div class="loading">Loading applications...</div>
        </div>
      </div>
    `
  }

  async loadInterviewsContent() {
    return `
      <div class="interviews-content">
        <div class="content-header">
          <h2>Interviews</h2>
        </div>
        <div class="interviews-list" id="interviewsList">
          <div class="loading">Loading interviews...</div>
        </div>
      </div>
    `
  }

  async loadEnrollmentsContent() {
    return `
      <div class="enrollments-content">
        <div class="content-header">
          <h2>My Trainings</h2>
          <div class="content-actions">
            <button class="btn btn-primary" onclick="navigation.showAvailableTrainings()">
              <i class="fas fa-plus"></i> Enroll in Training
            </button>
          </div>
        </div>
        <div class="enrollments-list" id="enrollmentsList">
          <div class="loading">Loading enrollments...</div>
        </div>
      </div>
    `
  }

  async loadTrainingsContent() {
    return `
      <div class="trainings-content">
        <div class="content-header">
          <h2>Trainings</h2>
          <div class="content-actions">
            ${
              this.userRole === "trainer"
                ? `
              <button class="btn btn-primary" onclick="navigation.showTrainingModal()">
                <i class="fas fa-plus"></i> Create Training
              </button>
            `
                : ""
            }
          </div>
        </div>
        <div class="trainings-list" id="trainingsList">
          <div class="loading">Loading trainings...</div>
        </div>
      </div>
    `
  }

  async loadJobsContent() {
    return `
      <div class="jobs-content">
        <div class="content-header">
          <h2>${this.userRole === "student" ? "Job Opportunities" : "My Jobs"}</h2>
          <div class="content-actions">
            ${
              this.userRole === "recruiter"
                ? `
              <button class="btn btn-primary" onclick="navigation.showJobModal()">
                <i class="fas fa-plus"></i> Post Job
              </button>
            `
                : ""
            }
          </div>
        </div>
        <div class="jobs-list" id="jobsList">
          <div class="loading">Loading jobs...</div>
        </div>
      </div>
    `
  }

  async loadStudentsContent() {
    return `
      <div class="students-content">
        <div class="content-header">
          <h2>Students</h2>
        </div>
        <div class="students-list" id="studentsList">
          <div class="loading">Loading students...</div>
        </div>
      </div>
    `
  }

  async loadSettingsContent() {
    return `
      <div class="settings-content">
        <div class="content-header">
          <h2>Settings</h2>
        </div>
        <div class="settings-form">
          <p>Settings functionality coming soon...</p>
        </div>
      </div>
    `
  }

  initializePageFunctionality(pageId) {
    // Initialize page-specific functionality
    switch (pageId) {
      case "applications":
        this.initializeApplicationsPage()
        break
      case "interviews":
        this.initializeInterviewsPage()
        break
      case "enrollments":
        this.initializeEnrollmentsPage()
        break
      case "trainings":
        this.initializeTrainingsPage()
        break
      case "jobs":
        this.initializeJobsPage()
        break
      case "students":
        this.initializeStudentsPage()
        break
    }
  }

  async initializeApplicationsPage() {
    try {
      let applications = []

      if (this.userRole === "student") {
        applications = await api.getStudentApplications()
      } else if (this.userRole === "recruiter") {
        // Get applications for recruiter's jobs
        const jobs = await api.getRecruiterJobs()
        applications = []
        for (const job of jobs) {
          const jobApplications = await api.getJobApplications(job.id)
          applications.push(...jobApplications)
        }
      }

      this.renderApplicationsList(applications)
    } catch (error) {
      console.error("Error loading applications:", error)
      document.getElementById("applicationsList").innerHTML = `
        <div class="error-message">Error loading applications</div>
      `
    }
  }

  async initializeInterviewsPage() {
    try {
      const interviews = await api.getStudentInterviews()
      this.renderInterviewsList(interviews)
    } catch (error) {
      console.error("Error loading interviews:", error)
      document.getElementById("interviewsList").innerHTML = `
        <div class="error-message">Error loading interviews</div>
      `
    }
  }

  async initializeEnrollmentsPage() {
    try {
      const enrollments = await api.getStudentEnrollments()
      this.renderEnrollmentsList(enrollments)
    } catch (error) {
      console.error("Error loading enrollments:", error)
      document.getElementById("enrollmentsList").innerHTML = `
        <div class="error-message">Error loading enrollments</div>
      `
    }
  }

  async initializeTrainingsPage() {
    try {
      let trainings = []

      if (this.userRole === "trainer") {
        trainings = await api.getTrainerTrainings()
      } else {
        trainings = await api.getAllTrainings()
      }

      this.renderTrainingsList(trainings)
    } catch (error) {
      console.error("Error loading trainings:", error)
      document.getElementById("trainingsList").innerHTML = `
        <div class="error-message">Error loading trainings</div>
      `
    }
  }

  async initializeJobsPage() {
    try {
      let jobs = []

      if (this.userRole === "recruiter") {
        jobs = await api.getRecruiterJobs()
      } else {
        jobs = await api.getAllJobs()
      }

      this.renderJobsList(jobs)
    } catch (error) {
      console.error("Error loading jobs:", error)
      document.getElementById("jobsList").innerHTML = `
        <div class="error-message">Error loading jobs</div>
      `
    }
  }

  async initializeStudentsPage() {
    try {
      const students = await api.getAllStudents()
      this.renderStudentsList(students)
    } catch (error) {
      console.error("Error loading students:", error)
      document.getElementById("studentsList").innerHTML = `
        <div class="error-message">Error loading students</div>
      `
    }
  }

  renderApplicationsList(applications) {
    const container = document.getElementById("applicationsList")
    if (!applications || applications.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-file-alt"></i>
          <h3>No Applications Found</h3>
          <p>You haven't submitted any applications yet.</p>
        </div>
      `
      return
    }

    const html = applications
      .map(
        (app) => `
      <div class="application-card">
        <div class="application-header">
          <h4>${app.jobTitle || "Job Application"}</h4>
          <span class="status-badge ${app.status?.toLowerCase()}">${app.status}</span>
        </div>
        <div class="application-details">
          <p><strong>Company:</strong> ${app.companyName || "N/A"}</p>
          <p><strong>Applied:</strong> ${new Date(app.applicationDate).toLocaleDateString()}</p>
        </div>
      </div>
    `,
      )
      .join("")

    container.innerHTML = html
  }

  renderInterviewsList(interviews) {
    const container = document.getElementById("interviewsList")
    if (!interviews || interviews.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-check"></i>
          <h3>No Interviews Scheduled</h3>
          <p>You don't have any upcoming interviews.</p>
        </div>
      `
      return
    }

    const html = interviews
      .map(
        (interview) => `
      <div class="interview-card">
        <div class="interview-header">
          <h4>${interview.jobTitle || "Interview"}</h4>
          <span class="status-badge ${interview.status?.toLowerCase()}">${interview.status}</span>
        </div>
        <div class="interview-details">
          <p><strong>Date:</strong> ${new Date(interview.interviewDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${interview.interviewTime || "TBD"}</p>
          <p><strong>Type:</strong> ${interview.interviewType || "N/A"}</p>
        </div>
      </div>
    `,
      )
      .join("")

    container.innerHTML = html
  }

  renderEnrollmentsList(enrollments) {
    const container = document.getElementById("enrollmentsList")
    if (!enrollments || enrollments.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-book"></i>
          <h3>No Training Enrollments</h3>
          <p>You're not enrolled in any trainings yet.</p>
        </div>
      `
      return
    }

    const html = enrollments
      .map(
        (enrollment) => `
      <div class="enrollment-card">
        <div class="enrollment-header">
          <h4>${enrollment.trainingTitle || "Training"}</h4>
          <button class="btn btn-danger btn-sm" onclick="navigation.dropTraining(${enrollment.id})">
            <i class="fas fa-times"></i> Drop
          </button>
        </div>
        <div class="enrollment-details">
          <p><strong>Enrolled:</strong> ${new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${enrollment.status || "Active"}</p>
        </div>
      </div>
    `,
      )
      .join("")

    container.innerHTML = html
  }

  renderTrainingsList(trainings) {
    const container = document.getElementById("trainingsList")
    if (!trainings || trainings.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-chalkboard-teacher"></i>
          <h3>No Trainings Available</h3>
          <p>There are no trainings available at the moment.</p>
        </div>
      `
      return
    }

    const html = trainings
      .map(
        (training) => `
      <div class="training-card">
        <div class="training-header">
          <h4>${training.title}</h4>
          ${
            this.userRole === "trainer"
              ? `
            <div class="training-actions">
              <button class="btn btn-secondary btn-sm" onclick="navigation.editTraining(${training.id})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger btn-sm" onclick="navigation.deleteTraining(${training.id})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `
              : ""
          }
        </div>
        <div class="training-details">
          <p>${training.description}</p>
          <p><strong>Duration:</strong> ${training.duration || "N/A"}</p>
          <p><strong>Start Date:</strong> ${training.startDate ? new Date(training.startDate).toLocaleDateString() : "TBD"}</p>
        </div>
        ${
          this.userRole === "student"
            ? `
          <div class="training-footer">
            <button class="btn btn-primary" onclick="navigation.enrollInTraining(${training.id})">
              <i class="fas fa-plus"></i> Enroll
            </button>
          </div>
        `
            : ""
        }
      </div>
    `,
      )
      .join("")

    container.innerHTML = html
  }

  renderJobsList(jobs) {
    const container = document.getElementById("jobsList")
    if (!jobs || jobs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-suitcase"></i>
          <h3>No Jobs Available</h3>
          <p>There are no job opportunities available at the moment.</p>
        </div>
      `
      return
    }

    const html = jobs
      .map(
        (job) => `
      <div class="job-card">
        <div class="job-header">
          <h4>${job.title}</h4>
          ${
            this.userRole === "recruiter"
              ? `
            <div class="job-actions">
              <button class="btn btn-secondary btn-sm" onclick="navigation.editJob(${job.id})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger btn-sm" onclick="navigation.deleteJob(${job.id})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `
              : ""
          }
        </div>
        <div class="job-details">
          <p>${job.description}</p>
          <p><strong>Company:</strong> ${job.companyName || "N/A"}</p>
          <p><strong>Location:</strong> ${job.location || "N/A"}</p>
          <p><strong>Salary:</strong> ${job.salary || "Negotiable"}</p>
        </div>
        ${
          this.userRole === "student"
            ? `
          <div class="job-footer">
            <button class="btn btn-primary" onclick="navigation.applyForJob(${job.id})">
              <i class="fas fa-paper-plane"></i> Apply
            </button>
          </div>
        `
            : ""
        }
      </div>
    `,
      )
      .join("")

    container.innerHTML = html
  }

  renderStudentsList(students) {
    const container = document.getElementById("studentsList")
    if (!students || students.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-user-graduate"></i>
          <h3>No Students Found</h3>
          <p>No students are currently enrolled.</p>
        </div>
      `
      return
    }

    const html = students
      .map(
        (student) => `
      <div class="student-card">
        <div class="student-header">
          <h4>${student.fullName || student.username}</h4>
        </div>
        <div class="student-details">
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>Department:</strong> ${student.department || "N/A"}</p>
          <p><strong>CGPA:</strong> ${student.cgpa || "N/A"}</p>
        </div>
      </div>
    `,
      )
      .join("")

    container.innerHTML = html
  }

  // Action methods
  async enrollInTraining(trainingId) {
    try {
      await api.enrollInTraining(trainingId)
      this.showNotification("Successfully enrolled in training!", "success")
      this.loadPageContent("enrollments")
    } catch (error) {
      this.showNotification("Failed to enroll in training", "error")
    }
  }

  async dropTraining(enrollmentId) {
    if (!confirm("Are you sure you want to drop this training?")) return

    try {
      await api.dropTraining(enrollmentId)
      this.showNotification("Successfully dropped training", "success")
      this.loadPageContent("enrollments")
    } catch (error) {
      this.showNotification("Failed to drop training", "error")
    }
  }

  async applyForJob(jobId) {
    try {
      await api.applyForJob(jobId)
      this.showNotification("Application submitted successfully!", "success")
      this.loadPageContent("applications")
    } catch (error) {
      this.showNotification("Failed to submit application", "error")
    }
  }

  showNotification(message, type = "info") {
    if (window.TPMS && window.TPMS.showNotification) {
      window.TPMS.showNotification(message, type)
    } else {
      alert(message)
    }
  }

  // Initialize navigation on page load
  initialize() {
    this.generateNavigation()

    // Load initial page based on hash or default to dashboard
    const initialPage = this.getCurrentPage()
    this.navigateTo(initialPage)

    // Listen for hash changes
    window.addEventListener("hashchange", () => {
      const page = this.getCurrentPage()
      this.navigateTo(page)
    })
  }
}

// Create global navigation instance
window.navigation = new NavigationManager()

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (window.navigation) {
    window.navigation.initialize()
  }
})
