const studentId = 1;
const container = document.getElementById("enrolled-List");

fetch(`http://localhost:8080/api/students/${studentId}/enrollments`)
  .then(res => res.json())
  .then(enrollments => {
    enrollments.forEach(training => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${training.title}</h2>
        <p>by ${training.trainer}</p>
        <p>${training.description}</p>
      `;
      container.appendChild(card);
    });
  });
