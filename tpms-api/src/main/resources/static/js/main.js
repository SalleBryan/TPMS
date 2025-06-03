class LandingPage {
  constructor() {
    this.navbar = document.getElementById("navbar")
    this.mobileMenuBtn = document.getElementById("mobileMenuBtn")
    this.navLinks = document.getElementById("navLinks")
    this.loading = document.getElementById("loading")

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupAnimations()
    this.hideLoading()
  }

  setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener("scroll", this.handleScroll.bind(this))

    // Mobile menu toggle
    this.mobileMenuBtn.addEventListener("click", this.toggleMobileMenu.bind(this))

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", this.handleSmoothScroll.bind(this))
    })

    // Close mobile menu when clicking on links
    this.navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        this.navLinks.classList.remove("active")
        this.mobileMenuBtn.classList.remove("active")
      })
    })

    // Handle roles-specific signup links
    document.querySelectorAll('a[href*="signup.html"]').forEach((link) => {
      link.addEventListener("click", this.handleSignupLink.bind(this))
    })
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add("scrolled")
    } else {
      this.navbar.classList.remove("scrolled")
    }
  }

  toggleMobileMenu() {
    this.navLinks.classList.toggle("active")
    this.mobileMenuBtn.classList.toggle("active")
  }

  handleSmoothScroll(e) {
    e.preventDefault()
    const target = document.querySelector(e.currentTarget.getAttribute("href"))
    if (target) {
      const offsetTop = target.offsetTop - 80 // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  handleSignupLink(e) {
    const href = e.currentTarget.getAttribute("href")
    const url = new URL(href, window.location.origin)

    // If there's a roles parameter in the URL, store it for the signup page
    const roles = url.searchParams.get("roles")
    if (roles) {
      sessionStorage.setItem("selectedRole", roles)
    }
  }

  setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    }, observerOptions)

    // Observe all fade-in elements
    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el)
    })

    // Stagger animation for cards
    this.addStaggerAnimation(".hero-card", 200)
    this.addStaggerAnimation(".step-item", 300)
    this.addStaggerAnimation(".roles-card", 200)
    this.addStaggerAnimation(".feature-item", 150)
  }

  addStaggerAnimation(selector, delay = 200) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element, index) => {
      element.style.animationDelay = `${index * delay}ms`
      element.classList.add("fade-in")
    })
  }

  hideLoading() {
    setTimeout(() => {
      this.loading.classList.add("hidden")
    }, 1000)
  }

  // API Methods for future use
  async checkServerStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/`)
      return response.ok
    } catch (error) {
      console.error("Server connection failed:", error)
      return false
    }
  }

  // Utility method to show notifications
  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    // Add styles
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 1.5rem",
      borderRadius: "0.5rem",
      color: "white",
      fontWeight: "600",
      zIndex: "10000",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease-in-out",
    })

    // Set background color based on type
    const colors = {
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    }
    notification.style.backgroundColor = colors[type] || colors.info

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 5000)
  }
}

// Initialize the landing page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new LandingPage()
})

// Add some interactive effects
document.addEventListener("DOMContentLoaded", () => {
  // Parallax effect for hero shapes
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const shapes = document.querySelectorAll(".hero-shape")

    shapes.forEach((shape, index) => {
      const speed = 0.5 + index * 0.1
      shape.style.transform = `translateY(${scrolled * speed}px)`
    })
  })

  // Add hover effects to cards
  document.querySelectorAll(".hero-card, .step-item, .roles-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })

  // Add click ripple effect to buttons
  document.querySelectorAll(".btn-primary, .btn-secondary, .roles-cta").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `

      this.style.position = "relative"
      this.style.overflow = "hidden"
      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  // Add CSS for ripple animation
  const style = document.createElement("style")
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
})
