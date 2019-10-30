const behandlingsgrunnlag =  [
    {id: 1, opplysningstypeTitle: 'Fødselsdato'},
    {id: 3, opplysningstypeTitle: 'Inntekt'},
    {id: 4, opplysningstypeTitle: 'Sivilstand'},
    {id: 5, opplysningstypeTitle: 'Arbeidsforhold'},
    {id: 6, opplysningstypeTitle: 'Verneplikt'}
]

const rettslig_grunnlag = ['ftrl. kapittel 21, §8-2, § 8-8 kap 2, §21-3, §8-53', 'ftrl. § 8-49, ftrl.§8']

export default {
    "Statistikk": {
        description: 'En beskrivelse av statistikk.',
        behandlinger: [
            {
                title: 'Arbeidsmarkedsstatistikk', 
                rettsligGrunnlag: rettslig_grunnlag,
                personkategorier: 'Barn, Bruker',
                opplysningstyper: behandlingsgrunnlag
            },
            {
                title: 'Virksomhetsstigning',
                rettsligGrunnlag: rettslig_grunnlag,
                personkategorier: 'Barn, Bruker',
                opplysningstyper: behandlingsgrunnlag
            }
        ]
    },
    "Foreldrepenger": {
        description: 'En beskrivelse av foreldrepenger.',
        behandlinger: [
            {
                title: 'Saksbehandling',
                rettsligGrunnlag: rettslig_grunnlag,
                personkategorier: 'Barn, Bruker',
                opplysningstyper: behandlingsgrunnlag
            }
        ]
    },
}