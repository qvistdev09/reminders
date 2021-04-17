import { useState, useEffect } from 'react';

interface Props {
  suggestions: any[];
  render: any;
  children: React.ReactNode;
}

const FormSearchWrapper = ({ suggestions, render, children }: Props) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const show = (e: Event) => {
      const clicked = e.target;
      if (clicked instanceof HTMLElement) {
        if (clicked.classList.contains('form__input')) {
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
          ? 'form__search-wrapper form__search-wrapper--expanded'
          : 'form__search-wrapper'
      }
    >
      {children}
      {suggestions.length > 0 && showSuggestions && (
        <div className='form__search-wrapper-suggestions'>{render(suggestions)}</div>
      )}
    </div>
  );
};
export default FormSearchWrapper;
