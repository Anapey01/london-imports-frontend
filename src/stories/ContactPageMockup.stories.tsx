import { Meta, StoryObj } from '@storybook/nextjs';
import ContactPageMockup from './ContactPageMockup';

const meta: Meta<typeof ContactPageMockup> = {
    title: 'Pages/ContactPageMockup',
    component: ContactPageMockup,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof ContactPageMockup>;

export const Default: Story = {};
