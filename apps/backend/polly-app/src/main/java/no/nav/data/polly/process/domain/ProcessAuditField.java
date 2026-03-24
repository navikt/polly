package no.nav.data.polly.process.domain;

public enum ProcessAuditField {

    LEGAL_BASES("legalBases", "Behandlingsgrunnlag for hele behandlingen"),
    PURPOSES("purposes", "Formål"),
    AUTOMATIC_PROCESSING("automaticProcessing", "Automatisk behandling"),
    PROFILING("profiling", "Profilering"),
    DATA_PROCESSING("dataProcessing", "Databehandling"),
    RETENTION("retention", "Oppbevaringstid"),
    DPIA("dpia", "PVK"),
    AFFILIATION("affiliation", "Tilhørighet"),
    AFFILIATION_DEPARTMENT("affiliation,nomDepartmentId", "Avdeling"),
    AFFILIATION_SUB_DEPARTMENTS("affiliation,subDepartments", "Linja"),
    AFFILIATION_PRODUCT_TEAMS("affiliation,productTeams", "Team"),
    COMMON_EXTERNAL_PROCESS_RESPONSIBLE("commonExternalProcessResponsible", "Felles behandlingsansvarlig"),
    AI_USAGE_DESCRIPTION("aiUsageDescription", "Kunstig intelligens"),
    AI_IN_USE("aiUsageDescription,aiUsage", "Benyttes KI-systemer"),
    AI_REUSING_PERSONAL_INFORMATION("aiUsageDescription,reusingPersonalInformation", "Gjenbrukes personopplysningene til å utvikle KI-systemer?");

    public final String jsonKey;
    public final String displayName;

    ProcessAuditField(String jsonKey, String displayName) {
        this.jsonKey = jsonKey;
        this.displayName = displayName;
    }
}
