import * as React from 'react'
import { OutputBlockData, OutputData } from '@editorjs/editorjs'
import { ParagraphData } from '@editorjs/paragraph'
import { HeaderData } from '@editorjs/header'
import { ListData } from '@editorjs/list'
import { Link } from 'gatsby'

export default function ({ pageContext: { blocks } }: { pageContext: OutputData }) {
  return (
    <main>
      <Blocks blocks={blocks} />
      {typeof window !== 'undefined' && (
        <div className="mt-5">
          <Link to={`/edit/?path=${window.location.pathname}`} className="text-blue-500">
            edit this page
          </Link>
        </div>
      )}
    </main>
  )
}

export function Blocks({ blocks }: { blocks: OutputBlockData[] }) {
  return blocks.map((block) => {
    switch (block.type) {
      case 'paragraph':
        return <p key={block.id!} dangerouslySetInnerHTML={{ __html: (block.data as ParagraphData).text }} />
      case 'header':
        return <h2 key={block.id!}>{(block.data as HeaderData).text}</h2>
      case 'list':
        return (block.data as ListData).style === 'ordered' ? (
          <ol key={block.id}>
            {(block.data as ListData).items.map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ol>
        ) : (
          <ul key={block.id}>
            {(block.data as ListData).items.map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        )
      case 'table':
        return (
          <table key={block.id!}>
            {(block.data as { content: string[][] }).content.map((row, rid) => (
              <tr key={rid}>
                {row.map((cell, cid) => (
                  <td key={cid}>{cell}</td>
                ))}
              </tr>
            ))}
          </table>
        )
      case 'delimiter':
        return <hr key={block.id!} />
      default:
        return (
          <p key={block.id!}>
            <pre>{JSON.stringify(block.data, null, 2)}</pre>
          </p>
        )
    }
  })
}

export const Head = () => <title>page</title>
