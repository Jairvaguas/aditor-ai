'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SubscribeButton() {
    const [isLoading, setIsLoading] = useState(false);
    const { userId } = useAuth();
    const router = useRouter();

    const handleSubscribe = async () => {
        if (!userId) {
            // Si no está registrado, mandarlo al registro (o login) para que se cree la cuenta primero
            router.push('/registro?redirect_url=/subscribe');
            return;
        }

        try {
            setIsLoading(true);
            const res = await fetch('/api/payments/create-subscription', {
                method: 'POST',
            });
            const data = await res.json();

            if (data?.init_point) {
                window.location.href = data.init_point;
            } else {
                console.error('No init_point received');
            }
        } catch (error) {
            console.error('Subscription error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {isLoading ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                </span>
            ) : (
                'Comenzar Suscripción ($185.000 COP/mes)'
            )}
        </button>
    );
}
