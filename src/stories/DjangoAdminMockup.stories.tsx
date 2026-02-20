import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DjangoAdminMockup } from './DjangoAdminMockup';

const meta: Meta<typeof DjangoAdminMockup> = {
    title: 'Admin/DjangoAdminMockup',
    component: DjangoAdminMockup,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof DjangoAdminMockup>;

export const SimplifiedLayout: Story = {};
