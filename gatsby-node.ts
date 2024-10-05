import { GatsbyNode } from 'gatsby'
import { resolve } from 'path'
import { readdirSync, readFileSync } from 'fs'
import { OutputData } from '@editorjs/editorjs'

export const createPages: GatsbyNode['createPages'] = async ({ actions, reporter }) => {
  const component = resolve('./src/components/page.tsx')
  const pages = getEditorJsFiles()
  reporter.info(`retrieved ${pages.length} editor.js files`)
  for (const [path, context] of Object.entries(pages)) {
    actions.createPage({ path, component, context })
  }
}

function getEditorJsFiles(): Record<string, OutputData> {
  const items: Record<string, OutputData> = {}
  for (const path of readdirSync(resolve('./src/pages'), { recursive: true })) {
    if (typeof path !== 'string') {
      continue
    }
    if (!path.endsWith('.json')) {
      continue
    }
    try {
      const content = readFileSync(resolve('./src/pages', path), 'utf-8')
      const { time, version, blocks } = JSON.parse(content)
      if (!time || typeof time !== 'number') {
        continue
      }
      if (!version || typeof version !== 'string' || !version.match(/^\d+\.\d+\.\d+$/)) {
        continue
      }
      items[path.replace(/\.json$/, '')] = { time, version, blocks }
    } catch {
      continue
    }
  }
  return items
}
