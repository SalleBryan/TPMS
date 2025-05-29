// Mock token for authentication (replace with actual JWT from login)
const mockToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// API base URL (replace with actual Java backend URL)
const API_BASE_URL = "http://localhost:8080/api";

// State
let currentView = "list";
let trainings = [];
let enrolledTrainings = [];
let selectedTraining = null;
let searchQuery = "";
let filterTheme = "";

// Render view
function showView(view) {
  currentView = view;
  document.getElementById("content").innerHTML = "";
  if (view === "list") {
    fetchTrainings();
  } else if (view === "enrolled") {
    fetchEnrolledTrainings();
  } else if (view === "create") {
    renderCreateTrainingForm();
  }
}

// Fetch available trainings
async function fetchTrainings() {
  document.getElementById("content").innerHTML = "<div class='loading'>Loading...</div>";
  try {
    const response = await fetch(`${API_BASE_URL}/trainings`, {
      headers: { Authorization: mockToken },
    });
    if (!response.ok) throw new Error("Failed to fetch trainings");
    trainings = await response.json();
    renderTrainingList();
  } catch (err) {
    document.getElementById("content").innerHTML = `<div class="error">${err.message}</div>`;
  }
}

// Fetch enrolled trainings
async function fetchEnrolledTrainings() {
  document.getElementById("content").innerHTML = "<div class='loading'>Loading...</div>";
  try {
    const response = await fetch(`${API_BASE_URL}/enrolled-trainings`, {
      headers: { Authorization: mockToken },
    });
    if (!response.ok) throw new Error("Failed to fetch enrolled trainings");
    enrolledTrainings = await response.json();
    renderEnrolledTrainings();
  } catch (err) {
    document.getElementById("content").innerHTML = `<div class="error">${err.message}</div>`;
  }
}

// Render training list
function renderTrainingList() {
  const filteredTrainings = trainings.filter(training =>
    training.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterTheme ? training.theme === filterTheme : true)
  );
  let html = `
    <div class="search-filter">
      <input type="text" id="search" placeholder="Search trainings..." value="${searchQuery}" oninput="handleSearch(this.value)">
      <select id="filter-theme" onchange="handleFilter(this.value)">
        <option value="">All Themes</option>
        <option value="AI">AI</option>
        <option value="Cloud">Cloud Computing</option>
      </select>
    </div>
  `;
  if (filteredTrainings.length === 0) {
    html += `<div class="empty">No trainings available</div>`;
  } else {
    html += `<div class="training-grid">`;
    filteredTrainings.forEach(training => {
      html += `
        <div class="training-card">
          <h2>${training.title}</h2>
          <p>${training.description}</p>
          <p><strong>Trainer:</strong> ${training.trainer}</p>
          <p><strong>Theme:</strong> ${training.theme}</p>
          <p><strong>Dates:</strong> ${training.startDate} to ${training.endDate}</p>
          <p><strong>Status:</strong> ${training.status}</p>
          <button class="btn ${training.status === 'Open' ? 'btn-green' : 'btn-gray'}" 
                  ${training.status !== 'Open' ? 'disabled' : ''} 
                  onclick="openEnrollModal(${training.id})">Enrol</button>
        </div>
      `;
    });
    html += `</div>`;
  }
  document.getElementById("content").innerHTML = html;
  document.getElementById("filter-theme").value = filterTheme;
}

// Handle search
function handleSearch(query) {
  searchQuery = query;
  renderTrainingList();
}

// Handle filter
function handleFilter(theme) {
  filterTheme = theme;
  renderTrainingList();
}

// Open enroll modal
function openEnrollModal(trainingId) {
  selectedTraining = trainings.find(t => t.id === trainingId);
  document.getElementById("content").innerHTML = `
    <div class="modal" id="enroll-modal">
      <div class="modal-content">
        <h2>Enrol in ${selectedTraining.title}</h2>
        <p><strong>Description:</strong> ${selectedTraining.description}</p>
        <p><strong>Trainer:</strong> ${selectedTraining.trainer}</p>
        <p><strong>Dates:</strong> ${selectedTraining.startDate} to ${selectedTraining.endDate}</p>
        <p><strong>Eligibility:</strong> Basic skills in ${selectedTraining.theme}</p>
        <input type="text" id="payment-info" placeholder="Payment Info (e.g., Card Number)">
        <div id="enroll-error" class="error"></div>
        <div id="enroll-loading" class="loading" style="display: none;">Processing...</div>
        <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
          <button class="btn btn-green" onclick="handleEnroll()">Confirm Enrollment</button>
          <button class="btn btn-red" onclick="showView('list')" style="margin-left: 8px;">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

// Handle enrollment
async function handleEnroll() {
  const payment = document.getElementById("payment-info").value;
  const errorDiv = document.getElementById("enroll-error");
  const loadingDiv = document.getElementById("enroll-loading");
  errorDiv.textContent = "";
  loadingDiv.style.display = "block";
  try {
    const response = await fetch(`${API_BASE_URL}/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: mockToken,
      },
      body: JSON.stringify({
        trainingId: selectedTraining.id,
        paymentInfo: payment,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Enrollment failed");
    }
    document.getElementById("enroll-modal").innerHTML = `
      <div class="modal-content">
        <h2>Enrollment Successful</h2>
        <p>You are enrolled in ${selectedTraining.title}!</p>
        <button class="btn btn-blue" onclick="showView('enrolled')">View Enrolled Trainings</button>
      </div>
    `;
  } catch (err) {
    errorDiv.textContent = err.message;
  } finally {
    loadingDiv.style.display = "none";
  }
}

// Render enrolled trainings
function renderEnrolledTrainings() {
  let html = `<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">My Enrolled Trainings</h2>`;
  if (enrolledTrainings.length === 0) {
    html += `<div class="empty">You are not enrolled in any trainings.</div>`;
  } else {
    html += `
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Trainer</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;
    enrolledTrainings.forEach(training => {
      html += `
        <tr>
          <td>${training.title}</td>
          <td>${training.trainer}</td>
          <td>${training.startDate} to ${training.endDate}</td>
          <td><span class="status-badge ${training.status === 'Ongoing' ? 'status-ongoing' : 'status-completed'}">${training.status}</span></td>
          <td>
            <button class="btn btn-blue" onclick="viewMaterials(${training.id})">View Materials</button>
            ${training.status === 'Completed' ? `<button class="btn btn-purple" style="margin-left: 8px;" onclick="submitFeedback(${training.id})">Give Feedback</button>` : ''}
          </td>
        </tr>
      `;
    });
    html += `</tbody></table></div>`;
  }
  document.getElementById("content").innerHTML = html;
}

// View training materials
async function viewMaterials(trainingId) {
  try {
    const response = await fetch(`${API_BASE_URL}/trainings/${trainingId}/materials`, {
      headers: { Authorization: mockToken },
    });
    if (!response.ok) throw new Error("Failed to fetch materials");
    const materials = await response.json();
    alert("Materials fetched: " + JSON.stringify(materials));
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Submit feedback
async function submitFeedback(trainingId) {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: mockToken,
      },
      body: JSON.stringify({ trainingId, rating: 5, comment: "Great training!" }),
    });
    if (!response.ok) throw new Error("Failed to submit feedback");
    alert("Feedback submitted successfully!");
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Render create training form
function renderCreateTrainingForm() {
  document.getElementById("content").innerHTML = `
    <div class="form-grid">
      <h2 style="font-size: 24px; font-weight: bold;">Create Training</h2>
      <input type="text" id="title" placeholder="Training Title">
      <textarea id="description" placeholder="Description"></textarea>
      <select id="theme">
        <option value="AI">AI</option>
        <option value="Cloud">Cloud Computing</option>
      </select>
      <input type="date" id="startDate">
      <input type="date" id="endDate">
      <input type="number" id="maxSeats" placeholder="Max Seats" value="50">
      <input type="file" id="materials" accept=".pdf,.mp4">
      <div id="create-error" class="error"></div>
      <div id="create-loading" class="loading" style="display: none;">Saving...</div>
      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-green" onclick="handleCreateTraining()">Save</button>
        <button class="btn btn-red" style="margin-left: 8px;" onclick="showView('list')">Cancel</button>
      </div>
    </div>
  `;
}

// Handle create training
async function handleCreateTraining() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const theme = document.getElementById("theme").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const maxSeats = document.getElementById("maxSeats").value;
  const materials = document.getElementById("materials").files[0];
  const errorDiv = document.getElementById("create-error");
  const loadingDiv = document.getElementById("create-loading");

  if (!title || !description || !startDate || !endDate) {
    errorDiv.textContent = "All fields are required.";
    return;
  }

  loadingDiv.style.display = "block";
  errorDiv.textContent = "";
  try {
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("theme", theme);
    form.append("startDate", startDate);
    form.append("endDate", endDate);
    form.append("maxSeats", maxSeats);
    if (materials) form.append("materials", materials);

    const response = await fetch(`${API_BASE_URL}/trainings`, {
      method: "POST",
      headers: { Authorization: mockToken },
      body: form,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create training");
    }
    showView("list");
  } catch (err) {
    errorDiv.textContent = err.message;
  } finally {
    loadingDiv.style.display = "none";
  }
}

// Initialize
showView("list");