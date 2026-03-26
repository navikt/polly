# Polly – Domenemodell

**Opprettet:** 26. mars 2026

## Slik åpner du filen

**Mac (VS Code):**

1. Åpne filen i VS Code
2. Trykk `Cmd+Shift+X` → søk etter `Markdown Preview Mermaid Support` og installer den
3. Trykk `Cmd+Shift+V` for forhåndsvisning, eller `Cmd+K V` for å åpne den ved siden av koden

**Windows (VS Code):**

1. Åpne filen i VS Code
2. Trykk `Ctrl+Shift+X` → søk etter `Markdown Preview Mermaid Support` og installer den
3. Trykk `Ctrl+Shift+V` for forhåndsvisning, eller `Ctrl+K V` for å åpne den ved siden av koden

---

## Ordboka (Frontend-navn → Backend-navn)

| Frontend (norsk)                    | Backend (engelsk)      |
| ----------------------------------- | ---------------------- |
| Behandling                          | Process                |
| Behandlingsdata                     | ProcessData            |
| Behandlingsstatus                   | ProcessStatus          |
| Behandlingsansvarlig                | DataProcessing         |
| Opplysningstype                     | InformationType        |
| Opplysningstype-kobling             | Policy                 |
| Personkategori                      | SubjectCategory        |
| Rettslig grunnlag                   | LegalBasis             |
| Databehandler                       | Processor              |
| Utlevering                          | Disclosure             |
| Dokument                            | Document               |
| Varslingshendelse                   | AlertEvent             |
| Kodeverk                            | Codelist               |
| Lagringstid                         | Retention              |
| PVK (Personvernkonsekvensvurdering) | Dpia                   |
| Kunstig intelligens                 | AiUsageDescription     |
| Organisering                        | Affiliation            |
| Formål                              | Purpose (via Codelist) |

---

## Domenemodell

```mermaid
classDiagram
    class Behandling["Behandling (Process)"] {
        UUID id
        BehandlingsData data
        List~OpplysningKobling~ opplysninger
    }
    class BehandlingsData["BehandlingsData (ProcessData)"] {
        String navn
        int nummer
        Behandlingsstatus status
        List~String~ formål
        List~RettsligGrunnlag~ rettsligeGrunnlag
        Organisering organisering
        PVK pvk
        Lagringstid lagringstid
        Databehandlere databehandlere
        KunnstigIntelligens ki
    }
    class OpplysningKobling["OpplysningKobling (Policy)"] {
        UUID id
        KoblingData data
        String opplysningsnavn
    }
    class KoblingData["KoblingData (PolicyData)"] {
        List~String~ personkategorier
        List~RettsligGrunnlag~ rettsligeGrunnlag
    }
    class Opplysningstype["Opplysningstype (InformationType)"] {
        UUID id
        OpplysningstypeData data
    }
    class RettsligGrunnlag["RettsligGrunnlag (LegalBasis)"] {
        String gdprArtikkel
        String nasjonal_lov
        String beskrivelse
    }
    class Databehandler["Databehandler (Processor)"] {
        UUID id
        DatabehandlerData data
    }
    class DatabehandlerData["DatabehandlerData (ProcessorData)"] {
        String navn
        String kontrakt
        Boolean utenforEU
        List~String~ land
    }
    class Utlevering["Utlevering (Disclosure)"] {
        UUID id
        UtveleringsData data
    }
    class UtveleringsData["UtveleringsData (DisclosureData)"] {
        String mottaker
        List~RettsligGrunnlag~ rettsligeGrunnlag
        List~UUID~ behandlingsIder
    }
    class Dokument["Dokument (Document)"] {
        UUID id
        DokumentData data
    }
    class Varslingshendelse["Varslingshendelse (AlertEvent)"] {
        VarslingType type
        VarslingNivå nivå
        UUID behandlingsId
    }
    class Kodeverk["Kodeverk (Codelist)"] {
        ListeNavn liste
        String kode
        String kortnavn
        String beskrivelse
    }

    Behandling "1" *-- "1" BehandlingsData
    Behandling "1" o-- "N" OpplysningKobling
    BehandlingsData "1" *-- "N" RettsligGrunnlag
    BehandlingsData "1" *-- "1" Databehandlere
    Databehandlere --> Databehandler : refererer til
    OpplysningKobling "1" *-- "1" KoblingData
    KoblingData "N" --> "1" Opplysningstype : opplysningsnavn
    KoblingData "1" *-- "N" RettsligGrunnlag
    Utlevering --> Behandling : refererer til
    Utlevering --> Opplysningstype : refererer til
    Utlevering --> Dokument : refererer til
    Behandling --> Dokument : refererer til
    Varslingshendelse --> Behandling : knyttet til
    Varslingshendelse --> OpplysningKobling : knyttet til
    Kodeverk <.. BehandlingsData : kodeoppslag
    Kodeverk <.. KoblingData : kodeoppslag
```
