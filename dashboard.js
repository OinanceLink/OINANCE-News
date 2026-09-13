/* =========================
   OINANCE TECHNOLOGY
   DASHBOARD JAVASCRIPT
========================= */

document.addEventListener("DOMContentLoaded", function () {

  const newArticleButton =
    document.getElementById("newArticleButton");

  const cancelButton =
    document.getElementById("cancelButton");

  const articleEditor =
    document.getElementById("articleEditor");

  const articleForm =
    document.getElementById("articleForm");

  const articlesList =
    document.getElementById("articlesList");

  const articleCount =
    document.getElementById("articleCount");

  const technologyCount =
    document.getElementById("technologyCount");

  const pictureCount =
    document.getElementById("pictureCount");

  const dashboardMessage =
    document.getElementById("dashboardMessage");


  /* =========================
     STORAGE
  ========================== */

  const STORAGE_KEY = "oinanceArticles";

  let articles =
    JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    ) || [];


  /* =========================
     OPEN EDITOR
  ========================== */

  if (newArticleButton) {

    newArticleButton.addEventListener(
      "click",
      function () {

        articleEditor.classList.add("show");

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }


  /* =========================
     CLOSE EDITOR
  ========================== */

  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      function () {

        articleEditor.classList.remove("show");

        articleForm.reset();

        document.getElementById(
          "articleAuthor"
        ).value = "OINANCE Editorial";

      }
    );

  }


  /* =========================
     PUBLISH ARTICLE
  ========================== */

  if (articleForm) {

    articleForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        const title =
          document
            .getElementById("articleTitle")
            .value
            .trim();


        const category =
          document
            .getElementById("articleCategory")
            .value;


        const author =
          document
            .getElementById("articleAuthor")
            .value
            .trim();


        const image =
          document
            .getElementById("articleImage")
            .value
            .trim();


        const story =
          document
            .getElementById("articleStory")
            .value
            .trim();


        if (!title || !story) {

          showMessage(
            "Please enter a headline and article."
          );

          return;

        }


        const article = {

          id: Date.now(),

          title: title,

          category: category,

          author:
            author || "OINANCE Editorial",

          image: image,

          story: story,

          date:
            new Date().toLocaleDateString()

        };


        articles.unshift(article);


        saveArticles();


        articleForm.reset();


        document.getElementById(
          "articleAuthor"
        ).value =
          "OINANCE Editorial";


        articleEditor.classList.remove(
          "show"
        );


        showMessage(
          "✓ Article published successfully."
        );


        renderDashboard();

      }
    );

  }


  /* =========================
     SAVE ARTICLES
  ========================== */

  function saveArticles() {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(articles)
    );

  }


  /* =========================
     DASHBOARD STATISTICS
  ========================== */

  function updateStatistics() {

    if (articleCount) {

      articleCount.textContent =
        articles.length;

    }


    if (technologyCount) {

      technologyCount.textContent =
        articles.filter(
          function (article) {

            return (
              article.category ===
              "Technology"
            );

          }
        ).length;

    }


    if (pictureCount) {

      pictureCount.textContent =
        articles.filter(
          function (article) {

            return article.image;

          }
        ).length;

    }

  }


  /* =========================
     DISPLAY ARTICLES
  ========================== */

  function renderArticles() {

    if (!articlesList) {
      return;
    }


    articlesList.innerHTML = "";


    if (articles.length === 0) {

      articlesList.innerHTML = `

        <div class="empty-state">

          <strong>
            No articles yet
          </strong>

          <p>
            Your published OINANCE News
            articles will appear here.
          </p>

        </div>

      `;

      return;

    }


    articles.forEach(
      function (article) {

        const item =
          document.createElement("article");


        item.className =
          "article-item";


        const info =
          document.createElement("div");


        info.className =
          "article-info";


        const title =
          document.createElement("h3");


        title.textContent =
          article.title;


        const meta =
          document.createElement("p");


        meta.textContent =
          article.category +
          " · " +
          article.author +
          " · " +
          article.date;


        info.appendChild(title);

        info.appendChild(meta);


        const deleteButton =
          document.createElement("button");


        deleteButton.className =
          "delete-button";


        deleteButton.textContent =
          "DELETE";


        deleteButton.addEventListener(
          "click",
          function () {

            deleteArticle(article.id);

          }
        );


        item.appendChild(info);

        item.appendChild(deleteButton);


        articlesList.appendChild(item);

      }
    );

  }


  /* =========================
     DELETE ARTICLE
  ========================== */

  function deleteArticle(id) {

    const confirmed =
      confirm(
        "Delete this OINANCE article?"
      );


    if (!confirmed) {
      return;
    }


    articles =
      articles.filter(
        function (article) {

          return article.id !== id;

        }
      );


    saveArticles();

    renderDashboard();

    showMessage(
      "Article deleted."
    );

  }


  /* =========================
     MESSAGE
  ========================== */

  function showMessage(message) {

    if (!dashboardMessage) {
      return;
    }


    dashboardMessage.textContent =
      message;


    dashboardMessage.classList.add(
      "show"
    );


    setTimeout(
      function () {

        dashboardMessage.classList.remove(
          "show"
        );

      },
      3000
    );

  }


  /* =========================
     RENDER EVERYTHING
  ========================== */

  function renderDashboard() {

    updateStatistics();

    renderArticles();

  }


  /* =========================
     START
  ========================== */

  renderDashboard();

});
