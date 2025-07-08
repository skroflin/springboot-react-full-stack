import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { DjelatnikOdgovorDTO } from '../../types/Djelatnik';

interface DjelatnikBrisanjeModalProps {
    show: boolean;
    onClose: () => void;
    djelatnik: DjelatnikOdgovorDTO | null;
    authToken: string;
    onSuccess: () => void;
}

export function DjelatnikBrisanjeModal({ show, onClose, djelatnik, authToken, onSuccess }: DjelatnikBrisanjeModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    if (!show || !djelatnik) {
        return null;
    }

    const handleHardDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            const headers = { Authorization: `Bearer ${authToken}` };
            await axios.delete(`http://localhost:8080/api/skroflin/djelatnik/delete?sifra=${djelatnik.sifra}`, { headers });

            toast.success(`Djelatnik ${djelatnik.imeDjelatnika} ${djelatnik.prezimeDjelatnika} trajno obrisan.`);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Greška pri trajnom brisanju djelatnika:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Došlo je do greške pri trajnom brisanju djelatnika.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Potvrdite Trajno Brisanje</h3>
                <p className="text-gray-700 text-center mb-6">
                    Jeste li sigurni da želite trajno obrisati djelatnika <strong className="font-bold">{djelatnik.imeDjelatnika} {djelatnik.prezimeDjelatnika}</strong>?
                    Ova radnja je nepovratna i djelatnik će biti potpuno uklonjen iz sustava.
                </p>

                {error && (
                    <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
                        disabled={loading}
                    >
                        Odustani
                    </button>
                    <button
                        type="button"
                        onClick={handleHardDelete}
                        className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        ) : (
                            'Obriši Trajno'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}