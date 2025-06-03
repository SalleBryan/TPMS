// Landing page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeLanding()
})

function initializeLanding() {
  // Initialize animations
  initializeAnimations()

  // Initialize scroll effects
  initializeScrollEffects()

  // Initialize counters
  initializeCounters()

  // Check for role parameter in URL
  checkRoleParameter()
}

function initializeAnimations() {
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".feature-card, .role-card, .stat")
  animateElements.forEach((el) => {
    observer.observe(el)
  })
}

function initializeScrollEffects() {
  // Navbar scroll effect
  const navbar = document.querySelector(".navbar")
  let lastScrollY = window.scrollY

  // Define throttle function
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

  window.addEventListener(
    "scroll",
    throttle(() => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 100) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }

      // Hide/show navbar on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        navbar.classList.add("hidden")
      } else {
        navbar.classList.remove("hidden")
      }

      lastScrollY = currentScrollY
    }, 100),
  )

  // Parallax effect for hero section
  const heroGraphic = document.querySelector(".hero-graphic")
  if (heroGraphic) {
    window.addEventListener(
      "scroll",
      throttle(() => {
        const scrolled = window.pageYOffset
        const rate = scrolled * -0.5
        heroGraphic.style.transform = `translateY(${rate}px)`
      }, 16),
    )
  }
}

function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number")
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target)
          counterObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

function animateCounter(element) {
  const target = Number.parseInt(element.textContent.replace(/\D/g, ""))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    const suffix = element.textContent.includes("+") ? "+" : ""
    element.textContent = Math.floor(current) + suffix
  }, 16)
}

function checkRoleParameter() {
  const urlParams = new URLSearchParams(window.location.search)
  const role = urlParams.get("role")

  if (role) {
    // Highlight the corresponding role card
    const roleCards = document.querySelectorAll(".role-card")
    roleCards.forEach((card) => {
      const cardRole = card.querySelector("h3").textContent.toLowerCase()
      if (cardRole === role) {
        card.classList.add("highlighted")
        card.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    })
  }
}

// Mobile menu functionality
function initializeMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active")
      navMenu.classList.toggle("active")
      document.body.classList.toggle("menu-open")
    })

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
        document.body.classList.remove("menu-open")
      })
    })
  }
}

// Initialize mobile menu
initializeMobileMenu()

// Smooth scroll to sections
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    const offsetTop = section.offsetTop - 70 // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

// Add click handlers for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const targetId = this.getAttribute("href").substring(1)
    scrollToSection(targetId)
  })
})

// Form submission for newsletter (if added)
function handleNewsletterSubmit(event) {
  event.preventDefault()
  const email = event.target.querySelector('input[type="email"]').value

  if (validateEmail(email)) {
    // Simulate newsletter subscription
    showNotification("Thank you for subscribing to our newsletter!", "success")
    event.target.reset()
  } else {
    showNotification("Please enter a valid email address.", "error")
  }
}

// Email validation function
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Notification function
function showNotification(message, type = "info") {
  const container = document.querySelector(".notification-container") || createNotificationContainer()
  const notification = document.createElement("div")
  notification.classList.add("notification", `notification-${type}`, "show")
  notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `
  container.appendChild(notification)

  // Close button functionality
  notification.querySelector(".notification-close").addEventListener("click", () => {
    notification.classList.remove("show")
    setTimeout(() => notification.remove(), 300)
  })

  // Auto-close after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => notification.remove(), 300)
  }, 5000)
}

// Create notification container if it doesn't exist
function createNotificationContainer() {
  const container = document.createElement("div")
  container.classList.add("notification-container")
  document.body.appendChild(container)
  return container
}

// Add CSS for animations
const style = document.createElement("style")
style.textContent = `
    .navbar.scrolled {
        background-color: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .navbar.hidden {
        transform: translateY(-100%);
    }
    
    .feature-card,
    .role-card,
    .stat {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .feature-card.animate-in,
    .role-card.animate-in,
    .stat.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .role-card.highlighted {
        border-color: var(--primary-color);
        box-shadow: 0 0 30px rgba(37, 99, 235, 0.3);
        transform: scale(1.05);
    }
    
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .notification {
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
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid var(--success-color);
    }
    
    .notification-error {
        border-left: 4px solid var(--error-color);
    }
    
    .notification-warning {
        border-left: 4px solid var(--warning-color);
    }
    
    .notification-info {
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
    
    @media (max-width: 768px) {
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .nav-menu.active {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            z-index: 1000;
        }
        
        body.menu-open {
            overflow: hidden;
        }
        
        .notification-container {
            left: 20px;
            right: 20px;
        }
        
        .notification {
            min-width: auto;
        }
    }
`
document.head.appendChild(style)
