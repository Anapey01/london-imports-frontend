import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from '@storybook/test';
import VariantDropdown from './VariantDropdown';

const meta = {
    title: 'Components/VariantDropdown',
    component: VariantDropdown,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    // Use `fn` to spy on the onSelect arg
    args: {
        onSelect: fn()
    },
} satisfies Meta<typeof VariantDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: 'Size',
        options: ['Small', 'Medium', 'Large'],
        selected: '',
    },
};

export const Selected: Story = {
    args: {
        label: 'Size',
        options: ['Small', 'Medium', 'Large'],
        selected: 'Medium',
    },
};

export const ColorVariant: Story = {
    args: {
        label: 'Color',
        options: ['Red', 'Blue', 'Green'],
        selected: 'Red',
    },
};
