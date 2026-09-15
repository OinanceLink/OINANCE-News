/* =========================
   OINANCE NEWS
   FULL ARTICLE READER
========================= */

const SUPABASE_URL =
  "https://ohvqwdtvtcqchuwethuw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_PRGk5RJCVmUB--1ovLeC0g_qo25F6L3";

const SHARE_FUNCTION_URL =
  "https://ohvqwdtvtcqchuwethuw.supabase.co/functions/v1/article-share";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

document.addEventListener(
  "DOMContentLoaded",
  function () {
    loadArticle();
  }
);

async function loadArticle() {

  const container =
    document.getElementById(
      "articleContainer"
    );

  const params =
    new URLSearchParams(
      window.location.search
    );

  const articleId =
    params.get("id");

  if (!articleId) {
    showError(
      container,
      "No article was selected."
    );
    return;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("news")
      .select(
        "id, title, category, author, story, image_url, created_at"
      )
      .eq("id", articleId)
      .eq("published", true)
      .single();

  if (error || !data) {

    console.error(
      "Article loading error:",
      error
    );

    showError(
      container,
      "This article may have been removed or is no longer available."
    );

    return;
  }

  const date =
    new Date(
      data.created_at
    ).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );

  const image =
    data.image_url
      ? `
        <img
          src="${escapeHTML(data.image_url)}"
          alt="${escapeHTML(data.title)}"
          class="article-image"
        >
      `
      : "";

  const paragraphs =
    escapeHTML(data.story)
      .split(/\n+/)
      .filter(Boolean)
      .map(
        paragraph =>
          `<p>${paragraph}</p>`
      )
      .join("");

  container.innerHTML = `

    <div class="article-header">

      <span class="article-category">
        ${escapeHTML(
          data.category || "OINANCE NEWS"
        )}
      </span>

      <h1>
        ${escapeHTML(data.title)}
      </h1>

      <div class="article-meta">

        <span>
          By ${escapeHTML(
            data.author || "OINANCE Editorial"
          )}
        </span>

        <span>
          ${date}
        </span>

      </div>

    </div>

    ${image}

    <div class="article-story">
      ${paragraphs}
    </div>

    <div class="article-share">

      <button
        type="button"
        class="x-share-button"
        id="xShareButton"
      >
        𝕏 Share on X
      </button>

    </div>

    <div class="article-back">

      <a href="index.html#news">
        ← Back to OINANCE News
      </a>

    </div>

  `;

  const shareButton =
    document.getElementById(
      "xShareButton"
    );

  shareButton.addEventListener(
    "click",
    function () {

      const previewUrl =
        SHARE_FUNCTION_URL +
        "?id=" +
        encodeURIComponent(
          data.id
        );

      const shareText =
        data.title +
        " — OINANCE Technology";

      const xUrl =
        "https://twitter.com/intent/tweet" +
        "?text=" +
        encodeURIComponent(
          shareText
        ) +
        "&url=" +
        encodeURIComponent(
          previewUrl
        );

      window.open(
        xUrl,
        "_blank",
        "noopener,noreferrer"
      );

    }
  );
}

function showError(
  container,
  message
) {

  container.innerHTML = `

    <div class="article-error">

      <h1>
        Article not found
      </h1>

      <p>
        ${escapeHTML(message)}
      </p>

      <a href="index.html#news">
        ← Back to OINANCE News
      </a>

    </div>

  `;
}

function escapeHTML(value) {

  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    value ?? "";

  return div.innerHTML;
}
