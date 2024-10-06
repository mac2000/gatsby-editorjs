# gatsby ❤️ editorjs

## How it works

We have simple getting started gatsby website that utilizes github pages

At the begining only pages from `src/pages/whatever.tsx` are available on web site

The idea is to use `src/pages/whatever.json` instead, where JSON is an output from editor.js

To do so, we need (pseudo)

**gatsby-node.ts**

```ts
import { GatsbyNode } from 'gatsby'

export const createPages: GatsbyNode['createPages'] = async ({ actions }) => {
  const component = resolve('./src/components/page.tsx')
  const pages = recursivelyGetContentsOfEditorJsJsonFilesUnderSrc()
  for (const [path, context] of Object.entries(pages)) {
    actions.createPage({ path, component, context })
  }
}

function recursivelyGetContentsOfEditorJsJsonFilesUnderSrc() {
  const items: Record<string, OutputData> = {} // using path as key and json content as value
  for (const path of readdirSync(resolve('./src/pages'), { recursive: true })) {
    // TODO: perform checks to filter unwanted files
    items[path.replace(/\.json$/, '')] = JSON.parse(readFileSync(path, 'utf-8'))
  }
  return items
}
```

and suddenly all our json files become web site pages 🔥

now the trick is to render them

**src/components/page.tsx**

```tsx
import * as React from 'react'
import { OutputData } from '@editorjs/editorjs'

export default function ({ pageContext: { blocks } }: { pageContext: OutputData }) {
  return <pre>{JSON.stringify(blocks, null, 2)}</pre>
}
```

So, technically it works the same way as with markdown files, except file format

Now the fun part **editor.js**

On every page we added an link to edit url, this url will:

- github auth
- fetch json right from github repository
- render editor.js
- on save - just commit data back to github

> Note: there are few gatsby related workarounds to make it work - editor.js can not be part of gatsby build and broke everythings, that's why we did an workaround with suspense and lazy

**src/pages/edit.tsx**

```tsx
export default function () {
  const ref = useRef<HTMLDivElement>(null)
  const [token, setToken] = useState<string>(typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('token') || '' : '')
  const path = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('path')?.replace(/^\//, 'src/pages/')?.replace(/\/$/, '.json') : ''
  const [sha, setSha] = useState<string>()
  const [data, setData] = useState<OutputData | undefined>()
  const [editor, setEditor] = useState<EditorJS | undefined>()

  // on page load - retrieve json from github
  useEffect(() => {
    if (!path || !token || typeof window === 'undefined') {
      return
    }
    fetch(`https://api.github.com/repos/mac2000/gatsby-editorjs/contents/${path}`, { headers: { authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(({ content, sha }) => {
        setSha(sha)
        return atob(content).toString()
      })
      .then((content) => JSON.parse(content))
      .then(setData)
  }, [])

  // create an editor.js instance for retrieved data
  useEffect(() => {
    if (!ref.current || !data || typeof window === 'undefined') {
      return
    }

    const editor = new EditorJS({
      holder: ref.current,
      data: data,
      // ...
    })
    setEditor(editor)

    return () => {
      setEditor(undefined)
      editor.destroy()
    }
  }, [ref, data])

  // on save - just commit changes back to github
  const save = () => {
    if (!editor) {
      return
    }
    editor.save().then((data) => {
      const content = JSON.stringify(data, null, 2)
      fetch(`https://api.github.com/repos/mac2000/gatsby-editorjs/contents/${path}`, {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          message: 'edit',
          content: btoa(content),
          sha: sha,
        }),
      }).then((r) => {
        if (r.status === 200) {
          alert('changes saved, navigate to github actions to see build and deploy progress')
        } else {
          r.text().then(alert)
        }
      })
    })
  }

  // unfortunately: neither device flow nor usual flow allows us to do it without server, as a workaround - use token input
  const login = () => {
    alert('not implemented, requires backend')
    // fetch('https://github.com/login/device/code', {
    //   method: 'POST',
    //   headers: { 'content-type': 'application/json' },
    //   body: JSON.stringify({ client_id, scope: 'user repo' }),
    // })
    //   .then((r) => r.json())
    //   .then(({ device_code, user_code, verification_uri, expires_in, interval }) => {
    //     console.log({ device_code, user_code, verification_uri, expires_in, interval })
    //   })
  }

  return (
    <main>
      <div ref={ref} />
      <hr />
      <p>
        token:{' '}
        <input
          type="password"
          value={token}
          onChange={(e) => {
            setToken(e.target.value)
            sessionStorage.setItem('token', e.target.value)
          }}
        />{' '}
        todo: github oauth app
        <button onClick={login}>login</button>
      </p>
      <p>path: {path}</p>
      <p>
        <button onClick={save}>save</button>
      </p>
    </main>
  )
}

export const Head = () => <title>Edit</title>
```

## TODO

- **graphql:** theoretically it should be possible to integrate editor.js output data into graph typing, so it will enforce us to be specific on what we are retrieving
- **oauth:** without auth makes no sense, because we still need server or at least some lambda, but if we have it we may use full power and something like next.js instead
- **workflows:** crazy idea which will work but does not wors it - we may trigger an workflow in our repo, watch it to complete, and insde perform device flow auth
