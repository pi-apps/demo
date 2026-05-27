(function () {
  const posts = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS.slice() : [];
  if (!posts.length) return;

  const path = window.location.pathname.replace(/\\/g, "/").toLowerCase();

  const formatDate = (iso) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  };

  const escapeHtml = (text) =>
    String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const getPostUrl = (slug) => `blog-post.html?slug=${encodeURIComponent(slug)}`;

  const toSlug = (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const normalizedPosts = posts
    .map((post) => ({
      ...post,
      slug: post.slug || toSlug(post.title),
      tags: Array.isArray(post.tags) ? post.tags : [],
      content: Array.isArray(post.content) ? post.content : []
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const renderCard = (post) => `
    <article class="blog-card">
      <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}">
      <div class="blog-card-content">
        <p class="blog-meta">${escapeHtml(post.category)} . ${escapeHtml(post.readTime)}</p>
        <h3><a href="${getPostUrl(post.slug)}">${escapeHtml(post.title)}</a></h3>
        <p>${escapeHtml(post.snippet)}</p>
        <p class="blog-author-meta">${escapeHtml(post.author)} . ${escapeHtml(formatDate(post.date))}</p>
      </div>
    </article>
  `;

  const renderPostBlocks = (blocks) =>
    blocks
      .map((block) => {
        if (!block || typeof block !== "object") return "";

        if (block.type === "heading") return `<h2>${escapeHtml(block.text)}</h2>`;
        if (block.type === "paragraph") return `<p>${escapeHtml(block.text)}</p>`;
        if (block.type === "quote") return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
        if (block.type === "image") {
          return `
            <figure class="post-media">
              <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt || "Post image")}">
            </figure>
          `;
        }
        if (block.type === "embed") {
          return `<div class="post-embed">${block.html || ""}</div>`;
        }
        if (block.type === "steps") {
          const items = Array.isArray(block.items) ? block.items : [];
          return `
            <div class="post-steps">
              ${items.map((item, idx) => `<div><span>${idx + 1}</span> ${escapeHtml(item)}</div>`).join("")}
            </div>
          `;
        }
        if (block.type === "list") {
          const items = Array.isArray(block.items) ? block.items : [];
          return `<ul class="post-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
        }
        return "";
      })
      .join("");

  function initBlogListing() {
    const grid = document.getElementById("blogPostsGrid");
    if (!grid) return;

    const featured = normalizedPosts.find((p) => p.featured) || normalizedPosts[0];
    const featuredMeta = document.getElementById("featuredMeta");
    const featuredTitle = document.getElementById("featuredTitle");
    const featuredSnippet = document.getElementById("featuredSnippet");
    const featuredImage = document.getElementById("featuredImage");
    const featuredReadLink = document.getElementById("featuredReadLink");
    const featuredCtaLink = document.querySelector("[data-featured-link]");

    if (featured) {
      const featuredUrl = getPostUrl(featured.slug);
      if (featuredMeta) featuredMeta.textContent = `Featured . ${featured.category}`;
      if (featuredTitle) featuredTitle.textContent = featured.title;
      if (featuredSnippet) featuredSnippet.textContent = featured.snippet;
      if (featuredImage) {
        featuredImage.src = featured.image;
        featuredImage.alt = featured.title;
      }
      if (featuredReadLink) featuredReadLink.href = featuredUrl;
      if (featuredCtaLink) featuredCtaLink.href = featuredUrl;
    }

    const tagsWrap = document.getElementById("blogTagFilters");
    const searchInput = document.getElementById("blogSearchInput");
    const emptyState = document.getElementById("blogEmptyState");
    const pageParams = new URLSearchParams(window.location.search);

    const categorySet = new Set();
    normalizedPosts.forEach((post) => {
      if (post.category) categorySet.add(post.category);
      post.tags.forEach((tag) => categorySet.add(tag));
    });

    const categories = ["all", ...Array.from(categorySet)];
    categories.slice(1).forEach((category) => {
      if (!tagsWrap) return;
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.tag = category;
      button.textContent = category;
      tagsWrap.appendChild(button);
    });

    let activeTag = "all";
    let query = pageParams.get("q") || "";

    const requestedTag = (pageParams.get("tag") || "").trim().toLowerCase();
    if (requestedTag && requestedTag !== "all") {
      const matched = categories.find((category) => category.toLowerCase() === requestedTag);
      if (matched) activeTag = matched;
    }

    const render = () => {
      const q = query.trim().toLowerCase();
      const filtered = normalizedPosts.filter((post) => {
        const matchesTag =
          activeTag === "all" ||
          post.category === activeTag ||
          post.tags.some((tag) => tag === activeTag);

        if (!matchesTag) return false;
        if (!q) return true;

        const haystack = [
          post.title,
          post.snippet,
          post.author,
          post.category,
          post.tags.join(" "),
          post.content.map((block) => block.text || "").join(" ")
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      });

      grid.innerHTML = filtered.map(renderCard).join("");
      if (emptyState) emptyState.hidden = filtered.length > 0;
    };

    if (tagsWrap) {
      tagsWrap.addEventListener("click", (event) => {
        const btn = event.target.closest("button[data-tag]");
        if (!btn) return;
        activeTag = btn.dataset.tag || "all";
        tagsWrap.querySelectorAll("button").forEach((el) => el.classList.remove("active"));
        btn.classList.add("active");
        render();
      });
    }

    if (searchInput) {
      if (query) searchInput.value = query;
      searchInput.addEventListener("input", () => {
        query = searchInput.value || "";
        render();
      });
    }

    if (tagsWrap) {
      tagsWrap.querySelectorAll("button").forEach((el) => {
        const isActive = (el.dataset.tag || "").toLowerCase() === activeTag.toLowerCase();
        el.classList.toggle("active", isActive);
      });
    }

    render();
  }

  function initBlogPostPage() {
    const postContent = document.getElementById("postContent");
    if (!postContent) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const post = normalizedPosts.find((p) => p.slug === slug) || normalizedPosts[0];

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value || "";
    };

    setText("postTitle", post.title);
    setText("postLead", post.snippet);
    setText("postMeta", `${post.category} . ${post.readTime} . Updated ${formatDate(post.date)}`);
    setText("postCategory", post.category);
    setText("postAuthor", post.author);
    setText("postDate", formatDate(post.date));
    setText("postReadTime", post.readTime);

    const hero = document.getElementById("postHeroImage");
    if (hero) {
      hero.src = post.image;
      hero.alt = post.title;
    }

    const tagsEl = document.getElementById("postTags");
    if (tagsEl) {
      tagsEl.innerHTML = post.tags
        .map((tag) => `<a href="blog.html?tag=${encodeURIComponent(tag)}">${escapeHtml(tag)}</a>`)
        .join("");
    }

    postContent.innerHTML = renderPostBlocks(post.content);

    const relatedPosts = normalizedPosts
      .filter((item) => item.slug !== post.slug)
      .filter((item) => item.category === post.category || item.tags.some((tag) => post.tags.includes(tag)))
      .slice(0, 3);

    const relatedGrid = document.getElementById("relatedPostsGrid");
    if (relatedGrid) {
      const fallback = normalizedPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
      const source = relatedPosts.length ? relatedPosts : fallback;
      relatedGrid.innerHTML = source.map(renderCard).join("");
    }

    const shareWrap = document.getElementById("postShareButtons");
    if (shareWrap) {
      shareWrap.addEventListener("click", async (event) => {
        const button = event.target.closest("button[data-share]");
        if (!button) return;

        const type = button.dataset.share;
        const url = window.location.href;
        const text = `${post.title} - SMAJ PI HUB`;
        let target = "";

        if (type === "x") {
          target = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        } else if (type === "facebook") {
          target = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        } else if (type === "linkedin") {
          target = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        } else if (type === "copy") {
          try {
            await navigator.clipboard.writeText(url);
            button.textContent = "Copied";
            setTimeout(() => {
              button.innerHTML = "<i class='bx bx-link'></i> Copy Link";
            }, 1400);
          } catch (_) {
            window.prompt("Copy this link:", url);
          }
          return;
        }

        if (target) {
          window.open(target, "_blank", "noopener,noreferrer");
        }
      });
    }
  }

  if (path.endsWith("/blog.html")) initBlogListing();
  if (path.endsWith("/blog-post.html")) initBlogPostPage();
})();
