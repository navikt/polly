package no.nav.data.polly;

import lombok.Value;
import no.nav.data.polly.common.utils.DateUtil;

import java.time.LocalDate;

@Value
public class Period {

    LocalDate start;
    LocalDate end;

    public Period(LocalDate start, LocalDate end) {
        this.start = start == null ? DateUtil.DEFAULT_START_DATE : start;
        this.end = end == null ? DateUtil.DEFAULT_END_DATE : end;
    }

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

    public boolean isDefault() {
        return !hasStart() || !hasEnd();
    }

    public boolean hasStart() {
        return !start.equals(DateUtil.DEFAULT_START_DATE);
    }

    public boolean hasEnd() {
        return !end.equals(DateUtil.DEFAULT_END_DATE);
    }

}
