---
name: payload-cms-patterns
description: Payload CMS collection design, hooks, globals, access control, and relationship patterns. Use when creating or modifying Payload collections, writing hooks, configuring access control, designing content models, or troubleshooting Payload-specific issues.
---

# Payload CMS Patterns

Reference for Payload CMS collection design, hooks, globals, access control, and relationship patterns used in the Gallery 1882 project.

## When to Use

- Creating or modifying Payload collections
- Writing beforeChange/afterChange hooks
- Configuring field-level or collection-level access control
- Designing content relationships
- Setting up draft/publish workflows
- Adding custom endpoints or API behavior

## Collection Design

### Standard Collection Template

```typescript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  labels: { singular: 'Item', plural: 'Items' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    // ... content fields
  ],
  hooks: {
    afterChange: [revalidateCollection],
  },
}
```

### Field Types Quick Reference

| Type | Use Case | Notes |
|------|----------|-------|
| `text` | Short strings | Add `unique: true` and `index: true` for slugs |
| `richText` | Long-form content | Uses Lexical editor by default in Payload 3 |
| `relationship` | Link to other collections | Set `hasMany` for arrays |
| `upload` | Media references | Points to Media collection |
| `date` | Timestamps, event dates | Use `admin.date.pickerAppearance` for UX |
| `select` | Enum/dropdown | Define `options` array |
| `array` | Repeating field groups | Avoid unbounded growth |
| `blocks` | Layout builder | Each block type is a separate config |
| `group` | Organized field groups | No separate DB document, just nesting |
| `tabs` | Admin UI organization | Visual grouping only, no data impact |

### Draft/Publish Workflow

Enable versions with drafts for editorial control:

```typescript
{
  versions: {
    drafts: {
      autosave: { interval: 1500 },
      schedulePublish: true, // Enables scheduled publishing via jobs queue
    },
    maxPerDoc: 10,
  },
}
```

Access draft content with `draft: true`:

```typescript
// Frontend preview: include drafts
const doc = await payload.findByID({
  collection: 'posts',
  id,
  draft: true,
})
```

## Hooks

### Hook Execution Order

1. `beforeValidate` -- Modify data before validation
2. `beforeChange` -- Modify data before save (generate slugs, set defaults)
3. `afterChange` -- Side effects after save (revalidation, notifications)
4. `beforeRead` -- Modify query before execution
5. `afterRead` -- Transform data before returning to client
6. `beforeDelete` / `afterDelete` -- Cleanup related data

### Revalidation Hook Pattern

Used across all public-facing collections to trigger Next.js ISR:

```typescript
import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePost: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating post: ${doc.slug}`)
      revalidatePath(`/journal/${doc.slug}`)
      revalidateTag('posts-sitemap')
    }
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidatePath(`/journal/${previousDoc.slug}`)
    }
  }
  return doc
}
```

### Slug Generation Hook

```typescript
import type { FieldHook } from 'payload'
import { formatSlug } from '@/utilities/formatSlug'

export const formatSlugHook: FieldHook = ({ data, operation, value }) => {
  if (operation === 'create' || !value) {
    return formatSlug(data?.title || '')
  }
  return value
}
```

### Population Hook (Auto-fill Related Data)

```typescript
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req }) => {
  if (doc?.authors) {
    const populated = await Promise.all(
      doc.authors.map(async (author) => {
        const authorDoc = await req.payload.findByID({
          collection: 'users',
          id: typeof author === 'string' ? author : author.id,
          depth: 0,
        })
        return authorDoc
      }),
    )
    doc.populatedAuthors = populated
  }
  return doc
}
```

## Globals

### Global Config Pattern

```typescript
import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  access: { read: () => true },
  fields: [
    { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'heroTitle', type: 'text' },
    // ...
  ],
}
```

### Fetching Globals

```typescript
const homeData = await payload.findGlobal({ slug: 'home', depth: 1 })
```

## Access Control

### Common Patterns

```typescript
// Public read, admin-only write
{
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
}

// Field-level access
{
  name: 'internalNotes',
  type: 'textarea',
  access: {
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
}
```

### Access Control for Drafts

```typescript
// Allow public read only for published docs
{
  access: {
    read: ({ req: { user } }) => {
      if (user) return true // Admins see all
      return { _status: { equals: 'published' } } // Public sees published only
    },
  },
}
```

## Relationship Patterns

### One-to-Many

```typescript
// On the "many" side (e.g., Post has many Categories)
{
  name: 'categories',
  type: 'relationship',
  relationTo: 'categories',
  hasMany: true,
  admin: { position: 'sidebar' },
}
```

### Polymorphic Relationships

```typescript
// A post can reference either an Artist or a Happening
{
  name: 'relatedContent',
  type: 'relationship',
  relationTo: ['artists', 'happenings'],
  hasMany: true,
}
```

### Join Fields (Payload 3)

```typescript
// On the Artist collection: auto-populated reverse relationship
{
  name: 'posts',
  type: 'join',
  collection: 'posts',
  on: 'artists', // Field name on posts that references artists
}
```

## Live Preview

### Configuration

```typescript
// In collection config
{
  admin: {
    livePreview: {
      url: ({ data }) => {
        return generatePreviewPath({ slug: data?.slug, collection: 'posts' })
      },
    },
  },
}
```

### Frontend Preview Component

```typescript
'use client'
import { useLivePreview } from '@payloadcms/live-preview-react'

export const PostPreview = ({ initialData, slug }) => {
  const { data } = useLivePreview({ initialData, serverURL: '', depth: 2 })
  return <PostContent post={data} />
}
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Editing `payload-types.ts` manually | Run `pnpm generate:types` after schema changes |
| Using `depth: 5` everywhere | Use minimal depth; 0 for lists, 1-2 for detail pages |
| Forgetting `index: true` on slug fields | Always index fields used in `where` queries |
| Not adding revalidation hooks | Every public-facing collection needs afterChange revalidation |
| Skipping `_status` filter in frontend queries | Public queries must filter `_status: { equals: 'published' }` |
| Circular relationship population | Control with `depth` parameter, avoid infinite loops |
| Large image uploads without size config | Configure `imageSizes` on Media collection for responsive images |
