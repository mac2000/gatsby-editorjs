import React, { lazy, Suspense } from 'react'

const ClientSideOnlyLazy = lazy(() => import('../components/editor'))

// https://www.gatsbyjs.com/docs/using-client-side-only-packages/#workaround-3-use-reactlazy-and-suspense-on-client-side-only
export default function () {
  if (typeof window === 'undefined') {
    return null
  }
  return (
    <Suspense>
      <ClientSideOnlyLazy />
    </Suspense>
  )
}
