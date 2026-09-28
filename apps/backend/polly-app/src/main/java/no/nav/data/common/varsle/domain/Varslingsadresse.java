package no.nav.data.common.varsle.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import lombok.experimental.SuperBuilder;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.Validated;


import static org.apache.commons.lang3.StringUtils.trimToNull;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
public class Varslingsadresse implements Validated {

    private String adresse;
    private AdresseType type;


    @Override
    public void format() {
        setAdresse(trimToNull(adresse));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkNull(Fields.type, type);
        validator.checkNull(Fields.adresse, adresse);
    }
}
