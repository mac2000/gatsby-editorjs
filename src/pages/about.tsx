import * as React from 'react'
import { Link } from 'gatsby'

export default function () {
  return (
    <main>
      <h1 className="text-xl my-5">About</h1>
      <p>
        <Link to="/" className="text-blue-500">
          home
        </Link>
        <span>about</span>
      </p>
    </main>
  )
}

export const Head = () => <title>About</title>
