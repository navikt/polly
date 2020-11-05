package no.nav.data.common.template;

import lombok.Getter;

public enum Template {
    PROCESS_NEEDS_REVISION("needs-revision.ftl");

    @Getter
    private final String templateName;

    Template(String template) {
        templateName = template;
    }

}
