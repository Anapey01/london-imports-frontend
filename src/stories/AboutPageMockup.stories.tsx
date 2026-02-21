import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AboutPageMockup } from './AboutPageMockup';

/**
 * 🏢 London's Imports - About Page Mockup
 * A high-fidelity preview of the redesigned About section.
 */
const meta: Meta<typeof AboutPageMockup> = {
    title: 'Pages/About Mockup',
    component: AboutPageMockup,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};
