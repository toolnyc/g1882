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

  const postsToNewsRedirects = [
    {
      source: '/posts',
      destination: '/news',
      permanent: true,
    },
    {
      source: '/posts/:path*',
      destination: '/news/:path*',
      permanent: true,
    },
  ]

  const journalToNewsRedirects = [
    {
      source: '/journal',
      destination: '/news',
      permanent: true,
    },
    {
      source: '/journal/:path*',
      destination: '/news/:path*',
      permanent: true,
    },
  ]

  const redirects = [internetExplorerRedirect, ...postsToNewsRedirects, ...journalToNewsRedirects]

  return redirects
}

export default redirects
