// A simplified example for useTextToSpeech.js
import { useCallback, useEffect } from 'react';

export const useTextToSpeech = () => {
  const play = useCallback((text) => {
    if (!text || typeof text !== 'string' || !('speechSynthesis' in window)) {
      console.error("Speech synthesis not supported or no text provided.");
      return;
    }

    // Stop any currently speaking utterances
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // utterance.voice = window.speechSynthesis.getVoices()[0];
     utterance.pitch = 10;
     utterance.rate = .7;

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Ensure speech is cancelled on component unmount
  useEffect(() => stop, [stop]);

  return { play, stop };
};