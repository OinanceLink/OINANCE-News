/* =========================
   OINANCE NEWS
   FULL ARTICLE READER
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


document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadArticle();

  }
);


/* =========================
   LOAD ARTICLE
========================= */

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

    container.innerHTML = `
      <div class="article-error">
        <h1>Article not found</h1>
        <p>
          No article was selected.
        </p>
        <a href="index.html#news">
          ← Back to OINANCE News
        </a>
      </div>
    `;

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

    container.innerHTML = `
      <div class="article-error">
        <h1>Article not found</h1>
        <p>
          This article may have been removed
          or is no longer available.
        </p>
        <a href="index.html#news">
          ← Back to OINANCE News
        </a>
      </div>
    `;

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


    <div class="article-back">

      <a href="index.html#news">
        ← Back to OINANCE News
      </a>

    </div>

  `;

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
