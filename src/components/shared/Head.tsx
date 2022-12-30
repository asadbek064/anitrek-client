import React from "react";
import NextHead from "next/head";
import { WEBSITE_URL } from "@/constants";
import { useRouter } from "next/router";
import locales from "@/locales.json";

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
}

const Head: React.FC<HeadProps> = (props) => {
  const {
    title = "AnimetTV",
    description = "Watch anime online in high quality for free. Watch anime subbed, anime dubbed online free. Update daily, fast streaming, no ads, no registration",
    image = "https://frosty-snyder-1df076.netlify.app/other/login-wp.jpg",
  } = props;

  const { asPath } = useRouter();

  return (
    <NextHead>
      <title>{title}</title>
      <link rel="manifest" href="/manifest.json" />

      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={WEBSITE_URL + asPath} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={WEBSITE_URL + asPath} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="AnimetTV" />
      <meta name="apple-mobile-web-app-title" content="AnimetTV" />
      <meta name="theme-color" content="#EF4444" />
      <meta name="msapplication-navbutton-color" content="#EF4444" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="msapplication-starturl" content="/" />
    </NextHead>
  );
};

export default Head;
