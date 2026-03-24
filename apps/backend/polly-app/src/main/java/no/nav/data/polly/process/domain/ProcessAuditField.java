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
    AI_USAGE_DESCRIPTION("aiUsageDescription", "Kunstig intelligens");

    public final String jsonKey;
    public final String displayName;

    ProcessAuditField(String jsonKey, String displayName) {
        this.jsonKey = jsonKey;
        this.displayName = displayName;
    }
}
