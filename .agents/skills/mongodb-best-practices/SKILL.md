---
name: mongodb-best-practices
description: MongoDB indexing, query optimization, and data modeling patterns for Payload CMS applications. Use when designing collections, debugging slow queries, optimizing database performance, or reviewing MongoDB schema decisions.
---

# MongoDB Best Practices for Payload CMS

Guidance for MongoDB indexing, query patterns, and data modeling in Payload CMS projects.

## When to Use

- Designing new Payload collections with performance in mind
- Debugging slow queries or high database load
- Reviewing index strategy for existing collections
- Planning data relationships (embedded vs referenced)
- Optimizing aggregation pipelines

## Indexing Strategy

### Payload Auto-Indexes

Payload CMS automatically creates indexes for:
- `_id` (MongoDB default)
- `slug` fields when `index: true` is set in the field config
- `createdAt` and `updatedAt` timestamps
- Relationship fields used in queries

### Custom Indexes to Add

For common Gallery 1882 query patterns, consider these compound indexes:

```typescript
// In collection config, use the `indexes` property or create via MongoDB directly

// Posts: commonly queried by status + date for listing pages
// db.posts.createIndex({ _status: 1, publishedAt: -1 })

// Happenings: queried by type + date range
// db.happenings.createIndex({ _status: 1, startDate: 1, endDate: 1 })

// Artists: queried by status for directory pages
// db.artists.createIndex({ _status: 1, lastName: 1 })
```

### Index Rules

1. **Compound indexes** -- Put equality filters first, range filters last, sort fields in between
2. **Cover your queries** -- If a query only needs fields in the index, MongoDB can serve it entirely from the index (covered query)
3. **Limit index count** -- Each index adds write overhead. Target 3-5 indexes per collection max
4. **Use `explain()`** to verify index usage:
   ```bash
   db.posts.find({ _status: "published" }).sort({ publishedAt: -1 }).explain("executionStats")
   ```
5. **Avoid indexing low-cardinality fields alone** (e.g., boolean `featured`) -- combine with other fields in a compound index

## Query Patterns

### Efficient Payload Queries

```typescript
// Use `where` with indexed fields for server-side queries
const posts = await payload.find({
  collection: 'posts',
  where: {
    _status: { equals: 'published' },
  },
  sort: '-publishedAt',
  limit: 10,
  depth: 1, // Control relationship depth to reduce joins
})
```

### Depth Control

- **depth: 0** -- Returns IDs only for relationships (fastest)
- **depth: 1** -- Populates one level of relationships (default)
- **depth: 2+** -- Nested population; avoid in list queries, use for detail pages

```typescript
// List page: shallow depth
const listings = await payload.find({ collection: 'happenings', depth: 0 })

// Detail page: deeper population
const detail = await payload.findByID({ collection: 'happenings', id, depth: 2 })
```

### Pagination

Always paginate large collections:

```typescript
const result = await payload.find({
  collection: 'posts',
  page: 1,
  limit: 12,
  where: { _status: { equals: 'published' } },
})
// result.totalDocs, result.totalPages, result.hasNextPage
```

### Projection (Select)

Limit returned fields to reduce data transfer:

```typescript
const slugsOnly = await payload.find({
  collection: 'posts',
  select: {
    slug: true,
    title: true,
    publishedAt: true,
  },
})
```

## Data Modeling

### Embedded vs Referenced

| Pattern | Use When | Example |
|---------|----------|---------|
| **Embedded** (Payload blocks/arrays) | Data is always accessed together, no independent queries needed | SEO metadata on a post, address on Space global |
| **Referenced** (Payload relationships) | Data is shared across documents or queried independently | Artists linked to Happenings, Categories on Posts |

### Relationship Patterns

```typescript
// One-to-many: Use relationship field
{
  name: 'artists',
  type: 'relationship',
  relationTo: 'artists',
  hasMany: true,
}

// Bidirectional: Add relationship on both sides or use hooks to populate
// Avoid circular depth issues by controlling depth parameter
```

### Avoid These Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Unbounded arrays | Documents grow past 16MB limit | Use relationships instead of deeply nested arrays |
| Deep nesting (>3 levels) | Slow queries, hard to index | Flatten structure, use relationships |
| Querying without indexes | Full collection scans | Add indexes for all `where` clauses |
| depth: 5+ in list queries | Cascading lookups tank performance | Use depth: 0-1 for lists, deeper only for single docs |
| Storing computed data | Stale data, sync issues | Compute at read time or use hooks to update on write |

## Monitoring

### Key Metrics to Watch

- **Slow query log**: Enable profiling for queries >100ms
  ```bash
  db.setProfilingLevel(1, { slowms: 100 })
  db.system.profile.find().sort({ ts: -1 }).limit(5)
  ```
- **Index usage**: Check which indexes are actually used
  ```bash
  db.posts.aggregate([{ $indexStats: {} }])
  ```
- **Collection stats**: Monitor document count and storage size
  ```bash
  db.posts.stats()
  ```

## MongoDB Atlas (Production)

When using MongoDB Atlas (common with Payload Cloud / Vercel):
- Use **M10+** tier for production (M0/M2/M5 have limited indexes and no profiling)
- Enable **Atlas Search** for full-text search instead of regex queries
- Set up **alerts** for slow queries and high connections
- Use **connection pooling** -- Payload handles this via the MongoDB driver, but verify `DATABASE_URI` includes appropriate options
