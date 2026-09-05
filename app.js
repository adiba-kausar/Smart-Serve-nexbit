/* =========================================
   SMARTSERVE AI - app.js
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* -----------------------------------------
     SET CURRENT DATE
  ----------------------------------------- */

  const dateElements = document.querySelectorAll(
    "#currentDate, .current-date, [data-current-date]"
  );

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  dateElements.forEach(function (element) {
    element.textContent = formattedDate;
  });


  /* -----------------------------------------
     ACTIVE NAVIGATION LINK
  ----------------------------------------- */

  const currentPage = window.location.pathname
    .split("/")
    .pop() || "index.html";

  const navLinks = document.querySelectorAll(
    ".nav-links a, .sidebar-menu a"
  );

  navLinks.forEach(function (link) {
    const linkPage = link.getAttribute("href");

    if (
      linkPage &&
      linkPage !== "#" &&
      linkPage.split("/").pop() === currentPage
    ) {
      link.classList.add("active");
    }
  });


  /* -----------------------------------------
     MOBILE MENU
  ----------------------------------------- */

  const navbar = document.querySelector(".navbar");
  const navLinksContainer = document.querySelector(".nav-links");

  if (navbar && navLinksContainer) {
    const menuButton = document.createElement("button");

    menuButton.innerHTML = "☰";
    menuButton.className = "mobile-menu-button";

    menuButton.style.display = "none";
    menuButton.style.background = "none";
    menuButton.style.border = "none";
    menuButton.style.fontSize = "25px";
    menuButton.style.color = "#16a34a";

    navbar.appendChild(menuButton);

    menuButton.addEventListener("click", function () {
      navLinksContainer.classList.toggle("show-mobile-menu");
    });

    function updateMobileMenu() {
      if (window.innerWidth <= 700) {
        menuButton.style.display = "block";
      } else {
        menuButton.style.display = "none";
        navLinksContainer.classList.remove("show-mobile-menu");
      }
    }

    updateMobileMenu();
    window.addEventListener("resize", updateMobileMenu);
  }


  /* -----------------------------------------
     SMOOTH SCROLLING
  ----------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      if (targetId !== "#") {
        const target = document.querySelector(targetId);

        if (target) {
          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });


  /* -----------------------------------------
     BUTTON LOADING EFFECT
  ----------------------------------------- */

  document.querySelectorAll(
    ".primary-button, .predict-button, .new-button"
  ).forEach(function (button) {

    button.addEventListener("click", function () {
      if (
        this.tagName === "BUTTON" &&
        !this.type
      ) {
        this.type = "button";
      }
    });

  });


  /* -----------------------------------------
     SAVE LAST VISITED PAGE
  ----------------------------------------- */

  localStorage.setItem("smartserveLastPage", currentPage);


  /* -----------------------------------------
     SHOW SAVED USER NAME
  ----------------------------------------- */

  const savedName = localStorage.getItem("smartserveUserName");

  const userNameElements = document.querySelectorAll(
    "#userName, .user-name, [data-user-name]"
  );

  if (savedName) {
    userNameElements.forEach(function (element) {
      element.textContent = savedName;
    });
  }


  /* -----------------------------------------
     PREVENT EMPTY FORM SUBMISSION
  ----------------------------------------- */

  document.querySelectorAll("form").forEach(function (form) {

    form.addEventListener("submit", function (event) {
      const requiredInputs = form.querySelectorAll(
        "input[required], select[required], textarea[required]"
      );

      let isValid = true;

      requiredInputs.forEach(function (input) {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = "#ef4444";
        } else {
          input.style.borderColor = "#dbe3ea";
        }
      });

      if (!isValid) {
        event.preventDefault();
        alert("Please fill in all required fields.");
      }
    });

  });

});


/* =========================================
   GLOBAL FUNCTIONS
========================================= */


/* SAVE USER NAME */

function saveUserName(name) {
  if (name && name.trim() !== "") {
    localStorage.setItem(
      "smartserveUserName",
      name.trim()
    );
  }
}


/* CLEAR SAVED DATA */

function clearSmartServeData() {
  localStorage.removeItem("smartserveUserName");
  localStorage.removeItem("smartserveLastPage");
}


/* SHOW MESSAGE */

function showMessage(message) {
  alert(message);
}


/* GO TO PAGE */

function goToPage(page) {
  window.location.href = page;
}