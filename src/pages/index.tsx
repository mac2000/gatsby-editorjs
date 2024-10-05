import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'

const Page: React.FC<PageProps> = () => {
  return (
    <main>
      <h1 className="text-xl my-5">Home</h1>
    </main>
  )
}

export default Page

export const Head: HeadFC = () => <title>Home</title>
