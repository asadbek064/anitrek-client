import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  public render() {
    return (
      <Html>
        <Head>
          <meta httpEquiv="Cache-Control" content="max-age=7200" />
          <meta name="msvalidate.01" content="6A3B19EF46021550CCDDCD5F8864E9D1" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="icon" href="/favicon.ico" type="image/ico" />
        </Head>
        <body  className=" bg-dark text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
