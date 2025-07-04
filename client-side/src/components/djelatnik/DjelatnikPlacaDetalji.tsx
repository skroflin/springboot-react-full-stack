import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUser, FaBriefcase, FaBuilding, FaBirthdayCake, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaCity } from 'react-icons/fa';
import { format } from 'date-fns';
import { hr } from 'date-fns/locale';

import type { DjelatnikOdgovorDTO } from '../../types/Djelatnik';

interface DjelatnikPlacaDetaljiProps {
    selectedDjelatnik: DjelatnikOdgovorDTO | null;
    placaData: {
        sifraDjelatnika: number;
        brutoPlaca: number;
        mirovinsko1Stup: number;
        mirovinsko2Stup: number;
        zdravstvenoOsiguranje: number;
        poreznaOsnovica: number;
        ukupniPorezPrirezi: number;
        netoPlaca: number;
    } | null;
    tvrtkaMap: Map<number, string>;
    odjelMap: Map<number, string>;
}

export function DjelatnikPlacaDetalji({ selectedDjelatnik, placaData, tvrtkaMap, odjelMap }: DjelatnikPlacaDetaljiProps) {
    if (!selectedDjelatnik) {
        return (
            <p className="text-gray-600 italic">Odaberite djelatnika s popisa da vidite detalje plaće i grafikon.</p>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Plaća za: {selectedDjelatnik.imeDjelatnika} {selectedDjelatnik.prezimeDjelatnika}
            </h3>
            {placaData ? (
                <div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={[
                                { name: 'Bruto plaća', value: placaData.brutoPlaca },
                                { name: 'Neto plaća', value: placaData.netoPlaca },
                                { name: 'Mirovinsko 1', value: placaData.mirovinsko1Stup },
                                { name: 'Mirovinsko 2', value: placaData.mirovinsko2Stup },
                                { name: 'Zdravstveno', value: placaData.zdravstvenoOsiguranje },
                                { name: 'Porez i Prirezi', value: placaData.ukupniPorezPrirezi }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `${value.toFixed(2)} EUR`} />
                            <Legend />
                            <Bar dataKey="value" fill="#60A5FA" />
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-md text-gray-700 mb-1">
                            <span className="font-semibold">Bruto plaća:</span> {placaData.brutoPlaca.toFixed(2)} EUR
                        </p>
                        <p className="text-md text-gray-700 mb-1">
                            <span className="font-semibold">Neto plaća:</span> {placaData.netoPlaca.toFixed(2)} EUR
                        </p>
                        <hr className="my-3 border-gray-200" />
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Mirovinsko I. stup:</span> {placaData.mirovinsko1Stup.toFixed(2)} EUR
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Mirovinsko II. stup:</span> {placaData.mirovinsko2Stup.toFixed(2)} EUR
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Zdravstveno osiguranje:</span> {placaData.zdravstvenoOsiguranje.toFixed(2)} EUR
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Ukupni porez i prirezi:</span> {placaData.ukupniPorezPrirezi.toFixed(2)} EUR
                        </p>
                        <hr className="my-3 border-gray-200" />
                        <p className="text-md text-gray-700 font-semibold">
                            Ukupni odbici: {(placaData.mirovinsko1Stup + placaData.mirovinsko2Stup + placaData.zdravstvenoOsiguranje + placaData.ukupniPorezPrirezi).toFixed(2)} EUR
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 italic">Učitavanje podataka o plaći...</p>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Podaci o djelatniku:</h4>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                    <FaUser className="mr-2 text-gray-500" />
                    <span className="font-semibold mr-1">Ime i Prezime:</span> {selectedDjelatnik.imeDjelatnika} {selectedDjelatnik.prezimeDjelatnika}
                </p>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                    <FaBriefcase className="mr-2 text-blue-500" />
                    <span className="font-semibold mr-1">Plaća djelatnika:</span> {selectedDjelatnik.placaDjelatnika.toFixed(2)} EUR
                </p>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                    <FaBuilding className="mr-2 text-purple-500" />
                    <span className="font-semibold mr-1">Odjel:</span> {
                        selectedDjelatnik.odjelSifra !== null
                            ? odjelMap.get(selectedDjelatnik.odjelSifra) || 'Nije dodijeljeno'
                            : 'Nije dodijeljeno'
                    }
                </p>
                <p className="text-md text-gray-700 mb-1 flex items-center">
                    <FaCity className="mr-2 text-red-500" />
                    <span className="font-semibold mr-1">Tvrtka:</span> {
                        selectedDjelatnik.tvrtkaSifra !== null
                            ? tvrtkaMap.get(selectedDjelatnik.tvrtkaSifra) || 'Nije dodijeljeno'
                            : 'Nije dodijeljeno'
                    }
                </p>
                {selectedDjelatnik.datumRodenja && (
                    <p className="text-md text-gray-700 mb-1 flex items-center">
                        <FaBirthdayCake className="mr-2 text-pink-500" />
                        <span className="font-semibold mr-1">Datum rođenja:</span> {
                            format(new Date(selectedDjelatnik.datumRodenja), 'dd.MM.yyyy', { locale: hr })
                        }
                    </p>
                )}
                <p className="text-md text-gray-700 mb-1 flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-500" />
                    <span className="font-semibold mr-1">Početak rada:</span> {
                        format(new Date(selectedDjelatnik.pocetakRada), 'dd.MM.yyyy', { locale: hr })
                    }
                </p>
                <p className={`text-md text-gray-700 flex items-center ${selectedDjelatnik.jeZaposlen ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedDjelatnik.jeZaposlen ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
                    <span className="font-semibold mr-1">Status zaposlenja:</span> {selectedDjelatnik.jeZaposlen ? 'Zaposlen' : 'Nije zaposlen'}
                </p>
            </div>
        </div>
    );
}