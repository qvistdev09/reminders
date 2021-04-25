import { ReactNode, useState } from 'react';
import { ContainerBase } from './containers-props';

interface Props extends ContainerBase {
  headerObj: ReactNode;
  buttonExpanded: ReactNode;
  button: ReactNode;
  enabled?: boolean;
  alternativeHeaderObj?: ReactNode | null;
}

export const ExpandableCard = ({
  children,
  headerObj,
  flex = 0,
  button,
  buttonExpanded,
  enabled = true,
  alternativeHeaderObj,
}: Props) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    setExpanded(!expanded);
  };

  const headerClassBase = 'containers__expandable-card-header';

  const headerClassname = expanded ? `${headerClassBase} ${headerClassBase}--expanded` : headerClassBase;

  return (
    <div className='containers__card' style={{ flex }}>
      <div className={headerClassname}>
        <div className='containers__expandable-card-headerobj'>{headerObj}</div>
        {enabled && (
          <button onClick={() => toggle()} className='containers__expandable-card-btn'>
            {expanded ? buttonExpanded : button}
          </button>
        )}
        {!enabled && alternativeHeaderObj}
      </div>
      {expanded && <div className='containers__card-content'>{children}</div>}
    </div>
  );
};
