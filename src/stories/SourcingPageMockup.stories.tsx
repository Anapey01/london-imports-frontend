import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SourcingPageMockup } from './SourcingPageMockup';

const meta: Meta<typeof SourcingPageMockup> = {
    title: 'Pages/AI Sourcing',
    component: SourcingPageMockup,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof SourcingPageMockup>;

export const Demo: Story = {};
