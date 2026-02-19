import type { Meta, StoryObj } from '@storybook/react';
import { InnovationMockups } from './InnovationMockups';

const meta: Meta<typeof InnovationMockups> = {
    title: 'Innovation/InnovationMockups',
    component: InnovationMockups,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof InnovationMockups>;

export const Demo: Story = {};
