import { useEffect, useState } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';

export const useUserSub = () => {
  const [sub, setSub] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const loadSub = async () => {
      try {
        const attributes = await fetchUserAttributes();
        if (attributes.sub) {
          setSub(attributes.sub);
        } else {
          throw new Error('Brak atrybutu sub');
        }
      } catch (err) {
        setError(err);
        console.error('Błąd przy pobieraniu sub:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSub();
  }, []);

  return { sub, loading, error };
};
