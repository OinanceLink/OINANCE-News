/* =========================
   OINANCE NEWS
   MAIN WEBSITE JAVASCRIPT
========================= */

document.addEventListener("DOMContentLoaded", function () {

  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");


  /* =========================
     MOBILE MENU
  ========================= */

  if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", function () {

      mobileMenu.classList.toggle("open");

      if (mobileMenu.classList.contains("open")) {
        menuButton.textContent = "✕";
      } else {
        menuButton.textContent = "☰";
      }

    });


    /* Close menu after clicking a link */

    const mobileLinks =
      mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(function (link) {

      link.addEventListener("click", function () {

        mobileMenu.classList.remove("open");

        menuButton.textContent = "☰";

      });

    });

  }


  /* =========================
     CURRENT YEAR
  ========================= */

  const year =
    document.querySelector(".site-footer p");

  if (year) {

    year.textContent =
      "© " +
      new Date().getFullYear() +
      " OINANCE. All rights reserved.";

  }

});
