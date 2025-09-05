'use client';

import { Provider } from 'react-redux';
import { makeStore } from './store';


interface ProvidersProps {
    children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return <Provider store={makeStore()}>{children}</Provider>;
};