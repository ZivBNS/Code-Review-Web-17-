// Mock AI Service for Socratic Review

const mockResponses = [
  "That's an interesting observation! Why do you think that line might cause a memory leak?",
  "Look closely at the dependency array in the useEffect. What happens when the component unmounts?",
  "You mentioned error handling. What would happen if 'items' is null in the calculateTotal function?",
  "Good catch on the hardcoded styles! How could we use our CSS framework to make this more maintainable?",
  "Does this code align with the 'Security' category in our 12-category checklist? Why or why not?",
  "Let's trace the execution. If a user clicks the button rapidly, what state changes occur?"
];

export const sendMockChatMessage = async (message, contextLine = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Pick a random response to simulate Socratic questioning
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      let response = randomResponse;
      if (contextLine) {
         response = `Regarding line \${contextLine}: \${response}`;
      }

      resolve({
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      });
    }, 1000);
  });
};
