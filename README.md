# SEO AI Platform

A production-ready SEO SaaS that analyzes websites, identifies high-impact SEO issues, and tells users **exactly what to fix first** — with optional AI explanations layered safely on top.

This project was built as a real product (not a demo), with background workers, usage limits, exports, and a modern React frontend.

---

## 🚀 What This Does

- Crawl a website and analyze on-page SEO
- Detect high-signal SEO issues using deterministic rules
- Score overall site health and category-level SEO
- Highlight **“Fix this first”** (highest impact priority)
- Optionally enrich issues with AI explanations
- Export issues as CSV (agency-ready)
- Enforce usage limits cleanly (free vs pro ready)

---

## 🧠 Key Product Principles

- **Deterministic core** – SEO logic and scoring never depend on AI  
- **AI is optional** – explanations enhance, never block or change results  
- **Idempotent workers** – safe retries, no duplicate data  
- **Action over noise** – focus on what actually matters for SEO  
- **Production-ready architecture** – not a prototype

---

## 🏗️ Architecture Overview

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- BullMQ + Redis for background jobs

### Workers
- **Scan Worker**
  - Crawls pages
  - Runs SEO rules
  - Computes site & category scores
- **AI Enrichment Worker**
  - Generates human-readable explanations
  - Fully optional & kill-switchable
  - Strict output validation

### Frontend
- React + TypeScript
- Vite
- React Router
- Polling for scan progress
- Calm, trust-focused UX

---

## 📦 Features

### Core SEO
- Missing / duplicate titles
- H1 structure issues
- Meta description checks
- Indexability issues
- Broken internal links
- Thin content detection
- Lightweight performance signals

### Scoring & Prioritization
- Overall site score (0–100)
- Category scores:
  - Technical
  - Indexability
  - Content
  - Performance
- “Fix this first” guidance

### SaaS Features
- Usage limits (projects, scans, pages)
- CSV export of issues
- Onboarding & empty states
- Graceful failure handling
- Ready for monetization

---

## 📁 Repository Structure
