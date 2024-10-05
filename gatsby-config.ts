import type { GatsbyConfig } from 'gatsby'

const config: GatsbyConfig = {
  siteMetadata: {
    title: `gatsby ❤️ editorjs`,
    siteUrl: `https://gatsby-editorjs.mac-blog.org.ua/`,
  },
  graphqlTypegen: true,
  plugins: ['gatsby-plugin-postcss'],
}

export default config
