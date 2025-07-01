export interface OdjelOdgovorDTO {
    sifra: number,
    nazivOdjela: string,
    lokacijaOdjela: string,
    tvrtkaSifra: number | null
}

export interface OdjelDTO {
    nazivOdjela: string,
    lokacijaOdjela: string,
    aktivan: boolean,
    tvrtkaSifra: number | null
}