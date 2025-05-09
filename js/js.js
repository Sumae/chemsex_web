document.getElementById("toggleText").addEventListener("click", function(e) {
    e.preventDefault();
    const content = document.querySelector(".about-content");
    content.classList.toggle("active");
    this.textContent = content.classList.contains("active") ? "Mostrar menos" : "Mostrar mais";
  });