import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GroupBuyProgress } from './GroupBuyProgress';

const meta: Meta<typeof GroupBuyProgress> = {
    title: 'Components/GroupBuyProgress',
    component: GroupBuyProgress,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GroupBuyProgress>;

export const Initial: Story = {
    args: {
        current: 0,
        target: 100,
    },
};

export const InProgress: Story = {
    args: {
        current: 12,
        target: 100,
    },
};

export const NearingCompletion: Story = {
    args: {
        current: 85,
        target: 100,
    },
};

export const Completed: Story = {
    args: {
        current: 100,
        target: 100,
    },
};

export const Detailed: Story = {
    args: {
        current: 15,
        target: 100,
        variant: 'detailed',
    },
};
