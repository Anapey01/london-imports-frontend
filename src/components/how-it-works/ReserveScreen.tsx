import React, { useState, useEffect } from 'react';
import { sounds } from '@/lib/sounds';

interface ReserveScreenProps {
    activeStep: number;
}

export const ReserveScreen: React.FC<ReserveScreenProps> = ({ activeStep }) => {
    const [phase, setPhase] = useState<'input' | 'processing' | 'success'>('input');
    const [phoneNumber, setPhoneNumber] = useState('');
    const phoneQuery = '024 XXX 1234';

    useEffect(() => {
        if (activeStep === 1) {
            setPhase('input');
            setPhoneNumber('');
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < phoneQuery.length) {
                    setPhoneNumber(phoneQuery.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(() => setPhase('processing'), 500);
                    setTimeout(() => {
                        setPhase('success');
                        sounds.success();
                    }, 2000);
                }
            }, 80);
            return () => clearInterval(typeInterval);
        }
    }, [activeStep]);

    if (phase === 'success') {
        return (
            <div key="reserve-success" className="h-full rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-white text-gray-900">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-scale-in bg-green-100">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="text-sm font-bold mb-1 text-gray-900">Payment Successful!</div>
                <div className="text-xs mb-3 text-gray-500">GHS 150 received</div>
                <div className="rounded-xl p-3 w-full bg-gray-100">
                    <div className="text-xs mb-1 text-gray-500">Order Reference</div>
                    <div className="text-sm font-bold text-rose-500">#LI-2024-0847</div>
                </div>
            </div>
        );
    }

    if (phase === 'processing') {
        return (
            <div key="reserve-processing" className="h-full rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-white text-gray-900">
                <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4 border-rose-200 border-t-rose-500"></div>
                <div className="text-sm font-bold mb-1 text-gray-900">Processing Payment...</div>
                <div className="text-xs text-gray-500">Waiting for MoMo confirmation</div>
            </div>
        );
    }

    return (
        <div key="reserve" className="h-full rounded-2xl p-4 flex flex-col bg-white text-gray-900">
            <div className="text-center mb-3">
                <div className="text-sm font-bold text-gray-900">Mobile Money Payment</div>
                <div className="text-xs text-gray-500">Deposit: GHS 150</div>
            </div>

            <div className="rounded-xl p-3 mb-3 flex items-center gap-3 bg-yellow-50">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs bg-yellow-400">MTN</div>
                <div className="flex-1">
                    <div className="text-xs text-gray-500">Phone Number</div>
                    <div className="text-sm font-bold flex items-center text-gray-900">
                        {phoneNumber}
                        <span className="inline-block w-0.5 h-4 ml-0.5 animate-pulse bg-pink-500"></span>
                    </div>
                </div>
            </div>

            <div className="rounded-xl p-3 mb-3 bg-gray-50">
                <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">Item</span>
                    <span className="text-gray-900">iPhone 15 Pro Max</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Deposit</span>
                    <span className="font-bold text-pink-500">GHS 150</span>
                </div>
            </div>

            <div className="mt-auto rounded-xl py-2.5 text-center bg-gradient-to-r from-yellow-400 to-yellow-500">
                <span className="text-xs font-bold text-white">Pay with MoMo →</span>
            </div>
        </div>
    );
};
