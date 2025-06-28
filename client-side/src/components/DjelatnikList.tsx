import React, { useState, useEffect } from "react";
import type { DjelatnikOdgovorDTO } from "../types/Djelatnik";

export function DjelatnikList() {
    const [djelatnici, setDjelatnici] = useState<DjelatnikOdgovorDTO[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDjelatnici = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch('/api/skroflin/djelatnik/get', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(`Http greška: ${response.json}`)
                }

                const data: DjelatnikOdgovorDTO[] = await response.json()
                setDjelatnici(data)
            } catch (err) {
                console.error("Greška pri dohvatu djelatnika:", err)
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Nepoznata greška pri dohvatu djelatnika!")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchDjelatnici()
    }, [])

    if (loading) {
        return <div className="text-center p-4">
            Učitavanje djelatnika...
        </div>
    }

    if (error) {
        return <div className="text-center p-4 text-red-600">
            Greška: {error}
        </div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Popis djelatnika
            </h1>
            {djelatnici.length === 0 ? (
                <p className="text-gray-600">
                    Nema pronađenih djelatnika
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Šifra</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ime</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Prezime</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Plaća</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Rođenje</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Početak rada</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Zaposlen</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Odjel</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tvrtka</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {djelatnici.map((djelatnik) => (
                                <tr key={djelatnik.sifra} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.sifra}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.imeDjelatnika}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.prezimeDjelatnika}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.placaDjelatnika}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.datumRodenja}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.pocetakRada}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.jeZaposlen}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.odjelSifra}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">{djelatnik.tvrtkaSifra}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}