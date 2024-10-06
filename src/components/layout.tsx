import * as React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'

export default function PostPage({ children }: { children: React.ReactNode }) {
  return (
    <StaticQuery
      query={query}
      render={(data: Queries.AllSitePagePathsQuery) => (
        <main>
          <ul className="flex gap-3 mb-5">
            <li>paths:</li>
            {data.allSitePage.nodes
              .map((n) => n.path)
              .filter((p) => !p.includes('404') && p !== '/edit/')
              .map((p) => (
                <li key={p}>
                  <Link to={p} className="text-blue-500">
                    {p}
                  </Link>
                </li>
              ))}
          </ul>
          {children}
        </main>
      )}
    />
  )
}

export const query = graphql`
  query AllSitePagePaths {
    allSitePage {
      nodes {
        path
      }
    }
  }
`
