import * as React from 'react'
import type { HeadFC } from 'gatsby'
import head from '../components/head'

export default function () {
  return (
    <main>
      <h1 className="text-xl my-5">Not found</h1>
    </main>
  )
}

export const Head = () => head({ title: 'Not found' })
