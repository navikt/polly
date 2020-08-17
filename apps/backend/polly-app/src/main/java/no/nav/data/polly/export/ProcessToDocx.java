package no.nav.data.polly.export;

import lombok.SneakyThrows;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.polly.Period;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.alert.dto.PolicyAlert;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyData;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessData.DataProcessing;
import no.nav.data.polly.process.domain.ProcessData.Dpia;
import no.nav.data.polly.process.domain.ProcessData.Retention;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.teams.ResourceService;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.Team;
import no.nav.data.polly.teams.dto.Resource;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.docx4j.jaxb.Context;
import org.docx4j.model.properties.table.tr.TrCantSplit;
import org.docx4j.model.table.TblFactory;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.FooterPart;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.docx4j.wml.BooleanDefaultTrue;
import org.docx4j.wml.Br;
import org.docx4j.wml.CTLanguage;
import org.docx4j.wml.HdrFtrRef;
import org.docx4j.wml.HpsMeasure;
import org.docx4j.wml.JcEnumeration;
import org.docx4j.wml.ObjectFactory;
import org.docx4j.wml.P;
import org.docx4j.wml.PPr;
import org.docx4j.wml.PPrBase.NumPr;
import org.docx4j.wml.PPrBase.NumPr.NumId;
import org.docx4j.wml.PPrBase.Spacing;
import org.docx4j.wml.R;
import org.docx4j.wml.RPr;
import org.docx4j.wml.STBrType;
import org.docx4j.wml.Tbl;
import org.docx4j.wml.Tc;
import org.docx4j.wml.Text;
import org.docx4j.wml.Tr;
import org.docx4j.wml.TrPr;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigInteger;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.filter;

@Service
public class ProcessToDocx {

    private static final ObjectFactory fac = Context.getWmlObjectFactory();
    private static final DateTimeFormatter dtf = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL, FormatStyle.MEDIUM).localizedBy(Locale.forLanguageTag("nb"));
    private static final DateTimeFormatter df = DateTimeFormatter.ofLocalizedDate(FormatStyle.FULL).localizedBy(Locale.forLanguageTag("nb"));

    private final AlertService alertService;
    private final ResourceService resourceService;
    private final TeamService teamService;
    private final ProcessRepository processRepository;

    public ProcessToDocx(AlertService alertService, ResourceService resourceService, TeamService teamService, ProcessRepository processRepository) {
        this.alertService = alertService;
        this.resourceService = resourceService;
        this.teamService = teamService;
        this.processRepository = processRepository;
    }

    @SneakyThrows
    public byte[] generateDocForProcess(Process process) {
        var doc = new DocumentBuilder();
        doc.addTitle("Behandling: " + process.getName());
        doc.generate(process);
        return doc.build();
    }

    public byte[] generateDocFor(ListName list, String code) {
        List<Process> processes;
        String title;
        if (list == ListName.DEPARTMENT) {
            title = "Avdeling";
            processes = processRepository.findByDepartment(code);
        } else if (list == ListName.SUB_DEPARTMENT) {
            title = "Linja (Ytre etat)";
            processes = processRepository.findBySubDepartment(code);
        } else if (list == ListName.PURPOSE) {
            title = "Formål";
            processes = processRepository.findByPurposeCode(code);
        } else if (list == ListName.SYSTEM) {
            title = "System";
            processes = processRepository.findByProduct(code);
        } else {
            throw new ValidationException("no list given");
        }
        processes = new ArrayList<>(processes);
        processes.sort(comparing(Process::getPurposeCode).thenComparing(Process::getName));
        Codelist codelist = CodelistService.getCodelist(list, code);
        var doc = new DocumentBuilder();
        doc.addTitle(title + ": " + codelist.getShortName());
        doc.addText(codelist.getDescription());

        doc.addHeading1("Dokumentet inneholder følgende behandlinger (" + processes.size() + ")");
        doc.addToc(processes);

        for (int i = 0; i < processes.size(); i++) {
            if (i != processes.size() - 1) {
                doc.pageBreak();
            }
            doc.generate(processes.get(i));
        }

        return doc.build();
    }

    class DocumentBuilder {

        public static final String TITLE = "Title";
        public static final String HEADING_1 = "Heading1";
        public static final String HEADING_2 = "Heading2";
        public static final String HEADING_4 = "Heading4";

        WordprocessingMLPackage pack;
        MainDocumentPart main;
        long listId = 1;
        long processId = 1;

        @SneakyThrows
        public DocumentBuilder() {
            pack = WordprocessingMLPackage.createPackage();
            main = pack.getMainDocumentPart();

            addFooter();
        }

        public void generate(Process process) {
            ProcessData data = process.getData();
            String purposeName = shortName(ListName.PURPOSE, process.getPurposeCode());

            var header = addHeading1(purposeName + ": " + process.getName());
            addBookmark(header, process.getId().toString());
            addText(periodText(process.getData().toPeriod()));

            addHeading4("Overordnet formål: " + purposeName);
            addText(CodelistService.getCodelist(ListName.PURPOSE, process.getPurposeCode()).getDescription());

            addHeading4("Formål med behandlingen");
            addText(data.getDescription());

            addHeading2("Egenskaper ved behandling");

            addHeading4("Rettslig grunnlag for behandlingen");
            addTexts(data.getLegalBases().stream().map(this::mapLegalBasis).collect(toList()));

            addHeading4("Status");
            addText(data.getStatus() == ProcessStatus.COMPLETED ? "Godkjent" : "Under arbeid");

            addHeading4("Er behandlingen implementert i virksomheten?");
            addText(boolToText(data.getDpia() == null ? null : data.getDpia().isProcessImplemented()));

            if (!data.toPeriod().isDefault()) {
                addHeading4("Gyldighetsperiode for behandlingen");
                addText(data.getStart().format(df), " - ", data.getEnd().format(df));
            }

            addHeading4("Personkategorier oppsummert");
            var categories = process.getPolicies().stream()
                    .map(Policy::getData)
                    .map(PolicyData::getSubjectCategories)
                    .flatMap(Collection::stream)
                    .sorted().distinct()
                    .map(c -> shortName(ListName.SUBJECT_CATEGORY, c))
                    .collect(Collectors.joining(", "));
            addText(categories);

            organising(process.getData());

            addHeading4("System");
            addText(convert(data.getProducts(), p -> shortName(ListName.SYSTEM, p)));

            addHeading4("Automatisering");
            addTexts(
                    text("Helautomatisk behandling: ", boolToText(data.getAutomaticProcessing())),
                    text("Profilering: ", boolToText(data.getProfiling()))
            );

            dataProcessing(process.getData().getDataProcessing());
            retention(process.getData().getRetention());
            dpia(process.getData().getDpia());

            policies(process);

            addHeading2("Sist endret");
            ChangeStampResponse changeStamp = process.convertChangeStampResponse();
            addTexts(
                    text("Av: ", changeStamp.getLastModifiedBy()),
                    text("Tid: ", changeStamp.getLastModifiedDate().format(dtf))
            );
        }

        private void organising(ProcessData data) {
            addHeading4("Organisering");
            var teamNames = data.getProductTeams().stream()
                    .map(teamId -> Map.entry(teamId, teamService.getTeam(teamId)))
                    .map(t -> t.getValue().map(Team::getName).orElse(t.getKey()))
                    .collect(toList());

            addTexts(
                    text("Avdeling: ", shortName(ListName.DEPARTMENT, data.getDepartment())),
                    text("Linja (Ytre etat): ", String.join(", ", convert(data.getSubDepartments(), sd -> shortName(ListName.SUB_DEPARTMENT, sd)))),
                    text("Produktteam (IT): ", String.join(", ", teamNames)),
                    text("Felles behandlingsansvarlig: ", shortName(ListName.THIRD_PARTY, data.getCommonExternalProcessResponsible()))
            );
        }

        private Text mapLegalBasis(LegalBasis lb) {
            return text(
                    shortName(ListName.GDPR_ARTICLE, lb.getGdpr()),
                    ", ",
                    shortName(ListName.NATIONAL_LAW, lb.getNationalLaw()),
                    " ",
                    lb.getDescription()
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

        private void policies(Process process) {
            addHeading2("Opplysningstyper");
            if (process.getData().isUsesAllInformationTypes()) {
                addText("Bruker alle opplysningstyper");
            } else if (process.getPolicies().isEmpty()) {
                addText("Ingen opplysningstyper");
            }
            if (process.getPolicies().isEmpty()) {
                return;
            }

            Tbl table = createTable(process.getPolicies().size() + 1, 3);
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
            RPr rPr = createRpr();
            rPr.setB(new BooleanDefaultTrue());
            return rPr;
        }

        private RPr createRpr() {
            RPr rPr = fac.createRPr();
            CTLanguage ctLang = fac.createCTLanguage();
            ctLang.setVal("no-NB");
            rPr.setLang(ctLang);
            return rPr;
        }

        private void addPolicy(Policy pol, PolicyAlert alert, Tr row) {
            TrPr trPr = fac.createTrPr();
            new TrCantSplit().set(trPr);
            row.setTrPr(trPr);

            List<Object> cells = row.getContent();
            Text infoTypeName = text(pol.getInformationTypeName());
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
                if (alert.isExcessInfo()) {
                    legalBasisCell.add(paragraph(text("Overskuddsinformasjon")));
                }
                if (alert.isMissingArt6()) {
                    legalBasisCell.add(paragraph(text("Rettslig grunnlag for artikkel 6 mangler")));
                }
                if (alert.isMissingArt9()) {
                    legalBasisCell.add(paragraph(text("Rettslig grunnlag for artikkel 9 mangler")));
                }
            }
        }

        private void dpia(Dpia data) {
            if (data == null) {
                return;
            }
            var riskOwner = Optional.ofNullable(data.getRiskOwner()).flatMap(resourceService::getResource).map(Resource::getFullName).orElse(data.getRiskOwner());
            addHeading4("Er det behov for personvernkonsekvensvurdering (PVK)?");
            addTexts(
                    text(boolToText(data.getNeedForDpia())),
                    text("Begrunnelse: ", data.getGrounds()),
                    text("Risiko eier: ", riskOwner,
                            StringUtils.isNotBlank(data.getRiskOwnerFunction()) ? " i funksjon " + data.getRiskOwnerFunction() : ""),
                    text("PVK referanse: ", data.getRefToDpia())
            );
        }

        private void dataProcessing(DataProcessing data) {
            if (data == null) {
                return;
            }
            var transferGrounds = Boolean.TRUE.equals(data.getDataProcessorOutsideEU()) ?
                    text("Overføringsgrunnlag for behandling utenfor EU/EØS: ",
                            shortName(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, data.getTransferGroundsOutsideEU()),
                            Optional.ofNullable(data.getTransferGroundsOutsideEUOther()).map(s -> ": " + s).orElse(""))
                    : text("");

            addHeading4("Databehandler");
            addTexts(
                    text("Databehandler benyttes: ", boolToText(data.getDataProcessor())),
                    text("Ref. til databehandleravtale: ", data.getDataProcessorAgreements() == null ? "" : String.join(", ", data.getDataProcessorAgreements())),
                    text("Personopplysningene behandles utenfor EU/EØS: ", boolToText(data.getDataProcessorOutsideEU())),
                    transferGrounds
            );
        }

        private void retention(Retention retention) {
            if (retention == null) {
                return;
            }
            addHeading4("Lagringstid");
            var ret1 = text("Omfattes av virksomhetens bevarings- og kassasjonsplan: ", boolToText(retention.getRetentionPlan()));
            var ret3 = text("Begrunnelse: ", retention.getRetentionDescription());

            boolean retentionDuration = retention.getRetentionMonths() != null && retention.getRetentionMonths() != 0;
            boolean years = retentionDuration && retention.getRetentionMonths() >= 12;
            boolean months = retentionDuration && retention.getRetentionMonths() % 12 != 0;
            var yearsText = years ? retention.getRetentionMonths() / 12 + " år " : null;
            var binderText = years && months ? "og " : null;
            var monthsText = months ? retention.getRetentionMonths() % 12 + " måneder " : null;
            var descText = retention.getRetentionStart() == null ? "" : " fra " + retention.getRetentionStart();
            var ret2 = retentionDuration ? text("Lagres i ", yearsText, binderText, monthsText, descText) : null;

            addTexts(ret1, ret2, ret3);
        }

        private void addTitle(String text) {
            P p = main.addStyledParagraphOfText(TITLE, text);
            ((R) p.getContent().get(0)).setRPr(createRpr());
        }

        private P addHeading1(String text) {
            P p = main.addStyledParagraphOfText(HEADING_1, text);
            ((R) p.getContent().get(0)).setRPr(createRpr());
            return p;
        }

        private void addHeading2(String text) {
            P p = main.addStyledParagraphOfText(HEADING_2, text);
            ((R) p.getContent().get(0)).setRPr(createRpr());
        }

        private void addHeading4(String text) {
            P p = main.addStyledParagraphOfText(HEADING_4, text);
            ((R) p.getContent().get(0)).setRPr(createRpr());
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
            r.setRPr(createRpr());
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

        private void addToc(List<Process> processes) {
            long currListId = listId++;

            for (Process process : processes) {
                var name = shortName(ListName.PURPOSE, process.getPurposeCode()) + ": " + process.getName();
                var bookmark = process.getId().toString();

                addListItem(name, currListId, bookmark);
            }
        }

        private void addListItem(String text, long listId, String bookmark) {
            var p = paragraph();
            PPr pPr = fac.createPPr();
            NumPr numPr = fac.createPPrBaseNumPr();
            NumId numId = fac.createPPrBaseNumPrNumId();
            Spacing pPrBaseSpacing = fac.createPPrBaseSpacing();
            p.setPPr(pPr);
            pPr.setNumPr(numPr);

            // Remove spacing
            pPrBaseSpacing.setBefore(BigInteger.ZERO);
            pPrBaseSpacing.setAfter(BigInteger.ZERO);
            pPr.setSpacing(pPrBaseSpacing);

            numPr.setNumId(numId);
            numId.setVal(BigInteger.valueOf(listId));
            main.getContent().add(p);

            if (bookmark != null) {
                var h = MainDocumentPart.hyperlinkToBookmark(bookmark, text);
                p.getContent().add(h);
            } else {
                p.getContent().add(text(text));
            }
        }

        private void pageBreak() {
            P p = fac.createP();
            R r = fac.createR();
            Br br = fac.createBr();
            br.setType(STBrType.PAGE);
            p.getContent().add(r);
            r.getContent().add(br);
            main.getContent().add(p);
        }

        private Tbl createTable(int rows, int cols) {
            var twips = pack.getDocumentModel().getSections().get(0).getPageDimensions().getWritableWidthTwips();
            Tbl table = TblFactory.createTable(rows, cols, twips / cols);
            main.getContent().add(table);
            return table;
        }

        @SneakyThrows
        private void addFooter() {
            var p = fac.createP();
            var r = fac.createR();

            var rpr = createRpr();
            var size = new HpsMeasure();
            size.setVal(BigInteger.valueOf(16));
            rpr.setSz(size);
            rpr.setNoProof(new BooleanDefaultTrue());
            r.setRPr(rpr);

            var ppr = fac.createPPr();
            var jc = fac.createJc();
            jc.setVal(JcEnumeration.RIGHT);
            ppr.setJc(jc);
            p.setPPr(ppr);

            var pgnum = fac.createCTSimpleField();
            pgnum.setInstr(" PAGE \\* MERGEFORMAT ");
            var fldSimple = fac.createPFldSimple(pgnum);
            p.getContent().add(fldSimple);

            var footer = fac.createFtr();
            footer.getContent().add(p);

            var footerPart = new FooterPart();
            footerPart.setJaxbElement(footer);
            var ftrRel = main.addTargetPart(footerPart);
            pack.getParts().put(footerPart);

            var ftrRef = fac.createFooterReference();
            ftrRef.setId(ftrRel.getId());
            ftrRef.setType(HdrFtrRef.DEFAULT);
            var sectPr = pack.getDocumentModel().getSections().iterator().next().getSectPr();
            sectPr.getEGHdrFtrReferences().add(ftrRef);
        }

        private void addBookmark(P p, String name) {
            var id = BigInteger.valueOf(processId++);
            var size = p.getContent().size();

            // Add bookmark end first
            var mr = fac.createCTMarkupRange();
            mr.setId(id);
            var bmEnd = fac.createBodyBookmarkEnd(mr);
            p.getContent().add(size, bmEnd);

            // Next, bookmark start
            var bm = fac.createCTBookmark();
            bm.setId(id);
            bm.setName(name);
            var bmStart = fac.createBodyBookmarkStart(bm);
            p.getContent().add(0, bmStart);
        }


        @SneakyThrows
        public byte[] build() {
            var outStream = new ByteArrayOutputStream();
            pack.save(outStream);
            return outStream.toByteArray();
        }
    }

    private static String boolToText(Boolean aBoolean) {
        return BooleanUtils.toString(aBoolean, "Ja", "Nei", "Uavklart");
    }

    private static String shortName(ListName listName, String code) {
        return code == null ? "" : CodelistService.getCodelist(listName, code).getShortName();
    }

}
