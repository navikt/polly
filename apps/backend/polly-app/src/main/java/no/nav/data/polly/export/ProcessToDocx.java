package no.nav.data.polly.export;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.utils.ZipUtils;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.alert.dto.PolicyAlert;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.commoncode.CommonCodeService;
import no.nav.data.polly.codelist.commoncode.dto.CommonCodeResponse;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.export.domain.DocumentAccess;
import no.nav.data.polly.export.domain.FileData;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyData;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.process.domain.sub.DataProcessing;
import no.nav.data.polly.process.domain.sub.Dpia;
import no.nav.data.polly.process.domain.sub.NoDpiaReason;
import no.nav.data.polly.process.domain.sub.Retention;
import no.nav.data.polly.processor.domain.Processor;
import no.nav.data.polly.processor.domain.repo.ProcessorRepository;
import no.nav.data.polly.teams.ResourceService;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.Team;
import no.nav.data.polly.teams.dto.Resource;
import org.apache.commons.lang3.BooleanUtils;
import org.docx4j.com.google.common.base.Function;
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
import java.io.IOException;
import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.copyOf;
import static no.nav.data.common.utils.StreamUtils.filter;
import static org.docx4j.com.google.common.base.Strings.nullToEmpty;

@Service
@RequiredArgsConstructor
public class ProcessToDocx {

    private static final ObjectFactory fac = Context.getWmlObjectFactory();
    private static final DateTimeFormatter dtf = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.LONG, FormatStyle.MEDIUM).localizedBy(Locale.forLanguageTag("nb"));
    private static final DateTimeFormatter df = DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG).localizedBy(Locale.forLanguageTag("nb"));

    private final AlertService alertService;
    private final ResourceService resourceService;
    private final TeamService teamService;
    private final ProcessRepository processRepository;
    private final ProcessorRepository processorRepository;
    private final CommonCodeService commonCodeService;
    private static final String headingProcessList = "Dokumentet inneholder følgende behandlinger (%s)";
    private static final String headingExternalProcessList = "Dokumentet inneholder følgende ferdigstilte behandlinger (%s)";


    public byte[] generateZipForAllPurpose(DocumentAccess documentAccess) throws IOException {
        ZipUtils zipUtils = new ZipUtils();
        List<FileData> zipFiles = new ArrayList<>();
        List<Codelist> allPurposes = CodelistStaticService.getCodelists(ListName.PURPOSE);

        allPurposes.forEach((purpose) -> {
            String wordFileName = "Behandlinger_for_" + purpose.getShortName().replace(' ', '_') + ".docx";
            byte[] document = generateDocFor(ListName.PURPOSE, purpose.getCode(), documentAccess);

            zipFiles.add(FileData.builder()
                            .fileName(wordFileName)
                            .file(document)
                    .build());

        });

        return zipUtils.zipOutputStream(zipFiles);
    }


    public byte[] generateDocForProcess(Process process, DocumentAccess documentAccess) {
        var doc = new DocumentBuilder();
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("dd'.' MMMM yyyy 'kl 'HH:mm");
        doc.addTitle("Behandling: " + process.getData().getName() + " (Behandlingsnummer: " + process.getData().getNumber() + ")");
        doc.addText("Eksportert " + formatter.format(date));
        doc.generate(process, documentAccess);
        return doc.build();
    }

    public byte[] generateDocForProcessList(List<Process> processes, String title, DocumentAccess documentAccess) {
        List<Process> processList = getProcesses(processes, documentAccess);
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("dd'.' MMMM yyyy 'kl 'HH:mm");

        var doc = new DocumentBuilder();
        doc.addTitle(title);
        doc.addText("Eksportert " + formatter.format(date));

        if (documentAccess.equals(DocumentAccess.INTERNAL)) {
            doc.addHeading1(String.format(headingProcessList, processList.size()));
        } else {
            doc.addHeading1(String.format(headingExternalProcessList, processList.size()));
        }

        doc.addToc(processes);

        for (int i = 0; i < processes.size(); i++) {
            if (i != processes.size() - 1) {
                doc.pageBreak();
            }
            doc.generate(processes.get(i), documentAccess);
        }

        return doc.build();
    }

    private List<Process> getProcesses(List<Process> processes, DocumentAccess documentAccess) {
        List<Process> processList;
        if (documentAccess == DocumentAccess.EXTERNAL) {
            processList = new ArrayList<>(processes.stream().filter(p -> p.getData().getStatus().equals(ProcessStatus.COMPLETED)).toList());
        } else {
            processList = new ArrayList<>(processes);
        }

        Comparator<Process> comparator = Comparator.<Process, String>comparing(p -> p.getData().getPurposes().stream().sorted().collect(Collectors.joining(".")))
                .thenComparing(p -> p.getData().getName());
        processList.sort(comparator);

        return processList;
    }

    public byte[] generateDocFor(ListName list, String code, DocumentAccess documentAccess) {
        List<Process> processes;
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("dd'.' MMMM yyyy 'kl 'HH:mm");

        String title;
        switch (list) {
            case DEPARTMENT -> {
                title = "Avdeling";
                processes = processRepository.findByDepartment(code);
            }
            case SUB_DEPARTMENT -> {
                title = "Linja (Ytre etat)";
                processes = processRepository.findBySubDepartment(code);
            }
            case PURPOSE -> {
                title = "Formål";
                processes = processRepository.findByPurpose(code);
            }
            case SYSTEM -> {
                title = "System";
                processes = processRepository.findByProduct(code);
            }
            default -> throw new ValidationException("no list given");
        }

        processes = getProcesses(processes, documentAccess);

        Codelist codelist = CodelistStaticService.getCodelist(list, code);
        var doc = new DocumentBuilder();
        doc.addTitle(title + ": " + codelist.getShortName());
        doc.addText("Eksportert " + formatter.format(date));
        doc.addText(codelist.getDescription());

        if (documentAccess.equals(DocumentAccess.INTERNAL)) {
            doc.addHeading1(String.format(headingProcessList, processes.size()));
        } else {
            doc.addHeading1(String.format(headingExternalProcessList, processes.size()));
        }
        doc.addToc(processes);

        for (int i = 0; i < processes.size(); i++) {
            if (i != processes.size() - 1) {
                doc.pageBreak();
            }
            doc.generate(processes.get(i), documentAccess);
        }

        return doc.build();
    }

    class DocumentBuilder {

        public static final String TITLE = "Title";
        public static final String HEADING_1 = "Heading1";
        public static final String HEADING_2 = "Heading2";
        public static final String HEADING_4 = "Heading4";
        public static final String HEADING_5 = "Heading5";

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

        public void generate(Process process, DocumentAccess documentAccess) {
            ProcessData data = process.getData();
            String purposeNames = shortNames(ListName.PURPOSE, data.getPurposes());

            var header = addHeading1(purposeNames + ": " + process.getData().getName() + " (Behandlingsnummer: " + process.getData().getNumber() + ")");

            addBookmark(header, process.getId().toString());
            //addText(periodText(process.getData().toPeriod()));

            addHeading4("Behandlingsnummer");
            addText(Integer.toString(process.getData().getNumber()));

            data.getPurposes().forEach(purpose -> {
                addHeading4("Overordnet formål: " + shortName(ListName.PURPOSE, purpose));
                addText(CodelistStaticService.getCodelist(ListName.PURPOSE, purpose).getDescription());
            });

            addHeading4("Formål med behandlingen");
            addText(data.getDescription());

            addHeading2("Egenskaper ved behandling");

            addHeading4("Rettslig grunnlag for behandlingen");
            addTexts(data.getLegalBases().stream().map(this::mapLegalBasis).collect(toList()));

            addHeading4("Status");
            addText(processStatusText(data));

            addHeading4("Er behandlingen implementert i virksomheten?");
            addText(boolToText(data.getDpia() == null ? null : data.getDpia().isProcessImplemented()));


            addHeading4("Gyldighetsperiode for behandlingen");
            if (data.getEnd().format(df).contains("9999")) {
                addText(data.getStart().format(df), " - ", "(ingen sluttdato satt)");
            } else {
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

            organising(process.getData(), documentAccess);

            addHeading4("System");
            addText(convert(data.getAffiliation().getProducts(), p -> shortName(ListName.SYSTEM, p)));

            addHeading4("Automatisering");
            addTexts(
                    text("Helautomatisk behandling: ", boolToText(data.getAutomaticProcessing())),
                    text("Profilering: ", boolToText(data.getProfiling()))
            );

            List<UUID> processorIds = process.getData().getDataProcessing().getProcessors();
            var processors = process.getData().getDataProcessing().getDataProcessor() == Boolean.TRUE ? processorRepository.findAllById(processorIds) : List.<Processor>of();
            dataProcessing(process.getData().getDataProcessing(), processors, documentAccess);
            retention(process.getData().getRetention(), documentAccess);
            dpia(process.getData().getDpia(), documentAccess);

            policies(process);

            addHeading2("Sist endret");
            ChangeStampResponse changeStamp = process.convertChangeStampResponse();
            addTexts(
                    /* text("Av: ", changeStamp.getLastModifiedBy()),*/
                    text("Tid: ", changeStamp.getLastModifiedDate().format(dtf))
            );
        }

        private void organising(ProcessData data, DocumentAccess documentAccess) {
            addHeading4("Organisering");
            var teamNames = data.getAffiliation().getProductTeams().stream()
                    .map(teamId -> Map.entry(teamId, teamService.getTeam(teamId)))
                    .map(t -> t.getValue().map(Team::getName).orElse(t.getKey()))
                    .collect(toList());
            addTexts(
                    text("Avdeling: ", shortName(ListName.DEPARTMENT, data.getAffiliation().getDepartment())),
                    text("Linja (Ytre etat): ", String.join(", ", convert(data.getAffiliation().getSubDepartments(), sd -> shortName(ListName.SUB_DEPARTMENT, sd)))),
                    documentAccess.equals(DocumentAccess.INTERNAL) ? text("Produktteam (IT): ", String.join(", ", teamNames)) : text(""),
                    text("Felles behandlingsansvarlig: ", data.getCommonExternalProcessResponsible() == null ? "Ingen" : shortName(ListName.THIRD_PARTY, data.getCommonExternalProcessResponsible()))
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

            var alerts = alertService.checkAlertsForProcess(process);
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
            Text subjCats = text(shortNames(ListName.SUBJECT_CATEGORY, pol.getData().getSubjectCategories()));
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

        private void dpia(Dpia data, DocumentAccess documentAccess) {
            if (data == null) {
                return;
            }
            addHeading4("Er det behov for personvernkonsekvensvurdering (PVK)?");
            addText(boolToText(data.getNeedForDpia()));
            if (boolToText(data.getNeedForDpia()).equals("Nei")) {
                addText("Begrunnelse: ");
                if (data.getNoDpiaReasons() != null) {
                    data.getNoDpiaReasons().forEach(noDpiaReason -> {
                        addText(noDpiaReasonToString(noDpiaReason));
                    });
                }
            }
            addTexts(
                    //text("Risiko eier: ", riskOwner, StringUtils.isNotBlank(data.getRiskOwnerFunction()) ? " i funksjon " + data.getRiskOwnerFunction() : ""),
                    documentAccess.equals(DocumentAccess.INTERNAL) ? text("PVK referanse: ", data.getRefToDpia()) : null
            );
        }

        private String noDpiaReasonToString(NoDpiaReason noDpiaReason){
            return switch (noDpiaReason) {
                case NO_SPECIAL_CATEGORY_PI -> " • Ingen særlige kategorier personopplysninger behandles";
                case SMALL_SCALE -> " • Behandlingen skjer ikke i stor skala (få personopplysninger eller registrerte)";
                case NO_DATASET_CONSOLIDATION -> " • Ingen sammenstilling av datasett på tvers av formål";
                case NO_NEW_TECH -> " • Ingen bruk av teknologi på nye måter eller ny teknologi";
                case NO_PROFILING_OR_AUTOMATION -> " • Ingen bruk av profilering eller automatisering";
                case OTHER -> " • Annet";
            };
        }

        private void dataProcessing(DataProcessing data, List<Processor> processors, DocumentAccess documentAccess) {
            if (data == null) {
                return;
            }
            addHeading4("Databehandlere");

            addTexts(
                    text("Databehandler benyttes: ", boolToText(data.getDataProcessor()))
            );
            var resources = new ArrayList<String>();
            processors.forEach(p -> {
                if (p.getData().getContractOwner() != null) {
                    resources.add(p.getData().getContractOwner());
                }
                resources.addAll(copyOf(p.getData().getOperationalContractManagers()));
            });
            var resourceInfo = resourceService.getResources(resources);
            Function<String, String> navn = (ident) -> Optional.ofNullable(resourceInfo.get(ident)).map(Resource::getFullName).orElse(ident);

            processors.forEach(processor -> {
                var pd = processor.getData();
                var transferGrounds = Boolean.TRUE.equals(pd.getOutsideEU()) ?
                        text("Overføringsgrunnlag for behandling utenfor EU/EØS: ",
                                shortName(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, pd.getTransferGroundsOutsideEU()),
                                Optional.ofNullable(pd.getTransferGroundsOutsideEUOther()).map(s -> ": " + s).orElse(""))
                        : text("");

                if (documentAccess.equals(DocumentAccess.INTERNAL)) {
                    addHeading4(" • " + pd.getName());
                    addTexts(
                            text("Ref. til databehandleravtale: ", nullToEmpty(pd.getContract())),
                            text("Avtaleeier: ", navn.apply(pd.getContractOwner())),
                            text("Avtaleforvaltere: ", String.join(", ", convert(pd.getOperationalContractManagers(), navn))),
                            text("Notat: ", nullToEmpty(pd.getNote())),
                            text("Personopplysningene behandles utenfor EU/EØS: ", boolToText(pd.getOutsideEU())),
                            transferGrounds,
                            text("Overføres til land: ", String.join(", ", convert(pd.getCountries(), ProcessToDocx.this::countryName)))
                    );
                } else {
                    addText(" • " + pd.getName());
                }
            });
        }

        private void retention(Retention retention, DocumentAccess documentAccess) {
            if (retention == null) {
                return;
            }
            addHeading4("Lagringstid");
            var ret1 = text("Omfattes av virksomhetens bevarings- og kassasjonsplan: ", boolToText(retention.getRetentionPlan()));
            var ret3 = documentAccess.equals(DocumentAccess.INTERNAL) ? text("Begrunnelse: ", retention.getRetentionDescription()) : null;

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
                var name = shortNames(ListName.PURPOSE, process.getData().getPurposes()) + ": " + process.getData().getName() + " (Behandlingsnummer: " + process.getData().getNumber() + ")";
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

    private static String shortNames(ListName listName, List<String> codes) {
        return codes.stream().map(code -> shortName(listName, code)).collect(Collectors.joining(", "));
    }

    private static String shortName(ListName listName, String code) {
        return code == null ? "" : CodelistStaticService.getCodelist(listName, code).getShortName();
    }

    private static String processStatusText(ProcessData data) {
        return switch (data.getStatus()) {
            case COMPLETED -> "Ferdig dokumentert";
            case IN_PROGRESS -> "Under arbeid";
            case NEEDS_REVISION -> "Trenger revidering";
        };
    }

    private String countryName(String countryCode) {
        return Optional.ofNullable(commonCodeService.getCountry(countryCode))
                .map(CommonCodeResponse::getDescription).orElse(countryCode);
    }

}
