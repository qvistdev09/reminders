import { useLiveEdit } from '../../../../hooks/use-live-edit';

export type TaskActions = Pick<ReturnType<typeof useLiveEdit>, 'taskActions'>['taskActions'];
