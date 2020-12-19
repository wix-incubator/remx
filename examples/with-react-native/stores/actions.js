import { store } from './store';

export const incCount = () => (
    store.incCount()
);

export const decCount = () => (
    store.decCount()
);