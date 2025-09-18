# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server at localhost:4321
- `npm run dev:host` - Start dev server with host access
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands

## Architecture

This is a photography portfolio site built with Astro 5.x and Tailwind CSS 4.x.

### Content Collections

The site uses two Astro content collections:

1. **Photos collection** (`src/content/photos/`): Main portfolio images with schema defining:
   - Image metadata (id, title, description, altText)
   - File paths for full-size and thumbnail images
   - Photography details (format, aspectRatio)
   - Organization indices (collectionIndex, categoryIndex, imageIndex)

2. **Blog collection** (`src/content/blog/`): Standard blog posts with title, description, dates

### Gallery System

The main gallery (`src/components/Gallery.astro`) implements a dual-pane interface:
- Left pane: Scrollable thumbnail gallery with snap scrolling
- Right pane: Full-size image drawer that activates based on scroll position
- Responsive behavior: Mobile uses overlay drawer, desktop shows side-by-side

Key features:
- Scroll-based image activation using getBoundingClientRect()
- Dynamic opacity transitions for full-size images
- Responsive event listeners that adapt to screen size
- Touch and click outside handlers for mobile drawer

### Site Configuration

- Site URL: https://jongood.photo
- Responsive images enabled in astro.config.mjs
- Tailwind CSS 4.x integrated via Vite plugin
- Sitemap generation included

### Photo Content Structure

Photo markdown files use YAML frontmatter with specific format:
```yaml
'id': 'image-1'
'altText': 'Description'
'file': './image1.jpg'  # Full size image
'thumbnail': './image1.jpg'  # Thumbnail (can be same file)
'aspectRatio': '1:1'  # Options: '1:1', '3:2', '16:9'
```

The Gallery component dynamically sizes images based on aspectRatio and generates responsive srcsets.