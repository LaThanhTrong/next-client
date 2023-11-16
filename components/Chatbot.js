import { useEffect } from "react"

const CleverChatBot = () => {
    useEffect(() => {
        // Load the Clever Chat AI script
        const script = document.createElement('script');
        script.src = 'https://clever-chat.ai/chatbot/1.0.0/index.js';
        script.async = true;
        document.body.appendChild(script);

        // Cleanup when the component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <clever-chatbot version="1.0.0" chatbotId="197eaacdc4a"></clever-chatbot>;
}

export default CleverChatBot;