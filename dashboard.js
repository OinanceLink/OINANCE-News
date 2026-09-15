/* =========================================
   OINANCE TECHNOLOGY
   DASHBOARD + SUPABASE
========================================= */

const SUPABASE_URL =
  "https://ohvqwdtvtcqchuwethuw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_PRGk5RJCVmUB--1ovLeC0g_qo25F6L3";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

document.addEventListener(
  "DOMContentLoaded",
  async function () {

    const loginScreen =
      document.getElementById("loginScreen");

    const dashboardApp =
      document.getElementById("dashboardApp");

    const loginForm =
      document.getElementById("loginForm");

    const loginMessage =
      document.getElementById("loginMessage");

    if (dashboardApp) {
      dashboardApp.style.display = "none";
    }

    const {
      data: { session }
    } =
      await supabaseClient.auth.getSession();

    if (session) {
      showDashboard();
    } else {
      showLogin();
    }

    if (loginForm) {

      loginForm.addEventListener(
        "submit",
        async function (event) {

          event.preventDefault();

          const email =
            document
              .getElementById("loginEmail")
              .value
              .trim();

          const password =
            document
              .getElementById("loginPassword")
              .value;

          loginMessage.textContent =
            "Signing in...";

          const { error } =
            await supabaseClient.auth.signInWithPassword({
              email: email,
              password: password
            });

          if (error) {

            loginMessage.textContent =
              "Login failed: " +
              error.message;

            return;
          }

          loginMessage.textContent =
            "Login successful.";

          showDashboard();

        }
      );

    }

    function showLogin() {

      if (loginScreen) {
        loginScreen.style.display = "flex";
      }

      if (dashboardApp) {
        dashboardApp.style.display = "none";
      }

    }

    function showDashboard() {

      if (loginScreen) {
        loginScreen.style.display = "none";
      }

      if (dashboardApp) {
        dashboardApp.style.display = "block";
      }

      startDashboard();

    }

    function startDashboard() {

      const newArticleButton =
        document.getElementById(
          "newArticleButton"
        );

      const cancelButton =
        document.getElementById(
          "cancelButton"
        );

      const articleEditor =
        document.getElementById(
          "articleEditor"
        );

      const articleForm =
        document.getElementById(
          "articleForm"
        );

      const articleImage =
        document.getElementById(
          "articleImage"
        );

      const imagePreview =
        document.getElementById(
          "imagePreview"
        );

      const articlesList =
        document.getElementById(
          "articlesList"
        );

      if (newArticleButton) {

        newArticleButton.onclick =
          function () {

            articleEditor.classList.add(
              "show"
            );

            articleEditor.scrollIntoView({
              behavior: "smooth"
            });

          };

      }

      if (cancelButton) {

        cancelButton.onclick =
          function () {

            articleEditor.classList.remove(
              "show"
            );

            articleForm.reset();

            if (imagePreview) {
              imagePreview.innerHTML = "";
            }

          };

      }

      if (articleImage) {

        articleImage.onchange =
          function () {

            const file =
              articleImage.files[0];

            if (!file) {

              imagePreview.innerHTML = "";

              return;

            }

            if (
              !file.type.startsWith(
                "image/"
              )
            ) {

              alert(
                "Please choose an image."
              );

              articleImage.value = "";

              return;

            }

            imagePreview.innerHTML = "";

            const image =
              document.createElement(
                "img"
              );

            image.src =
              URL.createObjectURL(
                file
              );

            image.alt =
              "Article picture preview";

            imagePreview.appendChild(
              image
            );

          };

      }

      if (articleForm) {

        articleForm.onsubmit =
          async function (event) {

            event.preventDefault();

            const {
              data: { session }
            } =
              await supabaseClient.auth.getSession();

            if (!session) {

              alert(
                "Please sign in first."
              );

              showLogin();

              return;

            }

            const title =
              document
                .getElementById(
                  "articleTitle"
                )
                .value
                .trim();

            const category =
              document
                .getElementById(
                  "articleCategory"
                )
                .value;

            const author =
              document
                .getElementById(
                  "articleAuthor"
                )
                .value
                .trim();

            const story =
              document
                .getElementById(
                  "articleStory"
                )
                .value
                .trim();

            const file =
              articleImage.files[0];

            if (!title || !story) {

              alert(
                "Please enter a headline and article."
              );

              return;

            }

            let imageUrl = null;

            if (file) {

              const fileExtension =
                file.name
                  .split(".")
                  .pop();

              const fileName =
                Date.now() +
                "-" +
                Math.random()
                  .toString(36)
                  .substring(2) +
                "." +
                fileExtension;

              const filePath =
                fileName;

              const {
                error: uploadError
              } =
                await supabaseClient.storage
                  .from("article-images")
                  .upload(
                    filePath,
                    file
                  );

              if (uploadError) {

                alert(
                  "Picture upload failed: " +
                  uploadError.message
                );

                return;

              }

              const {
                data: publicData
              } =
                supabaseClient.storage
                  .from("article-images")
                  .getPublicUrl(
                    filePath
                  );

              imageUrl =
                publicData.publicUrl;

            }

            const {
              error: articleError
            } =
              await supabaseClient
                .from("news")
                .insert({

                  title: title,

                  category: category,

                  author:
                    author ||
                    "OINANCE Editorial",

                  story: story,

                  image_url:
                    imageUrl,

                  published: true

                });

            if (articleError) {

              alert(
                "Article could not be published: " +
                articleError.message
              );

              return;

            }

            alert(
              "✓ Article published successfully!"
            );

            articleForm.reset();

            if (imagePreview) {
              imagePreview.innerHTML = "";
            }

            articleEditor.classList.remove(
              "show"
            );

            loadArticles();

          };

      }

      loadArticles();

    }

    async function loadArticles() {

      const articlesList =
        document.getElementById(
          "articlesList"
        );

      if (!articlesList) {
        return;
      }

      articlesList.innerHTML =
        "<p>Loading articles...</p>";

      const {
        data,
        error
      } =
        await supabaseClient
          .from("news")
          .select(
            "id, title, category, author, created_at, image_url"
          )
          .order(
            "created_at",
            {
              ascending: false
            }
          );

      if (error) {

        console.error(
          "Articles loading error:",
          error
        );

        articlesList.innerHTML =
          "<p>Could not load articles.</p>";

        return;

      }

      if (!data || data.length === 0) {

        articlesList.innerHTML =
          `<div class="empty-state">
            No published articles yet.
          </div>`;

        return;

      }

      articlesList.innerHTML = "";

      data.forEach(
        function (article) {

          const item =
            document.createElement(
              "div"
            );

          item.className =
            "dashboard-article";

          item.innerHTML = `

            <div class="dashboard-article-info">

              ${
                article.image_url
                  ? `
                    <img
                      src="${escapeHTML(
                        article.image_url
                      )}"
                      alt=""
                      class="dashboard-article-image"
                    >
                  `
                  : ""
              }

              <div>

                <h3>
                  ${escapeHTML(
                    article.title
                  )}
                </h3>

                <p>
                  ${escapeHTML(
                    article.category ||
                    "OINANCE NEWS"
                  )}
                </p>

              </div>

            </div>

            <button
              type="button"
              class="delete-article-button"
              data-id="${article.id}"
            >
              Delete
            </button>

          `;

          articlesList.appendChild(
            item
          );

        }
      );

      const deleteButtons =
        articlesList.querySelectorAll(
          ".delete-article-button"
        );

      deleteButtons.forEach(
        function (button) {

          button.addEventListener(
            "click",
            function () {

              deleteArticle(
                button.dataset.id
              );

            }
          );

        }
      );

    }

    async function deleteArticle(
      articleId
    ) {

      const confirmed =
        confirm(
          "Are you sure you want to delete this article?"
        );

      if (!confirmed) {
        return;
      }

      const {
        error
      } =
        await supabaseClient
          .from("news")
          .delete()
          .eq(
            "id",
            articleId
          );

      if (error) {

        alert(
          "Article could not be deleted: " +
          error.message
        );

        console.error(
          "Delete error:",
          error
        );

        return;

      }

      alert(
        "✓ Article deleted successfully."
      );

      loadArticles();

    }

    function escapeHTML(
      value
    ) {

      const div =
        document.createElement(
          "div"
        );

      div.textContent =
        value ?? "";

      return div.innerHTML;

    }

  }
);
