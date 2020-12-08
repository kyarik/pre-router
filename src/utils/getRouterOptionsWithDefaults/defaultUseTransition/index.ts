import { UseTransition } from '../../../types';

const startTransition = (callback: () => void) => {
  callback();
};

const isPending = false;

export const defaultUseTransition: UseTransition = () => [startTransition, isPending];
