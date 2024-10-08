import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import EditorJS, { OutputData } from '@editorjs/editorjs'
import Paragraph from '@editorjs/paragraph'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import Delimiter from '@editorjs/delimiter'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import CodeTool from '@editorjs/code'
import InlineCode from '@editorjs/inline-code'

const client_id = 'Ov23li1ABZla2FQD1FmZ'

export default function () {
  const ref = useRef<HTMLDivElement>(null)
  const [token, setToken] = useState<string>(typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('token') || '' : '')
  const path = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('path')?.replace(/^\//, 'src/pages/')?.replace(/\/$/, '.json') : ''
  const [sha, setSha] = useState<string>()
  const [data, setData] = useState<OutputData | undefined>()
  const [editor, setEditor] = useState<EditorJS | undefined>()

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

  useEffect(() => {
    if (!ref.current || !data || typeof window === 'undefined') {
      return
    }

    const editor = new EditorJS({
      holder: ref.current,
      data: data,
      autofocus: true,
      placeholder: 'edit me',
      // logLevel: LogLevels.VERBOSE,
      readOnly: false,
      tools: {
        paragraph: Paragraph,
        header: Header,
        list: List,
        quote: Quote,
        delimiter: Delimiter,
        // embed: Embed,
        // table: {
        //   class: Table,
        //   inlineToolbar: true,
        // },
        code: CodeTool,
        inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+M',
        },
      },
    })
    setEditor(editor)

    return () => {
      setEditor(undefined)
      editor.destroy()
    }
  }, [ref, data])

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

export async function config() {
  return () => ({ defer: true })
}
