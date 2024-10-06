import React from 'react'
import Layout from './src/components/layout'

export function onRenderBody({ setBodyAttributes }) {
  setBodyAttributes({
    className: 'container my-5 mx-auto text-slate-800 bg-slate-100 dark:bg-slate-800 dark:text-slate-100',
  })
}

export function wrapPageElement({ element, props }) {
  return <Layout {...props}>{element}</Layout>
}
