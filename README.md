# ⚡ Spark

**Every big app starts with a spark.**

Spark is a platform where non-technical people post and evolve software ideas, and developers discover in-demand problems worth building — without scraping Reddit, Twitter, or IdeaBrowser for inspiration.

---

Live Demo : https://spark-liard-kappa.vercel.app

## 💡 The Problem

- **Non-technical people** have great product ideas but no way to shape them into something actionable or find someone to build them.
- **Developers** want to build something people actually need, but spend hours scraping forums and social media to validate demand.
- **Ideas are static.** Once posted somewhere, they never improve — no one can refine, extend, or version them over time.

Spark fixes this by treating an idea like a living document — one that a community can collaboratively refine, and that developers can attach real products to.

---

## ✨ Core Features

### 🧠 Ideas
An idea is a clean, actionable, and *ever-evolving* description of an in-demand piece of software.

- Anyone can create an idea — the AI helps shape a vague thought into a clear one (see [AI Product Manager](#-ai)).
- Anyone can propose changes via a **Merge Request**.
- Merge requests are visible in a dedicated section where the community **upvotes/downvotes** them.
- If a merge request gets **>70% upvotes within 48 hours**, it's automatically merged and the idea's **version increments**. Otherwise, it's discarded.
- Each idea has its own **comment section** and can be **liked**.

### 🤖 AI
The AI plays two focused roles:

| Role | Behavior |
|---|---|
| **Idea Creation** | Acts as a virtual Product Manager — asks 3–4 simple clarifying questions to turn a vague idea into a well-structured starter idea, and auto-assigns a category. |
| **Idea Evolution** | When a merge request is accepted, the AI reads the current idea + the accepted request, and seamlessly rewrites the idea into its next version. |

### 📎 App Attachments
Developers can attach real, working products to an idea:

- Pay a small fee to attach an app (link to GitHub, Play Store/App Store, or a live web app).
- Each attached app has its own **title, description, link, comment section, and likes**.
- Apps are ranked under an idea by like count.
- Each app stores the **idea version it was built against** — if the link is updated, the version updates too.

### 🔍 Semantic Search (Search-First Flow)
Before creating a new idea, users search first.

- Semantic search surfaces existing ideas that match or resemble the query.
- If a close match exists, users are nudged to:
  - Try an app already attached to that idea, or
  - Contribute to the existing idea instead of duplicating it.
- This keeps the idea pool deduplicated and high-signal.

### 📰 Feed
Three primary feeds, each filterable by **tag**, **category**, or both:

- **Trending** — most liked ideas in the last 48 hours
- **Popular** — most liked ideas overall
- **Recent** — newest ideas

### 👤 Profiles
Every user has a profile showing:

- Avatar & username
- Ideas they've created and contributed to

---

## 🏗️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next js |
| Backend | Next js Server Actions and Supabse Edge Functions |
| Database | Supabase Postgres |
| AI | Groq and Cohere for embeddings |
| Auth | Supabase Auth |
| Payments | Dodo Payments |
| Hosting | Vercel |

---

---

## 📌 Project Info

- **Type:** Portfolio Project
- **Platform:** Web App
- **Payments:** Dodo Payments

---

## 🤝 Contributing

This is currently a solo portfolio build, but suggestions, issues, and ideas (fittingly) are welcome — feel free to open an issue.

---

## 📄 License

_Add a license (e.g. MIT) if you'd like this to be open source._
