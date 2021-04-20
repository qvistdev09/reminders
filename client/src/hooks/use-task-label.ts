import { useState } from 'react';

const useTaskLabel = (taskLabel: string) => {
  const [inEdit, setInEdit] = useState(false);
  const [input, setInput] = useState(taskLabel);

  const turnEdit = {
    on: () => setInEdit(true),
    off: () => setInEdit(false),
  };

  return {
    inEdit,
    turnEdit,
    input,
    setInput,
  };
};

export { useTaskLabel };
