import type { Meta, StoryObj } from '@storybook/react';
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
        target: 20,
    },
};

export const InProgress: Story = {
    args: {
        current: 12,
        target: 20,
    },
};

export const NearingCompletion: Story = {
    args: {
        current: 18,
        target: 20,
    },
};

export const Completed: Story = {
    args: {
        current: 20,
        target: 20,
    },
};

export const Detailed: Story = {
    args: {
        current: 15,
        target: 50,
        variant: 'detailed',
    },
};
