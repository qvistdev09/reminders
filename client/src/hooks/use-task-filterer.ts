import { useState } from 'react';
import { TaskLiveModel } from 'reminders-shared/sharedTypes';

const filterTasks = (tasks: TaskLiveModel[], finished: boolean) =>
  tasks.filter(task => task.taskFinished === finished);

enum Filters {
  all = 'All tasks',
  finished = 'Finished tasks',
  remaining = 'Remaining tasks',
}

const useTaskFilterer = (tasks: TaskLiveModel[]) => {
  const [index, setIndex] = useState<number>(0);
  const filters = [Filters.all, Filters.remaining, Filters.finished];
  const currentFilter = filters[index];

  const nextFilter = () => {
    if (index >= filters.length - 1) {
      return setIndex(0);
    }
    setIndex(index + 1);
  };

  const filteredTasks =
    currentFilter === Filters.all
      ? tasks
      : currentFilter === Filters.finished
      ? filterTasks(tasks, true)
      : filterTasks(tasks, false);

  return {
    nextFilter,
    filteredTasks,
    currentFilter,
  };
};

export { useTaskFilterer };
