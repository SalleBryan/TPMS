const studentId = 1; // Replace with dynamic ID if needed
const container = document.getElementById("training-list");

fetch("http://localhost:8080/api/trainings")
  .then(res => res.json())
  .then(trainings => {
    trainings.forEach(training => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${training.title}</h2>
        <p>by ${training.trainer}</p>
        <p>${training.description}</p>
        <button onclick="enroll(${training.id})">Enroll</button>
      `;
      container.appendChild(card);
    });
  });

function enroll(trainingId) {
  fetch("http://localhost:8080/api/enrollments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, trainingId })
  })
  .then(() => alert("Enrolled successfully!"))
  .catch(err => console.error("Enrollment failed:", err));
}
