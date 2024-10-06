import * as React from 'react'
import { Link } from 'gatsby'

export default function () {
  return (
    <main>
      <h1 className="text-xl my-5">Home</h1>
      <p>
        <span>home</span>
        <Link to="/about" className="text-blue-500">
          about
        </Link>
      </p>
    </main>
  )
}

export const Head = () => <title>Home</title>
