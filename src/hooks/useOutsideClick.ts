import { useEffect } from 'react';

type UseOutsideClickProps = {
  ref: React.RefObject<HTMLElement>;
  onOutsideClick: () => void;
  triggerClassNames?: string[]; // np. ['.filter-toggle-btn'] – elementy, które NIE powodują zamknięcia
};

const useOutsideClick = ({ ref, onOutsideClick, triggerClassNames = [] }: UseOutsideClickProps) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Jeżeli kliknięto wewnątrz triggera – ignoruj
      const clickedOnTrigger = triggerClassNames.some(className =>
        target.closest(className)
      );
      if (clickedOnTrigger) return;

      // Jeżeli kliknięto poza komponentem – wywołaj zamykanie
      if (ref.current && !ref.current.contains(target)) {
        onOutsideClick();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, onOutsideClick, triggerClassNames]);
};

export default useOutsideClick;
