import { CartContextProvider } from '@/components/CartContext'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import NextNProgress from 'nextjs-progressbar';

export default function App({ Component, pageProps:{session, ...pageProps} }) {
  return (
    <>
      <SessionProvider session={session}>
          <CartContextProvider>
            <Header></Header>
              <div id="container">
                <NextNProgress color='linear-gradient(90deg, #b656cb, #10a1a0)' startPosition={0.3} stopDelayMs={200} height={5} />
                <Component {...pageProps} />
              </div>
            <Footer></Footer>
          </CartContextProvider>
        </SessionProvider>
    </>
  )
}
