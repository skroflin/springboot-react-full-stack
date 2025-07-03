export interface OdjelOdgovorDTO {
    sifra: number,
    nazivOdjela: string,
    lokacijaOdjela: string,
    jeAktivan: boolean,
    tvrtkaSifra: number | null
}

export interface OdjelDTO {
    nazivOdjela: string,
    lokacijaOdjela: string,
    jeAktivan: boolean,
    tvrtkaSifra: number | null
}