import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <script src="https://clever-chat.ai/chatbot/1.0.0/index.js"></script>
        <clever-chatbot version="1.0.0" chatbotId="0b4e5cd22a3"></clever-chatbot>
      </body>
    </Html>
  )
}
