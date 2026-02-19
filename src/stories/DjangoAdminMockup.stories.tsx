import type { Meta, StoryObj } from '@storybook/react';
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
