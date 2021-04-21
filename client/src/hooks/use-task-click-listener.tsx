import { useEffect } from 'react';
import { TaskActions } from '../@types/src/components/project-page/task';

type StopUserEdit = Pick<TaskActions, 'stopUserEdit'>['stopUserEdit'];

const useTaskClickListener = (stopUserEdit: StopUserEdit, projectId: number) => {
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const { target } = e;
      if (target instanceof HTMLElement) {
        if (target.classList.contains('task__input') || target.classList.contains('task__label-btn')) {
          return;
        }
        stopUserEdit({ projectId });
      }
    };

    document.body.addEventListener('click', click);

    return () => {
      document.body.removeEventListener('click', click);
    };
  }, [projectId, stopUserEdit]);
};

export { useTaskClickListener };
