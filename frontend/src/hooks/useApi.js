import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useApi = (apiFunction, ...args) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiFunction(token, ...args);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiFunction, token, ...args]);

  return { data, loading, error };
};

export default useApi;