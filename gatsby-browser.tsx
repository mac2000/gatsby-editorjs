import './src/styles/global.css'
import Layout from './src/components/layout'
import React from 'react'

export function wrapPageElement({ element, props }) {
  return <Layout {...props}>{element}</Layout>
}
