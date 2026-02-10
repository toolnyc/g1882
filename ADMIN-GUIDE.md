# Gallery 1882 CMS Admin Guide

This guide covers everything you need to manage content on the Gallery 1882 website using the Payload CMS admin panel.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Managing Happenings (Exhibitions & Events)](#managing-happenings)
3. [Managing Artists](#managing-artists)
4. [Managing Journal Posts](#managing-journal-posts)
5. [Managing Media (Images)](#managing-media)
6. [Homepage Settings](#homepage-settings)
7. [Visit Page Settings](#visit-page-settings)
8. [Gallery Info (Space Settings)](#gallery-info)
9. [Draft & Publish Workflow](#draft--publish-workflow)
10. [Live Preview](#live-preview)
11. [Search](#search)
12. [Users & Permissions](#users--permissions)
13. [Where Content Appears on the Site](#where-content-appears)
14. [Tips & Best Practices](#tips--best-practices)

---

## Getting Started

### Accessing the Admin Panel

Navigate to your site URL followed by `/admin` (e.g., `https://gallery1882.com/admin`). Log in with your email and password.

### Dashboard Overview

After logging in you'll see the dashboard with quick links to all content collections and global settings. The sidebar provides navigation to:

- **Collections**: Happenings, Artists, Posts, Media, Categories, Users
- **Globals**: Home, Space, Visit

---

## Managing Happenings

Happenings are the core content of the site — they represent **exhibitions** (date ranges) and **events** (single days).

### Creating a New Happening

1. Go to **Happenings** in the sidebar
2. Click **Create New**
3. Fill in the required fields:

| Field | Required | Description |
|-------|----------|-------------|
| **Title** | Yes | The name of the exhibition or event |
| **Type** | Yes | Choose **Exhibition** (runs over a date range) or **Event** (single day) |
| **Start Date** | Yes | When the happening begins (includes time picker) |
| **End Date** | No | When it ends — leave blank for single-day events |
| **Description** | No | Rich text description with formatting options |
| **Artists** | No | Select one or more artists involved |
| **Hero Image** | No | Featured image displayed on listing and detail pages |

### Sidebar Options

These fields appear in the right sidebar when editing a happening:

- **Featured**: Check this to feature the happening on the homepage. Featured happenings within the current month get highlighted on the happenings listing page.
- **Is Active Override**: Check this to manually control whether the happening shows as "active" instead of relying on automatic date calculation.
- **Is Active**: Automatically calculated — a happening is active if today falls between its start and end dates. If you checked the override above, you can set this manually.
- **Slug**: Auto-generated from the title. Used in the URL (e.g., `/happenings/shoreline-reflections`).

### How Active Status Works

By default, the system automatically determines if a happening is active:
- **Exhibition with start and end dates**: Active if today is between those dates
- **Event with only a start date**: Active if today is on or after the start date
- **Override**: Check "Is Active Override" to manually control the active status regardless of dates

### Where Happenings Appear on the Site

- **Homepage**: The current active exhibition (or next upcoming one) is shown prominently. Up to 3 upcoming happenings are listed below.
- **Happenings page** (`/happenings`): All happenings organized chronologically with featured items highlighted.
- **Exhibitions page** (`/exhibitions`): Filtered view of happenings.
- **Happening detail page** (`/happenings/[slug]`): Full detail with hero image, dates, description, linked artists, and a calendar export button.
- **Artist detail pages**: Related happenings for each artist.

### Deprecated Fields (Do Not Use)

The following fields exist for backwards compatibility but should not be used for new content:
- **Category** — use the **Type** field instead
- **Featured Person** / **Featured Person Name** — use the **Artists** relationship instead

---

## Managing Artists

Artist profiles include biographical info, portfolio works, and social media links.

### Creating a New Artist

1. Go to **Artists** in the sidebar
2. Click **Create New**
3. Fill in the fields:

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Artist's full name |
| **Bio** | No | Biography text |
| **Image** | No | Profile/portrait photo |
| **Website** | No | Artist's personal website URL |

### Adding Works (Portfolio)

The **Works** section lets you build a gallery of the artist's pieces:

1. Click **Add Work**
2. Upload or select an **Image** (required for each work entry)
3. Optionally add a **Title** and **Caption** for the piece
4. Repeat for additional works

Works display in a responsive grid on the artist's detail page.

### Adding Social Links

1. Click **Add Social Link**
2. Choose the **Platform**: Instagram, Twitter/X, Facebook, LinkedIn, or Other
3. Enter the full **URL** to their profile

### Where Artists Appear on the Site

- **Artists page** (`/artists`): All artists sorted alphabetically by last name. Artists in active exhibitions show a "Currently in: [Exhibition]" subtitle.
- **Artist detail page** (`/artists/[slug]`): Full profile with bio, works gallery, social links, and related happenings.
- **Happening detail pages**: Linked artists are shown with clickable names.
- **Homepage**: A featured artist section (configured in Home settings).

---

## Managing Journal Posts

Journal posts are blog-style articles for news, interviews, and announcements.

### Creating a New Post

1. Go to **Posts** in the sidebar
2. Click **Create New**
3. Fill in the fields:

| Field | Required | Description |
|-------|----------|-------------|
| **Title** | Yes | Article headline |
| **Hero Image** | No | Featured image for the article |
| **Content** | Yes | The article body (rich text editor) |
| **Authors** | No | Select one or more admin users as authors |
| **Related Posts** | No | Link to other journal posts |
| **Artists** | No | Tag related artists |
| **Happenings** | No | Tag related exhibitions/events |

### Content Blocks

Inside the rich text editor for posts, you can insert special blocks:

- **Banner**: A styled callout box (info, warning, error, or success style)
- **Code**: A formatted code snippet (TypeScript, JavaScript, or CSS)
- **Media Block**: An inline image or media embed

### SEO Settings

Each post has an SEO tab where you can customize:
- **Meta Title**: Title for search engines (defaults to post title)
- **Meta Description**: Summary for search results
- **Meta Image**: Image for social media sharing (Open Graph)
- **Preview**: See how the post will appear in search results

### Where Posts Appear on the Site

- **Journal page** (`/journal`): All published posts sorted by publish date, newest first. The most recent post (within the last 30 days) is highlighted as a banner.
- **Post detail page** (`/journal/[slug]`): Full article with hero image, content, and related posts.
- **Search results**: Posts are indexed and searchable.

---

## Managing Media

The Media collection stores all images used across the site.

### Uploading Images

1. Go to **Media** in the sidebar
2. Click **Create New**
3. Upload your image file
4. Fill in:
   - **Alt Text**: Describe the image for accessibility (screen readers) and SEO
   - **Caption**: Optional caption displayed with the image

You can also upload images directly when editing other content — any image picker field has an upload option.

### Focal Point

When uploading, you can set a **focal point** by clicking on the image preview. This determines the center of cropping when the image is displayed at different aspect ratios (e.g., square thumbnails vs. wide banners).

### Generated Image Sizes

Each uploaded image is automatically resized into multiple versions for performance:

| Size | Dimensions | Use |
|------|-----------|-----|
| Thumbnail | 300px wide | Admin previews, small thumbnails |
| Square | 500x500px | Grid layouts, artist cards |
| Small | 600px wide | Mobile displays |
| Medium | 900px wide | Tablet and card layouts |
| Large | 1400px wide | Desktop content areas |
| XLarge | 1920px wide | Full-width hero images |
| OG | 1200x630px | Social media sharing cards |

### Image Best Practices

- **Hero images**: Use high-quality images at least 1920px wide for best results
- **Artist portraits**: Works well as square or portrait orientation
- **Artwork photos**: Ensure accurate color representation
- **Alt text**: Always fill in alt text — it's important for accessibility and SEO
- **File size**: The system handles resizing, but starting with reasonably sized files (under 10MB) keeps uploads fast

---

## Homepage Settings

The homepage is configured through the **Home** global.

### Editing Homepage Content

1. Go to **Globals > Home** in the sidebar

### Hero Section

| Field | Description |
|-------|-------------|
| **Hero Type** | Controls the hero layout: None, Low Impact, Medium Impact, or High Impact |
| **Hero Rich Text** | Headline text displayed over the hero |
| **Hero Links** | Up to 2 call-to-action buttons |
| **Hero Media** | Background image (required for Medium and High Impact types) |
| **Hero Video URL** | Cloudflare Stream iframe URL for a video background (overrides static image) |

### Mission Section

| Field | Description |
|-------|-------------|
| **Mission Caption** | Small label above the mission statement (defaults to "Our Mission") |
| **Mission Statement** | The gallery's mission statement text |
| **Mission CTA Text** | Button text for the mission section |
| **Mission CTA URL** | Button link destination |

### Featured Artist

| Field | Description |
|-------|-------------|
| **Featured Artist** | Select an artist from the Artists collection to feature |
| **Featured Artist Image** | Override the artist's default profile image with a custom one |
| **Featured Artist Description** | Custom description for the homepage (overrides the artist's bio) |

### Visit Section

| Field | Description |
|-------|-------------|
| **Visit Section Enabled** | Toggle the visit section on/off (default: on) |
| **Visit Title** | Section heading |
| **Visit Description** | Descriptive text |
| **Visit Image** | Section image |
| **Visit CTA Text** | Button text |
| **Visit CTA URL** | Button link |

### What Appears on the Homepage

After saving, the homepage updates with:
- Hero banner (with video or image background and open/closed status)
- Mission statement section
- Current or upcoming exhibition
- Featured artist spotlight
- Up to 3 upcoming happenings
- Visit information section (if enabled)

---

## Visit Page Settings

The Visit page is fully configurable through the **Visit** global.

### Editing Visit Page Content

1. Go to **Globals > Visit** in the sidebar

All sections are **conditional** — they only appear on the site if you've entered content for them. Empty sections are hidden automatically.

### Hero Image

Upload a banner image displayed at the top of the visit page.

### Hours Section

| Field | Description |
|-------|-------------|
| **Caption** | Small label (defaults to "Hours") |
| **Title** | Section heading (defaults to "Gallery Hours") |
| **Description** | Additional context about hours |
| **Regular Hours** | Array of day/hours entries (e.g., "Wednesday - Friday" / "10 AM - 6 PM") |
| **Note** | Special notes (e.g., "Last admission 30 minutes before closing") |
| **Special Hours Title** | Heading for holiday hours (defaults to "Special Hours") |
| **Special Hours** | Array of special dates with titles and descriptions |

### Admission Section

| Field | Description |
|-------|-------------|
| **Show Admission Section** | Toggle — must be checked for this section to appear |
| **Caption** | Small label (defaults to "Admission") |
| **Title** | Section heading (defaults to "Free Admission") |
| **Description** | General admission information |
| **General Admission Title/Description** | Details about standard admission |
| **General Admission Features** | List of admission benefits |
| **Group Visit Title/Description** | Information for group bookings |
| **Group Visit Features** | List of group visit benefits |

### Location & Directions

| Field | Description |
|-------|-------------|
| **Caption** | Small label (defaults to "Location") |
| **Title** | Section heading (defaults to "Getting Here") |
| **Description** | General directions overview |
| **Address** | Multi-line physical address |
| **Parking Description** | Parking information |
| **Parking Features** | List of parking amenities |
| **Directions** | Array of direction cards, each with a title, content, and style (Default/Lake/Dark) |

### About Chesterton

| Field | Description |
|-------|-------------|
| **Caption** | Small label (defaults to "About Chesterton") |
| **Title** | Section heading (defaults to "A Gateway to the Indiana Dunes") |
| **Description** | About the surrounding area |
| **Features** | Up to 3 feature cards, each with a title, description, and icon (Location, Building, or Heart) |

### FAQs

| Field | Description |
|-------|-------------|
| **Caption** | Label (defaults to "Frequently Asked Questions") |
| **Title** | Section heading (defaults to "Visitor Information") |
| **FAQs** | Array of question/answer pairs |

---

## Gallery Info

Basic gallery information is managed through the **Space** global.

### Editing Gallery Info

1. Go to **Globals > Space** in the sidebar

| Field | Description |
|-------|-------------|
| **Name** | Gallery name |
| **Tagline** | Short tagline |
| **Description** | Gallery description |
| **Address** | Physical address |
| **Phone** | Contact phone number |
| **Email** | Contact email address |
| **Admission** | Admission information |
| **Structured Hours** | Operating hours used by the homepage to calculate open/closed status |

### Structured Hours

The **Structured Hours** array is used by the homepage hero to show whether the gallery is currently open or closed. Each entry needs:

- **Day**: Day of the week (Sunday = 0, Monday = 1, ... Saturday = 6)
- **Open**: Opening time in 24-hour format (e.g., "10:00")
- **Close**: Closing time in 24-hour format (e.g., "18:00")

Only add entries for days the gallery is open. Days without entries are treated as closed.

### Where Space Info Appears

- **Footer**: Gallery name, tagline, address, phone, and email
- **Homepage hero**: Open/closed status calculated from structured hours
- **Footer hours**: Pulled from the Visit global's regular hours (with Space hours as fallback)

---

## Draft & Publish Workflow

Posts, Artists, and Happenings all support a draft/publish workflow.

### How It Works

1. **Create content**: When you first create an item, it starts as a **draft**
2. **Autosave**: Changes are saved automatically as you type
3. **Preview**: Use the live preview to see how it will look before publishing
4. **Publish**: Click the **Publish** button to make it live on the site
5. **Unpublish**: You can revert published content back to draft status

### Key Points

- **Draft content is not visible** to the public on Posts (the journal). Drafts of Artists and Happenings are still visible.
- **Up to 3 versions** are stored per document, so you can review recent changes
- **Scheduled publishing**: You can set a future date/time for content to automatically go live
- When you publish, the site **automatically updates** — affected pages are revalidated so visitors see the new content

### Version History

Each document maintains up to 3 previous versions. To view version history:

1. Open any document
2. Click the **Versions** tab
3. Browse previous versions and compare changes
4. Restore a previous version if needed

---

## Live Preview

Live Preview lets you see exactly how content will look on the site before publishing.

### Using Live Preview

1. Open any Happening, Artist, or Post
2. Click the **Preview** button in the sidebar
3. A preview window opens showing the content as it will appear on the live site
4. Changes you make in the editor update the preview in real time

### Preview Breakpoints

The preview window includes device presets:
- **Mobile**: 375x667px
- **Tablet**: 768x1024px
- **Desktop**: 1440x900px

Use these to check how your content looks across different screen sizes.

---

## Search

The site includes a search feature at `/search` that indexes published Posts.

### How Search Works

- Posts are automatically indexed when published
- Search covers: title, slug, meta title, and meta description
- Visitors can search from the search page
- Results link directly to the matching content

### Improving Search Results

- Write descriptive **titles** for your posts
- Fill in **meta descriptions** in the SEO tab — these are searched and shown in results
- Use relevant keywords naturally in your content

---

## Users & Permissions

### Managing Users

1. Go to **Users** in the sidebar
2. Click **Create New** to add a new admin user
3. Fill in **Name**, **Email**, and **Password**

### Access Levels

All admin users have full access to create, edit, and delete all content. There are no role-based restrictions — every logged-in user can manage everything.

Public visitors (not logged in) can only view published content. They cannot access the admin panel or see draft posts.

---

## Where Content Appears

Quick reference for how CMS content maps to the public website:

| CMS Location | Website Page(s) |
|-------------|----------------|
| **Happenings** | Homepage (current/upcoming), Happenings listing, Exhibitions page, Happening detail pages, Artist detail pages (related) |
| **Artists** | Artists listing, Artist detail pages, Happening detail pages (linked artists), Homepage (featured artist) |
| **Posts** | Journal listing, Post detail pages, Search results |
| **Media** | Throughout the site wherever images are used |
| **Home global** | Homepage — hero, mission, featured artist, visit section |
| **Visit global** | Visit page — hours, admission, location, directions, FAQs. Footer — hours |
| **Space global** | Footer — name, address, contact info. Homepage — open/closed status |

---

## Tips & Best Practices

### Content

- **Always add a hero image** to happenings and posts — pages look much better with visuals
- **Link artists to happenings** using the Artists field — this creates two-way connections that show on both artist and happening pages
- **Use the Featured checkbox** sparingly on happenings — only feature current or upcoming highlights for the homepage
- **Fill in SEO fields** on posts to improve search engine visibility
- **Write alt text** for all images — it helps with accessibility and search rankings

### Images

- Upload images at least **1920px wide** for hero/banner use
- Use the **focal point** tool when the subject isn't centered — this ensures proper cropping across all display sizes
- Keep original files under **10MB** for faster uploads
- The system generates all needed sizes automatically — no need to resize before uploading

### Scheduling

- Use **scheduled publishing** for time-sensitive content (e.g., announce an exhibition exactly when it opens)
- Set happening **start and end dates** accurately — the active/inactive status is calculated automatically
- For exhibitions that should stay visible after their end date, use the **Is Active Override** checkbox

### Organization

- When creating happenings, always set the correct **Type** (Exhibition vs Event) — this affects how it's displayed and filtered
- Check the **homepage** after making changes to globals — the hero, featured artist, and upcoming happenings sections all pull from different sources
- Review the **Visit page** after editing the Visit global to confirm all sections display correctly

### Troubleshooting

- **Content not appearing on the site?** Check that it's **published** (not still in draft). For posts, only published items appear publicly.
- **Homepage not updating?** Changes to the Home global trigger automatic revalidation, but it may take a moment. Try a hard refresh.
- **Images look cropped oddly?** Adjust the **focal point** on the image in the Media collection.
- **Happening showing as inactive?** Check the dates, or use **Is Active Override** to manually control the status.
- **Hours showing wrong open/closed status?** Verify the **Structured Hours** in the Space global use 24-hour time format and correct day numbers (0=Sunday through 6=Saturday).
