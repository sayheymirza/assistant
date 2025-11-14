const axios = require('axios');

const tts = async (text: string) => {
    try {
        const response = await axios.post(`${process.env["TTS_ENDPOINT"] ?? 'http://localhost:5200'}`, {
            text,
        }, {
            responseType: 'arraybuffer'
        });

        return Buffer.from(response.data);
    } catch (error) {
        console.error('Error in TTS request:', error);
        throw error;
    }
}

export { tts }