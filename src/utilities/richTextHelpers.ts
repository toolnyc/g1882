type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
}

/**
 * Extract plain text from a Lexical rich text editor state object.
 */
export function extractPlainText(
  richText: { root?: LexicalNode } | null | undefined,
): string {
  if (!richText?.root) return ''

  const walk = (node: LexicalNode): string => {
    if (node.type === 'text') return node.text || ''
    if (node.children) return node.children.map(walk).join(' ')
    return ''
  }

  return walk(richText.root).trim()
}
