import BaseLayout from "@/components/layouts/BaseLayout";
import { SubscriptionContextProvider } from "@/contexts/SubscriptionContext";
import { GA_TRACKING_ID, pageview } from "@/lib/gtag";
import "@/styles/index.css";
import { appWithTranslation } from "next-i18next";
import nextI18nextConfig from "next-i18next.config";
import { AppProps } from "next/app";
import Router from "next/router";
import Script from "next/script";
import NProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { ErrorBoundary } from "react-error-boundary";
import { AppErrorFallback } from "@/components/shared/AppErrorFallback";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { UserProvider } from "@supabase/auth-helpers-react";
import GlobalPlayerContextProvider from "@/contexts/GlobalPlayerContext";

Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeComplete", NProgress.done);
Router.events.on("routeChangeError", NProgress.done);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

interface WorkaroundAppProps extends AppProps {
  err: any;
}

function App({ Component, pageProps, router, err }: WorkaroundAppProps) {
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo>(null);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const getLayout =
    // @ts-ignore
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);
    
    return (
      <React.Fragment>
        {/* A placeholder to integrate MAL-Sync (https://github.com/MALSync/MALSync)*/}
        <script id="syncData" type="application/json"></script>

        <Script id="chatBroEmbedCode">
          {`
        function ChatbroLoader(chats,async){async=!1!==async;var params={embedChatsParameters:chats instanceof Array?chats:[chats],lang:navigator.language||navigator.userLanguage,needLoadCode:'undefined'==typeof Chatbro,embedParamsVersion:localStorage.embedParamsVersion,chatbroScriptVersion:localStorage.chatbroScriptVersion},xhr=new XMLHttpRequest;xhr.withCredentials=!0,xhr.onload=function(){eval(xhr.responseText)},xhr.onerror=function(){console.error('Chatbro loading error')},xhr.open('GET','https://www.chatbro.com/embed.js?'+btoa(unescape(encodeURIComponent(JSON.stringify(params)))),async),xhr.send()}
        ChatbroLoader({encodedChatId: '18L5g'});`}
        </Script>

        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        
        <Script id="google-analytics" strategy="afterInteractive">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
          `}
        </Script>

        <Script id="clarity-analytics" type="text/javascript">
          {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "n1qy1dcgs5"); `}
        </Script>

        <ToastContainer
          position="bottom-left"
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        <QueryClientProvider client={queryClient}>
          <UserProvider supabaseClient={supabaseClient}>
            <SubscriptionContextProvider>
              <GlobalPlayerContextProvider>
                <ErrorBoundary
                  onError={(error, info) => {
                    if (process.env.NODE_ENV === "production") {
                      console.log(error);
                    }
                    setErrorInfo(info);
                  }}
                  fallbackRender={(fallbackProps) => {
                    return (
                      <AppErrorFallback
                        {...fallbackProps}
                        errorInfo={errorInfo}
                      />
                    );
                  }}
                >
                  {getLayout(<Component {...pageProps} err={err} />)}
                </ErrorBoundary>
              </GlobalPlayerContextProvider>
            </SubscriptionContextProvider>
          </UserProvider>
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
        </QueryClientProvider>
        
    </React.Fragment>
  );
}

export default appWithTranslation(App, nextI18nextConfig);
