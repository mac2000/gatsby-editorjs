import * as React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import head from '../components/head'

export default function () {
  return (
    <Layout>
      <h1 className="text-xl my-5">Home</h1>
      <p>
        <span>home</span>
        <Link to="/about" className="text-blue-500">
          about
        </Link>
      </p>
    </Layout>
  )
}

export const Head = () => head({ title: 'Home' })
