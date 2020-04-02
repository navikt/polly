package no.nav.data.polly.export;

import lombok.SneakyThrows;
import no.nav.data.polly.Period;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.rest.ChangeStampResponse;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyData;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessStatus;
import org.apache.commons.lang3.BooleanUtils;
import org.docx4j.jaxb.Context;
import org.docx4j.model.table.TblFactory;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.docx4j.wml.ObjectFactory;
import org.docx4j.wml.P;
import org.docx4j.wml.R;
import org.docx4j.wml.Tc;
import org.docx4j.wml.Text;
import org.docx4j.wml.Tr;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.filter;

@Service
public class ProcessToDocx {

    private static ObjectFactory fac = Context.getWmlObjectFactory();
    private static DateTimeFormatter dtf = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL, FormatStyle.MEDIUM).localizedBy(Locale.forLanguageTag("nb"));
    private static DateTimeFormatter df = DateTimeFormatter.ofLocalizedDate(FormatStyle.FULL).localizedBy(Locale.forLanguageTag("nb"));

    @SneakyThrows
    public byte[] generateDocForProcess(Process process) {
        var doc = new DocumentBuilder(process);
        return doc.build();
    }

    static class DocumentBuilder {

        public static final String TITLE = "Title";
        public static final String HEADING_1 = "Heading1";
        public static final String HEADING_3 = "Heading3";
        public static final String HEADING_4 = "Heading4";
        private final Process process;
        WordprocessingMLPackage pack;
        MainDocumentPart main;

        @SneakyThrows
        public DocumentBuilder(Process process) {
            pack = WordprocessingMLPackage.createPackage();
            main = pack.getMainDocumentPart();
            this.process = process;
            generate();
        }

        public void generate() {
            ProcessData data = process.getData();
            String purposeName = shortName(ListName.PURPOSE, process.getPurposeCode());
            main.addStyledParagraphOfText(TITLE, "Behandling");

            main.addStyledParagraphOfText(HEADING_1, purposeName + ": " + process.getName());
            addText(periodText(process.getData().toPeriod()));

            main.addStyledParagraphOfText(HEADING_4, "Formål " + purposeName);
            addText(CodelistService.getCodelist(ListName.PURPOSE, process.getPurposeCode()).getDescription());

            main.addStyledParagraphOfText(HEADING_4, "Formål med behandlingen");
            addText(data.getDescription());

            main.addStyledParagraphOfText(HEADING_3, "Egenskaper ved behandling");

            main.addStyledParagraphOfText(HEADING_4, "Rettslig grunnlag for behandlingen");
            List<Text> legalBases = data.getLegalBases().stream().map(this::mapLegalBasis).collect(Collectors.toList());
            addTexts(legalBases);

            main.addStyledParagraphOfText(HEADING_4, "Status");
            addText(data.getStatus() == ProcessStatus.COMPLETED ? "Godkjent" : "Under arbeid");

            main.addStyledParagraphOfText(HEADING_4, "Er behandlingen implementert i virksomheten?");
            addText(boolToText(data.getDpia() == null ? null : data.getDpia().isProcessImplemented()));

            main.addStyledParagraphOfText(HEADING_4, "Gyldighetsperiode for behandlingen");
            addText(data.getStart().format(df), " - ", data.getEnd().format(df));

            main.addStyledParagraphOfText(HEADING_4, "Personkategorier oppsummert");
            var categories = process.getPolicies().stream().map(Policy::getData).map(PolicyData::getSubjectCategories).flatMap(Collection::stream).sorted().distinct()
                    .map(c -> shortName(ListName.SUBJECT_CATEGORY, c)).collect(
                            Collectors.joining(", "));
            addText(categories);

            main.addStyledParagraphOfText(HEADING_4, "Organisering");
            addTexts(
                    text("Avdeling: ", shortName(ListName.DEPARTMENT, data.getDepartment())),
                    text("Linja (Ytre etat): ", shortName(ListName.SUB_DEPARTMENT, data.getSubDepartment())),
                    // TODO display name
                    text("Produktteam (IT): ", data.getProductTeam())
            );

            main.addStyledParagraphOfText(HEADING_4, "System");
            addText(convert(data.getProducts(), p -> shortName(ListName.SYSTEM, p)));

            main.addStyledParagraphOfText(HEADING_4, "Bruker alle opplysningstyper");
            addText(boolToText(data.isUsesAllInformationTypes()));

            main.addStyledParagraphOfText(HEADING_4, "Automatisering");
            addTexts(
                    text("Helautomatisk behandling: ", boolToText(data.getAutomaticProcessing())),
                    text("Profilering: ", boolToText(data.getProfiling()))
            );

            dataProcessing();
            retention();
            dpia();

            policies();

            main.addStyledParagraphOfText(HEADING_3, "Sist endret");
            ChangeStampResponse changeStamp = process.convertChangeStampResponse();
            addTexts(
                    text("Av: ", changeStamp.getLastModifiedBy()),
                    text("Tid: ", changeStamp.getLastModifiedDate().format(dtf))
            );

        }

        private Text mapLegalBasis(LegalBasis lb) {
            return text(
                    shortName(ListName.GDPR_ARTICLE, lb.getGdpr()),
                    ", ",
                    shortName(ListName.NATIONAL_LAW, lb.getNationalLaw()) + " ",
                    lb.getDescription(),
                    periodText(lb.toPeriod())
            );
        }

        private String periodText(Period period) {
            var active = period.isActive() ? "Aktiv" : "Inaktiv";
            return period.hasStart() || period.hasEnd() ?
                    String.format(" (%s, periode %s - %s)",
                            active,
                            period.getStart().format(df),
                            period.getEnd().format(df)
                    ) : null;
        }

        private void policies() {
            main.addStyledParagraphOfText(HEADING_3, "Informasjonstyper");

            var twips = pack.getDocumentModel().getSections().get(0).getPageDimensions().getWritableWidthTwips();
            var cols = 3;
            var table = TblFactory.createTable(process.getPolicies().size(), cols, twips / cols);
            var rows = table.getContent();
            var policies = List.copyOf(process.getPolicies());
            for (int i = 0; i < policies.size(); i++) {
                addPolicy(policies.get(i), (Tr) rows.get(i));
            }
            main.getContent().add(table);
        }

        private void addPolicy(Policy pol, Tr row) {
            List<Object> cells = row.getContent();
            Text infoTypeName = text(pol.getInformationTypeName(), periodText(pol.getData().toPeriod()));
            Text subjCats = text(pol.getData().getSubjectCategories().stream().map(c -> shortName(ListName.SUBJECT_CATEGORY, c)).collect(Collectors.joining(", ")));
            ((Tc) cells.get(0)).getContent().add(paragraph(infoTypeName));
            ((Tc) cells.get(1)).getContent().add(paragraph(subjCats));
            pol.getData().getLegalBases().stream().map(this::mapLegalBasis).map(this::paragraph)
                    .forEach(((Tc) cells.get(2)).getContent()::add);
        }

        private void dpia() {
            var data = process.getData().getDpia();
            if (data == null) {
                return;
            }
            main.addStyledParagraphOfText(HEADING_4, "Er det behov for personvernkonsekvensvurdering (PVK)?");
            addTexts(
                    text(boolToText(data.getNeedForDpia())),
                    text("Begrunnelse: ", data.getGrounds()),
                    // TODO eier navn
                    text("Risiko eier: ", data.getRiskOwner()),
                    text("PVK referanse: ", data.getRefToDpia())
            );
        }

        private void dataProcessing() {
            var data = process.getData().getDataProcessing();
            if (data == null) {
                return;
            }
            main.addStyledParagraphOfText(HEADING_4, "Databehandler");
            addTexts(
                    text("Databehandler benyttes: ", boolToText(data.getDataProcessor())),
                    text("Ref. til databehandleravtale: ", String.join(", ", data.getDataProcessorAgreements())),
                    text("Personopplysningene behandles utenfor EU/EØS: ", boolToText(data.getDataProcessorOutsideEU()))
            );
        }

        private void retention() {
            var retention = process.getData().getRetention();
            if (retention == null) {
                return;
            }
            main.addStyledParagraphOfText(HEADING_4, "Lagringstid");
            var ret1 = text("Omfattes av virksomhetens bevarings- og kassasjonsplan: ", boolToText(retention.getRetentionPlan()));
            var ret3 = text("Begrunnelse: ", retention.getRetentionDescription());

            boolean retentionDuration = retention.getRetentionMonths() != null;
            boolean years = retentionDuration && retention.getRetentionMonths() >= 12;
            boolean months = retentionDuration && retention.getRetentionMonths() % 12 != 0;
            var yearsText = years ? retention.getRetentionMonths() / 12 + " år " : null;
            var binderText = years && months ? "og " : null;
            var monthsText = months ? retention.getRetentionMonths() % 12 + " måneder " : null;
            var descText = retention.getRetentionStart() == null ? "" : " fra " + retention.getRetentionStart();
            var ret2 = retentionDuration ? text("Lagres i ", yearsText, binderText, monthsText, descText) : null;

            addTexts(ret1, ret2, ret3);
        }

        private String boolToText(Boolean aBoolean) {
            return BooleanUtils.toString(aBoolean, "Ja", "Nei", "Uavklart");
        }

        private String shortName(ListName listName, String code) {
            return code == null ? "" : CodelistService.getCodelist(listName, code).getShortName();
        }

        private Text text(String... values) {
            List<String> strings = filter(Arrays.asList(values), Objects::nonNull);
            if (strings.isEmpty()) {
                return null;
            }
            Text text = fac.createText();
            text.setValue(String.join("", strings).replaceAll("[\\s]+", " "));
            return text;
        }

        private void addTexts(Text... values) {
            addTexts(Arrays.asList(values));
        }

        private void addTexts(Collection<Text> values) {
            main.getContent().add(paragraph(values));
        }

        private P paragraph(Text... values) {
            return paragraph(Arrays.asList(values));
        }

        private P paragraph(Collection<Text> values) {
            var texts = filter(values, Objects::nonNull);
            P p = fac.createP();
            R r = fac.createR();
            for (int i = 0; i < texts.size(); i++) {
                Text txt = texts.get(i);
                r.getContent().add(txt);
                if (i != texts.size() - 1) {
                    r.getContent().add(fac.createBr());
                }
            }
            p.getContent().add(r);
            return p;
        }

        private void addText(Collection<String> values) {
            addText(String.join(", ", values));
        }

        private void addText(String... values) {
            R r = fac.createR();
            Text text = fac.createText();
            text.setValue(String.join("", filter(Arrays.asList(values), Objects::nonNull)).replaceAll("[\\s]+", " "));
            r.getContent().add(text);
            P p = fac.createP();
            p.getContent().add(r);

            main.addObject(p);
        }

        @SneakyThrows
        public byte[] build() {
            var outStream = new ByteArrayOutputStream();
            pack.save(outStream);
            return outStream.toByteArray();
        }
    }


}
