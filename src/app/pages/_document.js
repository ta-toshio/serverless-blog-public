import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            type="text/css"
            charSet="UTF-8"
            href="https://cdn.jsdelivr.net/npm/musubii@6.6.0/docs/css/musubii.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            charSet="UTF-8"
            href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            charSet="UTF-8"
            href="/static/app.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument