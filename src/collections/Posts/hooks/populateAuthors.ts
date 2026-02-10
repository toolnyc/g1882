import type { CollectionAfterReadHook } from 'payload'
import { User } from 'src/payload-types'

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the authors manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req: _req, req: { payload } }) => {
  if (doc?.authors && doc?.authors?.length > 0) {
    // Collect all author IDs to batch load in a single query instead of N+1
    const authorIds: string[] = doc.authors
      .map((author: string | { id: string }) => (typeof author === 'object' ? author?.id : author))
      .filter(Boolean)

    if (authorIds.length === 0) return doc

    try {
      const result = await payload.find({
        collection: 'users',
        depth: 0,
        where: {
          id: { in: authorIds },
        },
        limit: authorIds.length,
        pagination: false,
      })

      const authorDocs: User[] = result.docs

      if (authorDocs.length > 0) {
        doc.populatedAuthors = authorDocs.map((authorDoc) => ({
          id: authorDoc.id,
          name: authorDoc.name,
        }))
      }
    } catch {
      // swallow error
    }
  }

  return doc
}
