import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  public render() {
    return (
      <Html>
        <Head>
          <meta httpEquiv="Cache-Control" content="max-age=7200" />
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
