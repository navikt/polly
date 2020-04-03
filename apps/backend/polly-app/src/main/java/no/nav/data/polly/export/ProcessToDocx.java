package no.nav.data.polly.export;

import lombok.SneakyThrows;
import no.nav.data.polly.Period;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.alert.dto.PolicyAlert;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.rest.ChangeStampResponse;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyData;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.teams.ResourceService;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.Team;
import no.nav.data.polly.teams.dto.Resource;
import org.apache.commons.lang3.BooleanUtils;
import org.docx4j.docProps.core.dc.elements.SimpleLiteral;
import org.docx4j.jaxb.Context;
import org.docx4j.model.properties.table.tr.TrCantSplit;
import org.docx4j.model.table.TblFactory;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.docx4j.wml.BooleanDefaultTrue;
import org.docx4j.wml.Br;
import org.docx4j.wml.ObjectFactory;
import org.docx4j.wml.P;
import org.docx4j.wml.R;
import org.docx4j.wml.RPr;
import org.docx4j.wml.STBrType;
import org.docx4j.wml.Tc;
import org.docx4j.wml.Text;
import org.docx4j.wml.Tr;
import org.docx4j.wml.TrPr;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;
import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.filter;

@Service
public class ProcessToDocx {

    private static ObjectFactory fac = Context.getWmlObjectFactory();
    private static DateTimeFormatter dtf = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL, FormatStyle.MEDIUM).localizedBy(Locale.forLanguageTag("nb"));
    private static DateTimeFormatter df = DateTimeFormatter.ofLocalizedDate(FormatStyle.FULL).localizedBy(Locale.forLanguageTag("nb"));

    private final AlertService alertService;
    private final ResourceService resourceService;
    private final TeamService teamService;

    public ProcessToDocx(AlertService alertService, ResourceService resourceService, TeamService teamService) {
        this.alertService = alertService;
        this.resourceService = resourceService;
        this.teamService = teamService;
    }

    @SneakyThrows
    public byte[] generateDocForProcess(Process process) {
        var doc = new DocumentBuilder(process);
        return doc.build();
    }

    class DocumentBuilder {

        public static final String TITLE = "Title";
        public static final String HEADING_1 = "Heading1";
        public static final String HEADING_2 = "Heading2";
        public static final String HEADING_4 = "Heading4";
        private final Process process;
        WordprocessingMLPackage pack;
        MainDocumentPart main;

        @SneakyThrows
        public DocumentBuilder(Process process) {
            pack = WordprocessingMLPackage.createPackage();
            main = pack.getMainDocumentPart();
            SimpleLiteral lang = new SimpleLiteral();
            lang.setLang("nb-NO");
            pack.getDocPropsCorePart().getJaxbElement().setLanguage(lang);
            this.process = process;
            generate();
        }

        public void generate() {
            ProcessData data = process.getData();
            String purposeName = shortName(ListName.PURPOSE, process.getPurposeCode());
            main.addStyledParagraphOfText(TITLE, "Behandling");

            main.addStyledParagraphOfText(HEADING_1, purposeName + ": " + process.getName());
            addText(periodText(process.getData().toPeriod()));

            main.addStyledParagraphOfText(HEADING_4, "Overordnet formål: " + purposeName);
            addText(CodelistService.getCodelist(ListName.PURPOSE, process.getPurposeCode()).getDescription());

            main.addStyledParagraphOfText(HEADING_4, "Formål med behandlingen");
            addText(data.getDescription());

            main.addStyledParagraphOfText(HEADING_2, "Egenskaper ved behandling");

            main.addStyledParagraphOfText(HEADING_4, "Rettslig grunnlag for behandlingen");
            addTexts(data.getLegalBases().stream().map(this::mapLegalBasis).collect(Collectors.toList()));

            main.addStyledParagraphOfText(HEADING_4, "Status");
            addText(data.getStatus() == ProcessStatus.COMPLETED ? "Godkjent" : "Under arbeid");

            main.addStyledParagraphOfText(HEADING_4, "Er behandlingen implementert i virksomheten?");
            addText(boolToText(data.getDpia() == null ? null : data.getDpia().isProcessImplemented()));

            if (!data.toPeriod().isDefault()) {
                main.addStyledParagraphOfText(HEADING_4, "Gyldighetsperiode for behandlingen");
                addText(data.getStart().format(df), " - ", data.getEnd().format(df));
            }

            main.addStyledParagraphOfText(HEADING_4, "Personkategorier oppsummert");
            var categories = process.getPolicies().stream().map(Policy::getData).map(PolicyData::getSubjectCategories).flatMap(Collection::stream).sorted().distinct()
                    .map(c -> shortName(ListName.SUBJECT_CATEGORY, c)).collect(
                            Collectors.joining(", "));
            addText(categories);

            organising();

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

            main.addStyledParagraphOfText(HEADING_2, "Sist endret");
            ChangeStampResponse changeStamp = process.convertChangeStampResponse();
            addTexts(
                    text("Av: ", changeStamp.getLastModifiedBy()),
                    text("Tid: ", changeStamp.getLastModifiedDate().format(dtf))
            );

        }

        private void organising() {
            var data = process.getData();
            main.addStyledParagraphOfText(HEADING_4, "Organisering");
            String teamName = Optional.ofNullable(data.getProductTeam()).flatMap(teamService::getTeam).map(Team::getName).orElse(data.getProductTeam());
            addTexts(
                    text("Avdeling: ", shortName(ListName.DEPARTMENT, data.getDepartment())),
                    text("Linja (Ytre etat): ", shortName(ListName.SUB_DEPARTMENT, data.getSubDepartment())),
                    text("Produktteam (IT): ", teamName),
                    text("Felles behandlingsansvarlig: ", shortName(ListName.THIRD_PARTY, data.getCommonExternalProcessResponsible()))
            );
        }

        private Text mapLegalBasis(LegalBasis lb) {
            return text(
                    shortName(ListName.GDPR_ARTICLE, lb.getGdpr()),
                    ", ",
                    shortName(ListName.NATIONAL_LAW, lb.getNationalLaw()),
                    " ",
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
            Br br = fac.createBr();
            br.setType(STBrType.PAGE);
            main.addObject(br);

            main.addStyledParagraphOfText(HEADING_2, "Opplysningstyper");
            if (process.getPolicies().isEmpty()) {
                addText("Ingen opplysningstyper");
                return;
            }

            var twips = pack.getDocumentModel().getSections().get(0).getPageDimensions().getWritableWidthTwips();
            var cols = 3;
            var table = TblFactory.createTable(process.getPolicies().size() + 1, cols, twips / cols);
            var rows = table.getContent();
            createPolicyHeader(rows);

            var alerts = alertService.checkAlertsForProcess(process.getId());
            var policies = new ArrayList<>(process.getPolicies());
            policies.sort(comparing(Policy::getInformationTypeName));
            for (int i = 0; i < policies.size(); i++) {
                Policy policy = policies.get(i);
                var alert = StreamUtils.find(alerts.getPolicies(), pa -> pa.getPolicyId().equals(policy.getId()));
                addPolicy(policy, alert.orElse(null), (Tr) rows.get(i + 1));
            }
            main.getContent().add(table);
        }

        private void createPolicyHeader(List<Object> rows) {
            var header = ((Tr) rows.get(0));
            P opplysningstype = paragraph(text("Opplysningstype"));
            ((R) opplysningstype.getContent().get(0)).setRPr(bold());
            P personkategorier = paragraph(text("Personkategorier"));
            ((R) personkategorier.getContent().get(0)).setRPr(bold());
            P rettsligGrunnlag = paragraph(text("Rettslig grunnlag"));
            ((R) rettsligGrunnlag.getContent().get(0)).setRPr(bold());
            ((Tc) header.getContent().get(0)).getContent().add(opplysningstype);
            ((Tc) header.getContent().get(1)).getContent().add(personkategorier);
            ((Tc) header.getContent().get(2)).getContent().add(rettsligGrunnlag);
        }

        private RPr bold() {
            RPr rPr = fac.createRPr();
            rPr.setB(new BooleanDefaultTrue());
            return rPr;
        }

        private void addPolicy(Policy pol, PolicyAlert alert, Tr row) {
            TrPr trPr = fac.createTrPr();
            new TrCantSplit().set(trPr);
            row.setTrPr(trPr);

            List<Object> cells = row.getContent();
            Text infoTypeName = text(pol.getInformationTypeName(), periodText(pol.getData().toPeriod()));
            Text subjCats = text(pol.getData().getSubjectCategories().stream().map(c -> shortName(ListName.SUBJECT_CATEGORY, c)).collect(Collectors.joining(", ")));
            ((Tc) cells.get(0)).getContent().add(paragraph(infoTypeName));
            ((Tc) cells.get(1)).getContent().add(paragraph(subjCats));
            List<Object> legalBasisCell = ((Tc) cells.get(2)).getContent();
            pol.getData().getLegalBases().stream()
                    .map(this::mapLegalBasis)
                    .map(this::paragraph)
                    .forEach(legalBasisCell::add);
            if (alert != null) {
                if (alert.isMissingLegalBasis()) {
                    legalBasisCell.add(paragraph(text("Rettslig grunnlag er ikke avklart")));
                }
                if (alert.isMissingArt6()) {
                    legalBasisCell.add(paragraph(text("Rettslig grunnlag for artikkel 6 mangler")));
                }
                if (alert.isMissingArt9()) {
                    legalBasisCell.add(paragraph(text("Rettslig grunnlag for artikkel 9 mangler")));
                }
            }
        }

        private void dpia() {
            var data = process.getData().getDpia();
            if (data == null) {
                return;
            }
            var riskOwner = Optional.ofNullable(data.getRiskOwner()).flatMap(resourceService::getResource).map(Resource::getFullName).orElse(data.getRiskOwner());
            main.addStyledParagraphOfText(HEADING_4, "Er det behov for personvernkonsekvensvurdering (PVK)?");
            addTexts(
                    text(boolToText(data.getNeedForDpia())),
                    text("Begrunnelse: ", data.getGrounds()),
                    text("Risiko eier: ", riskOwner),
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

        private void addTexts(Text... values) {
            addTexts(Arrays.asList(values));
        }

        private void addTexts(Collection<Text> values) {
            main.addObject(paragraph(values));
        }

        private void addText(Collection<String> values) {
            addText(String.join(", ", values));
        }

        private void addText(String... values) {
            main.addObject(paragraph(text(values)));
        }

        @SneakyThrows
        public byte[] build() {
            var outStream = new ByteArrayOutputStream();
            pack.save(outStream);
            return outStream.toByteArray();
        }
    }


}
