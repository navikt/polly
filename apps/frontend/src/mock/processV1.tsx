const behandlingsgrunnlag =  [
    {opplysningstypeTitle: 'Fødselsdato', personkategori: 'Barn', rettsligGrunnlag: 'ftrl. kapittel 21, §8-2, § 8-8 kap 2, §21-3, §8-53'},
    {opplysningstypeTitle: 'Fødselsdato', personkategori: 'Bruker', rettsligGrunnlag: 'ftrl. § 8-49'},
    {opplysningstypeTitle: 'Inntekt', personkategori: 'Bruker', rettsligGrunnlag: 'ftrl.§8'},
    {opplysningstypeTitle: 'Sivilstand', personkategori: 'Bruker', rettsligGrunnlag: 'ftrl. § 8-49'},
    {opplysningstypeTitle: 'Arbeidsforhold', personkategori: 'Bruker', rettsligGrunnlag: 'ftrl. § 8-49'},
    {opplysningstypeTitle: 'Verneplikt', personkategori: 'Bruker', rettsligGrunnlag: 'ftrl.§8'}
]

export default {
    "Statistikk": {
        description: 'En beskrivelse av statistikk.',
        behandlinger: [
            {
                title: 'Arbeidsmarkedsstatistikk', 
                policies: behandlingsgrunnlag
            },
            {
                title: 'Virksomhetsstigning',
                policies: behandlingsgrunnlag
            }
        ]
    },
    "Foreldrepenger": {
        description: 'En beskrivelse av foreldrepenger.',
        behandlinger: [
            {
                title: 'Saksbehandling', 
                policies: behandlingsgrunnlag
            }
        ]
    },
}