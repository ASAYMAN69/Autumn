// Function to generate timestamp-based keyphrase
const generateTimeBasedKeyphrase = () => {
  const now = new Date();
  const utcNow = new Date(now.toUTCString());
  
  const year = utcNow.getFullYear();
  const month = String(utcNow.getMonth() + 1).padStart(2, '0');
  const date = String(utcNow.getDate()).padStart(2, '0');
  const hours = String(utcNow.getHours()).padStart(2, '0');
  const minutes = String(utcNow.getMinutes()).padStart(2, '0');
  const seconds = String(utcNow.getSeconds()).padStart(2, '0');
  const milliseconds = String(utcNow.getMilliseconds()).padStart(3, '0');
  
  return `${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}`;
};

// Generate a unique session ID or retrieve from storage
const generateSessionId = () => {
  const existingSessionId = sessionStorage.getItem('chatWidgetSessionId');
  
  if (existingSessionId) {
    return existingSessionId;
  }
  
  const timeKeyphrase = generateTimeBasedKeyphrase();
  const newSessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const keyphraseNum = parseInt(timeKeyphrase.slice(-4)) || 0;
    const r = (Math.random() * 16 + keyphraseNum) % 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  sessionStorage.setItem('chatWidgetSessionId', newSessionId);
  return newSessionId;
};

// Chat API handling
const chatApi = {
  webhookUrl: 'https://lovely-proper-sunfish.ngrok-free.app/webhook/b5a531d1-585f-43fe-ba30-ec5aacac4189/chat',
  
  sendMessage: async (message) => {
    try {
      const payload = {
        action: "sendMessage",
        sessionId: generateSessionId(),
        chatInput: message,
        metadata: {}
      };
      
      const response = await fetch(chatApi.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.output || "Sorry, I couldn't understand that.";
    } catch (error) {
      console.error('Error sending message:', error);
      return "Sorry, there was an error processing your request.";
    }
  }
};

export { generateSessionId, chatApi };
