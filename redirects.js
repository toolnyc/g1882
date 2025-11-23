const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const postsToJournalRedirects = [
    {
      source: '/posts',
      destination: '/journal',
      permanent: true,
    },
    {
      source: '/posts/:path*',
      destination: '/journal/:path*',
      permanent: true,
    },
  ]

  const redirects = [internetExplorerRedirect, ...postsToJournalRedirects]

  return redirects
}

export default redirects
