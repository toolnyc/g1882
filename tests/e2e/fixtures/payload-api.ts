import { test as base, expect, type APIRequestContext } from '@playwright/test'

export interface PayloadAPI {
  updateGlobal(slug: string, data: Record<string, unknown>): Promise<Record<string, unknown>>
  getGlobal(slug: string): Promise<Record<string, unknown>>
  createDoc(
    collection: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>>
  updateDoc(
    collection: string,
    id: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>>
  deleteDoc(collection: string, id: string): Promise<void>
  findDocs(
    collection: string,
    query?: Record<string, string>,
  ): Promise<{ docs: Record<string, unknown>[]; totalDocs: number }>
}

function buildAPI(request: APIRequestContext, token: string): PayloadAPI {
  const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const headers = {
    Authorization: `users API-Key ${token}`,
    'Content-Type': 'application/json',
  }

  return {
    async updateGlobal(slug, data) {
      const res = await request.patch(`${baseURL}/api/globals/${slug}`, {
        headers,
        data,
      })
      if (!res.ok()) {
        throw new Error(`updateGlobal(${slug}) failed: ${res.status()} ${await res.text()}`)
      }
      return res.json()
    },

    async getGlobal(slug) {
      const res = await request.get(`${baseURL}/api/globals/${slug}`, { headers })
      if (!res.ok()) {
        throw new Error(`getGlobal(${slug}) failed: ${res.status()} ${await res.text()}`)
      }
      return res.json()
    },

    async createDoc(collection, data) {
      const res = await request.post(`${baseURL}/api/${collection}`, {
        headers,
        data,
      })
      if (!res.ok()) {
        throw new Error(
          `createDoc(${collection}) failed: ${res.status()} ${await res.text()}`,
        )
      }
      const json = await res.json()
      return json.doc ?? json
    },

    async updateDoc(collection, id, data) {
      const res = await request.patch(`${baseURL}/api/${collection}/${id}`, {
        headers,
        data,
      })
      if (!res.ok()) {
        throw new Error(
          `updateDoc(${collection}, ${id}) failed: ${res.status()} ${await res.text()}`,
        )
      }
      const json = await res.json()
      return json.doc ?? json
    },

    async deleteDoc(collection, id) {
      const res = await request.delete(`${baseURL}/api/${collection}/${id}`, {
        headers,
      })
      if (!res.ok()) {
        throw new Error(
          `deleteDoc(${collection}, ${id}) failed: ${res.status()} ${await res.text()}`,
        )
      }
    },

    async findDocs(collection, query) {
      const params = new URLSearchParams(query)
      const url = query
        ? `${baseURL}/api/${collection}?${params.toString()}`
        : `${baseURL}/api/${collection}`
      const res = await request.get(url, { headers })
      if (!res.ok()) {
        throw new Error(
          `findDocs(${collection}) failed: ${res.status()} ${await res.text()}`,
        )
      }
      return res.json()
    },
  }
}

export const test = base.extend<{ payloadAPI: PayloadAPI }>({
  payloadAPI: async ({ request }, use) => {
    const email = process.env.TEST_ADMIN_EMAIL
    const password = process.env.TEST_ADMIN_PASSWORD
    if (!email || !password) {
      throw new Error(
        'TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD must be set in environment',
      )
    }

    const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const loginRes = await request.post(`${baseURL}/api/users/login`, {
      data: { email, password },
      headers: { 'Content-Type': 'application/json' },
    })

    if (!loginRes.ok()) {
      throw new Error(`Payload login failed: ${loginRes.status()} ${await loginRes.text()}`)
    }

    const { token } = await loginRes.json()
    if (!token) {
      throw new Error('Payload login did not return a token')
    }

    await use(buildAPI(request, token))
  },
})

export { expect }
