import * as React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import head from '../components/head'

export default function () {
  return (
    <Layout>
      <h1 className="text-xl my-5">About</h1>
      <p>
        <Link to="/" className="text-blue-500">
          home
        </Link>
        <span>about</span>
      </p>
    </Layout>
  )
}

export const Head = () => head({ title: 'About' })
