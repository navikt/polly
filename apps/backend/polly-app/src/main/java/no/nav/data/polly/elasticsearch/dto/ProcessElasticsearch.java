package no.nav.data.polly.elasticsearch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProcessElasticsearch {

    private String id;
    private String name;
    private String purpose;
    private String purposeDescription;
    private String department;
    private String subDepartment;
    private String start;
    private String end;
    private boolean active;
    private List<PolicyElasticsearch> policies;
    private List<LegalBasisElasticsearch> legalbases = new ArrayList<>();

}
