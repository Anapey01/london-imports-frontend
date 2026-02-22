import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MegaMenu from '../components/MegaMenu';

const meta: Meta<typeof MegaMenu> = {
    title: 'Components/MegaMenu',
    component: MegaMenu,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story: React.ComponentType) => (
            <div className="p-20 bg-slate-900 min-h-screen relative">
                <div className="max-w-7xl mx-auto relative h-20 bg-white shadow-md rounded-t-2xl flex items-center px-8 border-b border-gray-100 z-50">
                    <span className="font-black text-pink-600 mr-2">LONDON&apos;S</span>
                    <span className="font-bold text-gray-800">IMPORTS</span>
                    <div className="ml-12 px-4 py-2 bg-pink-50 text-pink-600 text-[10px] font-black uppercase rounded-full cursor-pointer hover:bg-pink-100 transition-colors">
                        Categories
                    </div>
                    {/* DROP DOWN CONTAINER */}
                    <div className="absolute top-full left-0 opacity-100 visible z-50">
                        <div className="pt-1">
                            <Story />
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-slate-400 text-sm">
                    Mock Background Content - The MegaMenu overlaps this area.
                </div>
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof MegaMenu>;

export const DesktopView: Story = {};
