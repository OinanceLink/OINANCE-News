/* =========================
   OINANCE TECHNOLOGY
   MAIN WEBSITE JAVASCRIPT
========================= */


/* =========================
   SUPABASE
========================= */

const SUPABASE_URL =
  "https://ohvqwdtvtcqchuwethuw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_PRGk5RJCVmUB--1ovLeC0g_qo25F6L3";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =========================
   PAGE START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    setupMobileMenu();

    updateYear();

    loadNews();

  }
);


/* =========================
   MOBILE MENU
========================= */

function setupMobileMenu() {

  const menuButton =
    document.getElementById("menuButton");

  const mobileMenu =
    document.getElementById("mobileMenu");


  if (!menuButton || !mobileMenu) {
    return;
  }


  menuButton.addEventListener(
    "click",
    function () {

      mobileMenu.classList.toggle("open");

      if (
        mobileMenu.classList.contains("open")
      ) {

        menuButton.textContent = "✕";

      } else {

        menuButton.textContent = "☰";

      }

    }
  );


  const mobileLinks =
    mobileMenu.querySelectorAll("a");


  mobileLinks.forEach(
    function (link) {

      link.addEventListener(
        "click",
        function () {

          mobileMenu.classList.remove(
            "open"
          );

          menuButton.textContent = "☰";

        }
      );

    }
  );

}


/* =========================
   CURRENT YEAR
========================= */

function updateYear() {

  const year =
    document.querySelector(
      ".site-footer p"
    );


  if (year) {

    year.textContent =
      "© " +
      new Date().getFullYear() +
      " OINANCE. All rights reserved.";

  }

}


/* =========================
   LOAD OINANCE NEWS
========================= */

async function loadNews() {

  const newsGrid =
    document.getElementById(
      "newsGrid"
    );


  if (!newsGrid) {
    return;
  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("news")
        .select(
          "id, title, category, author, story, image_url, created_at"
        )
        .eq(
          "published",
          true
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (error) {

      console.error(
        "OINANCE News error:",
        error
      );

      return;

    }


    /* =========================
       NO ARTICLES
    ========================= */

    if (
      !data ||
      data.length === 0
    ) {

      newsGrid.innerHTML = `

        <article class="news-placeholder">

          <div class="placeholder-image"></div>

          <div class="placeholder-content">

            <span>
              OINANCE NEWS
            </span>

            <h3>
              OINANCE News is coming soon.
            </h3>

            <p>
              Articles published through the
              OINANCE Dashboard will appear here.
            </p>

          </div>

        </article>

      `;

      return;

    }


    /* =========================
       DISPLAY ARTICLES
    ========================= */

    newsGrid.innerHTML = "";


    data.forEach(
      function (article) {

        const card =
          document.createElement(
            "article"
          );


        card.className =
          "news-card";


        card.style.cursor =
          "pointer";


        /* =========================
           OPEN FULL ARTICLE
        ========================= */

        card.addEventListener(
          "click",
          function () {

            window.location.href =
              "article.html?id=" +
              encodeURIComponent(
                article.id
              );

          }
        );


        /* =========================
           IMAGE
        ========================= */

        const image =
          article.image_url

            ? `
              <img
                src="${escapeHTML(
                  article.image_url
                )}"
                alt="${escapeHTML(
                  article.title
                )}"
                class="news-image"
              >
            `

            : `
              <div
                class="placeholder-image"
              ></div>
            `;


        /* =========================
           DATE
        ========================= */

        const date =
          new Date(
            article.created_at
          ).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric"
            }
          );


        /* =========================
           ARTICLE CARD
        ========================= */

        card.innerHTML = `

          ${image}

          <div class="news-content">

            <span class="news-category">

              ${escapeHTML(
                article.category ||
                "OINANCE NEWS"
              )}

            </span>


            <h3>

              ${escapeHTML(
                article.title
              )}

            </h3>


            <p>

              ${escapeHTML(
                article.story
              )}

            </p>


            <div class="news-meta">

              <span>

                ${escapeHTML(
                  article.author ||
                  "OINANCE Editorial"
                )}

              </span>


              <span>

                ${date}

              </span>

            </div>


            <div class="news-read-more">

              Read Full Article →

            </div>

          </div>

        `;


        newsGrid.appendChild(
          card
        );

      }
    );


  } catch (error) {

    console.error(
      "Unexpected OINANCE News error:",
      error
    );

  }

}


/* =========================
   SECURITY
========================= */

function escapeHTML(value) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    value ?? "";


  return div.innerHTML;

}
