import { useEffect } from 'react';
import { TaskActions } from '../@types/src/components/project-page/task';

type StopUserEdit = Pick<TaskActions, 'stopUserEdit'>['stopUserEdit'];

const useTaskClickListener = (stopUserEdit: StopUserEdit) => {
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const { target } = e;
      if (target instanceof HTMLElement) {
        if (target.classList.contains('inputs__text-input') || target.classList.contains('button__task-title')) {
          return;
        }
        stopUserEdit();
      }
    };

    document.body.addEventListener('click', click);

    return () => {
      document.body.removeEventListener('click', click);
    };
  }, [stopUserEdit]);
};

export { useTaskClickListener };
