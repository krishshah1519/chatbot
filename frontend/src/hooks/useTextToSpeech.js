import { useRef, useCallback, useState, useEffect } from 'react';

export const useTextToSpeech = (token) => {
  const audioRef = useRef(null);
  const abortControllerRef = useRef(null);

  const [status, setStatus] = useState('idle');


  useEffect(() => {

    return () => {
      // Abort any ongoing fetch request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Stop and clear any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    setStatus('idle');
  }, []);

  const play = useCallback(async (text) => {
    // Stop any currently playing audio before starting a new one
    stop();

    if (!text || typeof text !== 'string') {
      console.error('TTS Error: Invalid text provided.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    abortControllerRef.current = new AbortController();

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';
      const response = await fetch(`${API_URL}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
        signal: abortControllerRef.current.signal, // Pass the signal to fetch
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplaying = () => setStatus('playing');
      audio.onended = () => setStatus('idle');
      audio.onerror = () => setStatus('error');

      await audio.play();
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching or playing audio:', error);
        setStatus('error');
      }
    }
  }, [token, stop]);

  return { play, stop, status };
};