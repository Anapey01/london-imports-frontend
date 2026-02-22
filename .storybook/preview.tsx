import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/app/globals.css';
import { ThemeProvider } from '../src/providers/ThemeProvider';
import QueryProvider from '../src/providers/QueryProvider';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: 'fullscreen',
        a11y: {
            test: 'todo'
        }
    },
    decorators: [
        (Story) => (
            <ThemeProvider>
                <QueryProvider>
                    <Story />
                </QueryProvider>
            </ThemeProvider>
        ),
    ],
};

export default preview;
