import { useState, useEffect } from 'react';
import './search-wrapper.scss';

interface Props {
  suggestions: any[];
  renderFunction: any;
  children: React.ReactNode;
}

export const SearchWrapper = ({ suggestions, renderFunction, children }: Props) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const show = (e: Event) => {
      const clicked = e.target;
      if (clicked instanceof HTMLElement) {
        if (clicked.getAttribute('type') === 'search') {
          return setShowSuggestions(true);
        }
        setShowSuggestions(false);
      }
    };
    document.body.addEventListener('click', show);
    return () => {
      document.body.removeEventListener('click', show);
    };
  }, []);

  return (
    <div
      className={
        suggestions.length > 0 && showSuggestions
          ? 'search-wrapper search-wrapper--expanded'
          : 'search-wrapper'
      }
    >
      {children}
      {suggestions.length > 0 && showSuggestions && (
        <div className='search-wrapper-suggestions'>{renderFunction(suggestions)}</div>
      )}
    </div>
  );
};
