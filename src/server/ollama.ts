import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "http://localhost:11434/v1/",

    // required but ignored
    apiKey: "ollama",
});

const model = "gpt-oss:20b-cloud";

const call = async (messages: any[], onStream: any = null) => {
    try {
        let msgs = messages.filter((item) => item.type == 'message').map((msg) => ({
            role: msg.data.role,
            content: msg.data.text,
        }));        

        const timestamp = Date.now();
        const response: any = await openai.chat.completions.create({
            model,
            messages: msgs,
            stream: Boolean(onStream),
        });

        if (onStream) {
            let message = "";
            for await (const chunk of response) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    onStream({
                        type: "message",
                        data: {
                            role: "assistant",
                            text: content,
                            timestamp,
                            tts: false,
                            stream: true,
                        }
                    });
                    message += content;
                }
            }

            return {
                type: "message",
                data: {
                    role: "assistant",
                    text: message,
                    timestamp,
                    tts: true,
                }
            }
        } else {
            return {
                type: "message",
                data: {
                    role: "assistant",
                    text: response.choices[0].message.content,
                    timestamp,
                    tts: true,
                }
            }
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export { call }