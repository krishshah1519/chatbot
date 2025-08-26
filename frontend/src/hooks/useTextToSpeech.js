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
     utterance.pitch = 2;
     utterance.rate = 1.3;

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);


  useEffect(() => stop, [stop]);

  return { play, stop };
};