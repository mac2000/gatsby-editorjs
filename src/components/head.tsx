import * as React from 'react'

export default function ({ title }: { title: string }) {
  return [<html lang="en" />, <title>{title}</title>, <body className="container my-5 mx-auto text-slate-800 bg-slate-100 dark:bg-slate-800 dark:text-slate-100" />]
}
