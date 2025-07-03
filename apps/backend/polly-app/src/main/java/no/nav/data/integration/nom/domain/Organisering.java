package no.nav.data.integration.nom.domain;

@Data
@Builder
@FieldNameConstants
@NoArgsConstructor
@AllArgsConstructor
public class Organisering {
    private Retning retning;
    private OrgEnhet orgEnhet;
}
