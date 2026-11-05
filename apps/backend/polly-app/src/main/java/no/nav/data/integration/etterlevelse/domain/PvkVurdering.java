package no.nav.data.integration.etterlevelse.domain;

public enum PvkVurdering {
    SKAL_IKKE_UTFORE,
    SKAL_UTFORE,
    ALLEREDE_UTFORT,
    LEGGE_OVER_EKSISTERENDE,

    //Brukes for å nullstille feltet på frontend
    UNDEFINED
}
