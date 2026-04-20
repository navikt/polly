# Polly – Domenemodell

**Sist oppdatert:** 20. april 2026

## Innholdsfortegnelse

- [Slik åpner du filen](#slik-åpner-du-filen)
- [Ordboka (Frontend-navn → Backend-navn)](#ordboka-frontend-navn--backend-navn)
- [Domenemodell](#domenemodell)
- [Sekvensdiagrammer](#sekvensdiagrammer)
  - [1. Laste inn en behandlingsside](#1-laste-inn-en-behandlingsside)
  - [2. Eksportere behandling til DOCX](#2-eksportere-behandling-til-docx)
  - [3. Opprette en behandling (skriveflyt)](#3-opprette-en-behandling-skriveflyt)
  - [4. Varselgenerering (hva skjer bak kulissene)](#4-varselgenerering-hva-skjer-bak-kulissene)
- [Systemarkitektur](#systemarkitektur)

---

## Slik åpner du filen

**Mac (VS Code):**

1. Åpne filen i VS Code.
2. Trykk `Cmd+Shift+X` → søk etter `Markdown Preview Mermaid Support` og installer den.
3. For å forhåndsvise ordboka og mermaid-diagram, trykk `Cmd+Shift+V`.

**Windows (VS Code):**

1. Åpne filen i VS Code
2. Trykk `Ctrl+Shift+X` → søk etter `Markdown Preview Mermaid Support` og installer den.
3. For å forhåndsvise ordboka og mermaid-diagram, trykk `Ctrl+Shift+V`.

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
| Nav som databehandler               | DpProcess              |
| Nav som databehandler data          | DpProcessData          |

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
    class NavSomDatabehandler["Nav som databehandler (DpProcess)"] {
        UUID id
        NavSomDatabehandlerData data
    }
    class NavSomDatabehandlerData["Nav som databehandler data (DpProcessData)"] {
        String navn
        int dpProsessNummer
        Organisering organisering
        String eksternBehandlingsansvarlig
        LocalDate start
        LocalDate slutt
        List~String~ databehandleravtaler
        Databehandlere underdatabehandling
        String formålsbeskrivelse
        String beskrivelse
        Boolean art9
        Boolean art10
        DpLagringstid lagringstid
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
    NavSomDatabehandler "1" *-- "1" NavSomDatabehandlerData
    NavSomDatabehandlerData "1" *-- "1" Databehandlere
    Databehandlere --> Databehandler : refererer til
    Kodeverk <.. NavSomDatabehandlerData : kodeoppslag
```

---

## Sekvensdiagrammer

### 1. Laste inn en behandlingsside

```mermaid
sequenceDiagram
    actor Bruker
    participant Frontend
    participant ProcessController
    participant PolicyController
    participant AlertController
    participant DB as PostgreSQL

    Bruker->>Frontend: Åpner behandlingsside
    Frontend->>ProcessController: GET /process/{id}
    ProcessController->>DB: SELECT * FROM process WHERE id=?
    DB-->>ProcessController: Process + ProcessData
    ProcessController-->>Frontend: ProcessResponse

    Frontend->>PolicyController: GET /policy?processId={id}
    PolicyController->>DB: SELECT * FROM policy WHERE process_id=?
    DB-->>PolicyController: List<Policy>
    PolicyController-->>Frontend: List<PolicyResponse>

    Frontend->>AlertController: GET /alert/process/{id}
    AlertController->>DB: SELECT * FROM generic_storage WHERE type=ALERT
    DB-->>AlertController: List<AlertEvent>
    AlertController-->>Frontend: ProcessAlert

    Frontend-->>Bruker: Viser behandling med opplysningstyper og varsler
```

---

### 2. Eksportere behandling til DOCX

```mermaid
sequenceDiagram
    actor Bruker
    participant Frontend
    participant ExportController
    participant ProcessToDocx
    participant ProcessRepository
    participant ProcessorRepository
    participant AlertService

    Bruker->>Frontend: Klikker "Last ned DOCX"
    Frontend->>ExportController: GET /export/process?list=PURPOSE&code=XYZ
    ExportController->>ProcessRepository: findByPurpose("XYZ")
    ProcessRepository-->>ExportController: List<Process>
    ExportController->>ProcessToDocx: generateDocFor(PURPOSE, "XYZ", INTERNAL)
    ProcessToDocx->>ProcessorRepository: findAllById(processorIds)
    ProcessorRepository-->>ProcessToDocx: List<Processor>
    ProcessToDocx->>AlertService: checkAlertsForProcess(process)
    AlertService-->>ProcessToDocx: ProcessAlert
    ProcessToDocx-->>ExportController: byte[] (DOCX)
    ExportController-->>Frontend: application/octet-stream
    Frontend-->>Bruker: Laster ned .docx-fil
```

---

### 3. Opprette en behandling (skriveflyt)

```mermaid
sequenceDiagram
    actor Bruker
    participant Frontend
    participant ProcessWriteController
    participant ProcessRequestValidator
    participant ProcessService
    participant AlertService
    participant DB as PostgreSQL

    Bruker->>Frontend: Fyller ut og lagrer behandling
    Frontend->>ProcessWriteController: POST /process
    ProcessWriteController->>ProcessRequestValidator: validate(request)
    ProcessRequestValidator-->>ProcessWriteController: OK / ValidationException
    ProcessWriteController->>ProcessService: save(process)
    ProcessService->>DB: INSERT INTO process
    DB-->>ProcessService: Process
    ProcessService->>AlertService: updateAlerts(process)
    AlertService->>DB: UPSERT alert_events
    ProcessService-->>ProcessWriteController: ProcessResponse
    ProcessWriteController-->>Frontend: 201 Created
    Frontend-->>Bruker: Behandling opprettet
```

---

### 4. Varselgenerering (hva skjer bak kulissene)

```mermaid
sequenceDiagram
    participant ProcessService
    participant AlertService
    participant AlertRepository
    participant DB as PostgreSQL

    ProcessService->>AlertService: updateAlerts(process)
    AlertService->>AlertRepository: deleteAlertsForProcess(processId)
    loop For each Policy
        AlertService->>AlertService: checkMissingLegalBasis(policy)
        AlertService->>AlertService: checkExcessInfo(policy)
        AlertService->>AlertService: checkMissingArt6(policy)
        AlertService->>AlertService: checkMissingArt9(policy)
    end
    AlertService->>AlertRepository: saveAll(alertEvents)
    AlertRepository->>DB: INSERT INTO generic_storage (type=ALERT_EVENT)
```

---

## Systemarkitektur

```mermaid
graph TD
    Bruker["Bruker (nettleser)"]
    FE["Frontend (Next.js / GCP)"]
    BE["Backend (Spring Boot / GCP)"]
    DB[("PostgreSQL")]
    NOM["NOM (NAV org-chart)"]
    Team["Teamkatalogen"]
    Kodeverk["NAV Kodeverk (land)"]
    BQ["GCP BigQuery (AAREG)"]

    Bruker -->|HTTPS| FE
    FE -->|REST API| BE
    BE --> DB
    BE -->|GraphQL| NOM
    BE -->|REST| Team
    BE -->|REST| Kodeverk
    BE -->|BigQuery API| BQ
```
