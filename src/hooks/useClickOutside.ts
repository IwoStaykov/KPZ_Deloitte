import { useEffect, RefObject } from 'react';

/**
 * Hook do wykrywania kliknięć poza określonym elementem
 * @param ref Referencja do elementu, który ma być monitorowany
 * @param handler Funkcja wywoływana, gdy kliknięcie nastąpi poza elementem
 * @param excludeRefs Opcjonalna tablica referencji do elementów, które mają być wykluczone z detekcji
 */
function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  excludeRefs: RefObject<HTMLElement>[] = []
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Sprawdzamy, czy kliknięcie było poza monitorowanym elementem
      if (!ref.current || ref.current.contains(target)) {
        return;
      }
      
      // Sprawdzamy, czy kliknięcie było w którymś z wykluczonych elementów
      const isInExcludedRef = excludeRefs.some(
        excludeRef => excludeRef.current && excludeRef.current.contains(target)
      );
      
      if (isInExcludedRef) {
        return;
      }
      
      handler(event);
    };
    
    // Dodajemy nasłuchiwanie na zdarzenia mousedown i touchstart
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    // Usuwamy nasłuchiwanie przy odmontowaniu komponentu
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, excludeRefs]);
}

export default useClickOutside;
