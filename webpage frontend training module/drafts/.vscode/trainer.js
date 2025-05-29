document.getElementById("trainingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const trainer = document.getElementById("trainer").value;
  const description = document.getElementById("description").value;

  fetch("http://localhost:8080/api/trainings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, trainer, description })
  })
    .then(() => alert("Training created!"))
    .catch(err => alert("Failed to save training"));
});
