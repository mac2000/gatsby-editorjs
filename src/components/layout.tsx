import * as React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'

export default function PostPage({ children }: { children: React.ReactNode }) {
  return (
    <StaticQuery
      query={query}
      render={(data: Queries.AllSitePagePathsQuery) => (
        <table width="100%">
          <tbody>
            <tr>
              <td valign="top">
                <fieldset>
                  <legend>page</legend>
                  {children}
                </fieldset>
              </td>
              <td valign="top" width="30%">
                <fieldset>
                  <legend>paths</legend>
                  <ul>
                    {data.allSitePage.nodes
                      .map((n) => n.path)
                      .filter((p) => !p.includes('404') && p !== '/edit/')
                      .map((p) => (
                        <li key={p}>
                          <Link to={p}>{p}</Link>
                        </li>
                      ))}
                  </ul>
                </fieldset>
              </td>
            </tr>
          </tbody>
        </table>
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
