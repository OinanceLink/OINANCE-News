/* =========================
   OINANCE TECHNOLOGY
   DASHBOARD
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

  const articleImage =
    document.getElementById("articleImage");

  const imagePreview =
    document.getElementById("imagePreview");


  /* =========================
     STORAGE
  ========================== */

  const STORAGE_KEY =
    "oinanceArticles";

  let articles =
    JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    ) || [];


  /* =========================
     OPEN ARTICLE EDITOR
  ========================== */

  if (newArticleButton) {

    newArticleButton.addEventListener(
      "click",
      function () {

        articleEditor.classList.add("show");

        articleEditor.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  }


  /* =========================
     CLOSE ARTICLE EDITOR
  ========================== */

  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      function () {

        articleEditor.classList.remove(
          "show"
        );

        articleForm.reset();

        clearImagePreview();

        const author =
          document.getElementById(
            "articleAuthor"
          );

        if (author) {
          author.value =
            "OINANCE Editorial";
        }

      }
    );

  }


  /* =========================
     IMAGE PREVIEW
  ========================== */

  if (articleImage) {

    articleImage.addEventListener(
      "change",
      function () {

        const file =
          articleImage.files[0];

        clearImagePreview();


        if (!file) {
          return;
        }


        if (!file.type.startsWith("image/")) {

          showMessage(
            "Please choose an image."
          );

          articleImage.value = "";

          return;
        }


        const image =
          document.createElement("img");


        image.src =
          URL.createObjectURL(file);


        image.alt =
          "Article picture preview";


        imagePreview.appendChild(
          image
        );

      }
    );

  }


  /* =========================
     CLEAR IMAGE PREVIEW
  ========================== */

  function clearImagePreview() {

    if (imagePreview) {

      imagePreview.innerHTML = "";

    }

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


        const story =
          document
            .getElementById("articleStory")
            .value
            .trim();


        const imageFile =
          articleImage &&
          articleImage.files[0]
            ? articleImage.files[0]
            : null;


        if (!title || !story) {

          showMessage(
            "Please enter a headline and article."
          );

          return;

        }


        /*
          At this stage the image is only
          stored temporarily in the browser.
          Supabase Storage will be connected later.
        */

        const article = {

          id: Date.now(),

          title: title,

          category: category,

          author:
            author ||
            "OINANCE Editorial",

          story: story,

          hasImage:
            !!imageFile,

          date:
            new Date().toLocaleDateString()

        };


        articles.unshift(article);


        saveArticles();


        articleForm.reset();


        clearImagePreview();


        const defaultAuthor =
          document.getElementById(
            "articleAuthor"
          );

        if (defaultAuthor) {

          defaultAuthor.value =
            "OINANCE Editorial";

        }


        articleEditor.classList.remove(
          "show"
        );


        renderDashboard();


        showMessage(
          "✓ Article published successfully."
        );

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
     UPDATE STATISTICS
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

            return article.hasImage;

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
          document.createElement(
            "article"
          );


        item.className =
          "article-item";


        const info =
          document.createElement(
            "div"
          );


        info.className =
          "article-info";


        const title =
          document.createElement(
            "h3"
          );


        title.textContent =
          article.title;


        const meta =
          document.createElement(
            "p"
          );


        meta.textContent =
          article.category +
          " · " +
          article.author +
          " · " +
          article.date;


        if (article.hasImage) {

          meta.textContent +=
            " · 🖼️ Picture";

        }


        info.appendChild(title);

        info.appendChild(meta);


        const deleteButton =
          document.createElement(
            "button"
          );


        deleteButton.className =
          "delete-button";


        deleteButton.textContent =
          "DELETE";


        deleteButton.addEventListener(
          "click",
          function () {

            deleteArticle(
              article.id
            );

          }
        );


        item.appendChild(info);

        item.appendChild(
          deleteButton
        );


        articlesList.appendChild(
          item
        );

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
     RENDER DASHBOARD
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
