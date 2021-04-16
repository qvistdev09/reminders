interface Props {
  suggestions: any[];
  render: any;
  children: React.ReactNode;
}

const FormSearchWrapper = ({ suggestions, render, children }: Props) => (
  <div
    className={
      suggestions.length > 0
        ? 'form__search-wrapper form__search-wrapper--expanded'
        : 'form__search-wrapper'
    }
  >
    {children}
    {suggestions.length > 0 && (
      <div className='form__search-wrapper-suggestions'>{render(suggestions)}</div>
    )}
  </div>
);
export default FormSearchWrapper;
