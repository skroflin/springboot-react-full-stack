export interface DjelatnikOdgovorDTO {
    sifra: number,
    imeDjelatnika: string,
    prezimeDjelatnika: string,
    placaDjelatnika: number,
    pocetakRada: string,
    datumRodenja: string,
    jeZaposlen: boolean,
    odjelSifra: number | null,
    tvrtkaSifra: number | null
}

export interface DjelatnikDTO {
    imeDjelatnika: string,
    prezimeDjelatnika: string,
    placaDjelatnika: number,
    pocetakRada: string,
    datumRodenja: string,
    jeZaposlen: boolean,
    odjelSifra: number | null,
    tvrtkaSifra: number | null
}

export interface PlacaOdgovorDTO {
    sifraDjelatnika: number;
    brutoPlaca: string;
    mirovinsko1Stup: string;
    mirovinsko2Stup: string;
    zdravstvenoOsiguranje: string;
    poreznaOsnovica: string;
    ukupniPorezPrirezi: string;
    netoPlaca: string;
}