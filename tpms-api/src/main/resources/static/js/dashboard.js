// API Configuration
const API_BASE_URL = "http://localhost:8080"

// DOM Elements
const userAvatar = document.getElementById("userAvatar")
const userName = document.getElementById("userName")
const userRole = document.getElementById("userRole")
const welcomeName = document.getElementById("welcomeName")
const logoutBtn = document.getElementById("logoutBtn")
const totalCourses = document.getElementById("totalCourses")
const completedTasks = document.getElementById("completedTasks")
const activeProjects = document.getElementById("activeProjects")

// Authentication check
function checkAuth() {
  const token = localStorage.getItem("authToken")
  const username = localStorage.getItem("username")

  if (!token || !username) {
    window.location.href = "/login.html"
    return false
  }

  return { token, username }
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
      // Token is invalid
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

// Update UI with user data
function updateUserInterface(userData) {
  // Update user info
  const fullName = userData.fullName || userData.username || "User"
  const role = userData.role || localStorage.getItem("userRole") || "student"

  userName.textContent = fullName
  userRole.textContent = role
  welcomeName.textContent = fullName.split(" ")[0] // First name only

  // Update avatar with first letter of name
  userAvatar.textContent = fullName.charAt(0).toUpperCase()

  // Update stats based on role
  updateStatsBasedOnRole(role, userData)
}

// Update stats based on user role
function updateStatsBasedOnRole(role, userData) {
  switch (role.toLowerCase()) {
    case "student":
      totalCourses.textContent = userData.enrolledCourses || "5"
      completedTasks.textContent = userData.completedAssignments || "12"
      activeProjects.textContent = userData.activeProjects || "3"
      break
    case "trainer":
      totalCourses.textContent = userData.coursesCreated || "8"
      completedTasks.textContent = userData.studentsGraded || "45"
      activeProjects.textContent = userData.activeCourses || "6"
      break
    case "recruiter":
      totalCourses.textContent = userData.jobPostings || "15"
      completedTasks.textContent = userData.candidatesInterviewed || "28"
      activeProjects.textContent = userData.openPositions || "7"
      break
    default:
      // Default values
      totalCourses.textContent = "0"
      completedTasks.textContent = "0"
      activeProjects.textContent = "0"
  }
}

// Animate numbers
function animateNumber(element, targetNumber, duration = 1000) {
  const startNumber = 0
  const increment = targetNumber / (duration / 16) // 60fps
  let currentNumber = startNumber

  const timer = setInterval(() => {
    currentNumber += increment
    if (currentNumber >= targetNumber) {
      currentNumber = targetNumber
      clearInterval(timer)
    }
    element.textContent = Math.floor(currentNumber)
  }, 16)
}

// Logout functionality
function logout() {
  // Clear local storage
  localStorage.removeItem("authToken")
  localStorage.removeItem("username")
  localStorage.removeItem("userRole")

  // Show logout message (optional)
  const logoutMessage = document.createElement("div")
  logoutMessage.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #34a853;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-weight: 500;
  `
  logoutMessage.textContent = "Logged out successfully!"
  document.body.appendChild(logoutMessage)

  // Redirect to login page
  setTimeout(() => {
    window.location.href = "login.html"
  }, 1000)
}

// Add fade-in animation to cards
function addFadeInAnimation() {
  const cards = document.querySelectorAll(".fade-in")
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    }, index * 100)
  })
}

// Update activity feed (mock data for now)
function updateActivityFeed(role) {
  const activities = {
    student: [
      { icon: "fas fa-check", title: "Completed JavaScript Basics", time: "2 hours ago" },
      { icon: "fas fa-star", title: "Earned React Certificate", time: "1 day ago" },
      { icon: "fas fa-users", title: "Joined Study Group", time: "3 days ago" },
    ],
    trainer: [
      { icon: "fas fa-chalkboard-teacher", title: "Created New Course", time: "1 hour ago" },
      { icon: "fas fa-check-circle", title: "Graded 15 Assignments", time: "4 hours ago" },
      { icon: "fas fa-video", title: "Hosted Live Session", time: "2 days ago" },
    ],
    recruiter: [
      { icon: "fas fa-briefcase", title: "Posted New Job Opening", time: "30 minutes ago" },
      { icon: "fas fa-user-check", title: "Interviewed 3 Candidates", time: "6 hours ago" },
      { icon: "fas fa-handshake", title: "Made Job Offer", time: "1 day ago" },
    ],
  }

  const activityList = document.querySelector(".activity-list")
  const roleActivities = activities[role.toLowerCase()] || activities.student

  activityList.innerHTML = roleActivities
    .map(
      (activity) => `
    <li class="activity-item">
      <div class="activity-icon">
        <i class="${activity.icon}"></i>
      </div>
      <div class="activity-content">
        <div class="activity-title">${activity.title}</div>
        <div class="activity-time">${activity.time}</div>
      </div>
    </li>
  `,
    )
    .join("")
}

// Update upcoming events based on role
function updateUpcomingEvents(role) {
  const events = {
    student: [
      { label: "Next Class", value: "Tomorrow 2:00 PM" },
      { label: "Assignment Due", value: "Friday 11:59 PM" },
      { label: "Career Fair", value: "Next Monday" },
    ],
    trainer: [
      { label: "Next Lecture", value: "Today 3:00 PM" },
      { label: "Grade Deadline", value: "Thursday 5:00 PM" },
      { label: "Faculty Meeting", value: "Next Tuesday" },
    ],
    recruiter: [
      { label: "Interview Session", value: "Tomorrow 10:00 AM" },
      { label: "Job Fair", value: "Friday 9:00 AM" },
      { label: "Team Meeting", value: "Next Wednesday" },
    ],
  }

  const eventsContainer = document.querySelector(".card:nth-child(3) .card-content")
  const roleEvents = events[role.toLowerCase()] || events.student

  eventsContainer.innerHTML = roleEvents
    .map(
      (event) => `
    <div class="metric">
      <span class="metric-label">${event.label}</span>
      <span class="metric-value">${event.value}</span>
    </div>
  `,
    )
    .join("")
}

// Initialize dashboard
async function initializeDashboard() {
  // Check authentication
  const auth = checkAuth()
  if (!auth) return

  const { token, username } = auth

  try {
    // Fetch user profile
    const profileResult = await fetchUserProfile(username, token)

    if (profileResult.success) {
      updateUserInterface(profileResult.data)
      updateActivityFeed(profileResult.data.role || "student")
      updateUpcomingEvents(profileResult.data.role || "student")
    } else {
      // Use fallback data from localStorage
      const fallbackData = {
        fullName: username,
        username: username,
        role: localStorage.getItem("userRole") || "student",
      }
      updateUserInterface(fallbackData)
      updateActivityFeed(fallbackData.role)
      updateUpcomingEvents(fallbackData.role)
    }

    // Add animations
    addFadeInAnimation()

    // Animate stats numbers
    setTimeout(() => {
      animateNumber(totalCourses, Number.parseInt(totalCourses.textContent))
      animateNumber(completedTasks, Number.parseInt(completedTasks.textContent))
      animateNumber(activeProjects, Number.parseInt(activeProjects.textContent))
    }, 500)
  } catch (error) {
    console.error("Dashboard initialization error:", error)
    // Use fallback data
    const fallbackData = {
      fullName: username,
      username: username,
      role: localStorage.getItem("userRole") || "student",
    }
    updateUserInterface(fallbackData)
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", initializeDashboard)

logoutBtn.addEventListener("click", logout)

// Add click handlers for action buttons
document.querySelectorAll(".action-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault()
    const title = this.querySelector("h3").textContent

    // Show coming soon message for now
    const message = document.createElement("div")
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 1000;
      text-align: center;
      min-width: 300px;
    `
    message.innerHTML = `
      <h3 style="margin-bottom: 1rem; color: #4285f4;">${title}</h3>
      <p style="margin-bottom: 1.5rem; color: #5f6368;">This feature is coming soon!</p>
      <button onclick="this.parentElement.remove()" style="background: #4285f4; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">OK</button>
    `

    // Add backdrop
    const backdrop = document.createElement("div")
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 999;
    `
    backdrop.onclick = () => {
      backdrop.remove()
      message.remove()
    }

    document.body.appendChild(backdrop)
    document.body.appendChild(message)
  })
})

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + L for logout
  if ((e.ctrlKey || e.metaKey) && e.key === "l") {
    e.preventDefault()
    logout()
  }
})

// Auto-refresh data every 5 minutes
setInterval(
  () => {
    const auth = checkAuth()
    if (auth) {
      fetchUserProfile(auth.username, auth.token)
        .then((result) => {
          if (result.success) {
            updateUserInterface(result.data)
          }
        })
        .catch((error) => console.error("Auto-refresh error:", error))
    }
  },
  5 * 60 * 1000,
) // 5 minutes
