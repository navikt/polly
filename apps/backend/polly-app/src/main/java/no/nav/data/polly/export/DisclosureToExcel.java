package no.nav.data.polly.export;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.disclosure.DisclosureService;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.dto.DisclosureResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DisclosureToExcel {

    private final DisclosureService disclosureService;

    public ByteArrayOutputStream generateExcelForAllDisclosure() {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            var sheet = workbook.createSheet("Utlevering export");
            List<DisclosureResponse> disclosureList = disclosureService.getAllDisclosures().stream().map(Disclosure::convertToResponse).toList();

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] headers = {"UUID", "Navn", "Mottaker", "Formål med utlevering",
                                "Ytterligere beskrivelse", "Relaterte behandling UUIDs",
                                "Opplysningstyper UUIDs", "Dokument UUIDs",
                                "Behandlingsgrunnlag for hele behandlingen",
                                "Utleveres personopplysningene til utlandet?",
                                "Hjemmel for unntak fra taushetsplikt er vurdert",
                                "Hjemmel for unntak fra taushetsplikt, og ev. referanse til vurderingen",
                                "Avdeling", "Team"};

            var headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIndex = 1;
            for (DisclosureResponse disclosure : disclosureList) {
                var row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(disclosure.getId().toString());
                row.createCell(1).setCellValue(disclosure.getName());
                row.createCell(2).setCellValue(disclosure.getRecipient().getShortName());
                row.createCell(3).setCellValue(disclosure.getRecipientPurpose());
                row.createCell(4).setCellValue(disclosure.getDescription());
                row.createCell(5).setCellValue(disclosure.getProcessIds().toString());
                row.createCell(6).setCellValue(disclosure.getInformationTypeIds().toString());
                row.createCell(7).setCellValue(disclosure.getDocumentId() != null ? disclosure.getDocumentId().toString() : "");
                row.createCell(8).setCellValue(disclosure.getLegalBases().stream().sorted(Comparator.comparing(lb -> lb.getGdpr().getShortName())).map(lb -> lb.getGdpr().getShortName()).toList().toString());
                row.createCell(9).setCellValue(Boolean.TRUE.equals(disclosure.getAbroad().getAbroad()) ? "Ja" : "Nei");
                row.createCell(10).setCellValue(disclosure.getAssessedConfidentiality() != null ? disclosure.getAssessedConfidentiality().toString() : "Ikke angitt");
                row.createCell(11).setCellValue(disclosure.getConfidentialityDescription() != null ? disclosure.getConfidentialityDescription() : "Ikke angitt");
                row.createCell(12).setCellValue(disclosure.getNomDepartmentName() != null ? disclosure.getNomDepartmentName() : "");
                row.createCell(13).setCellValue(disclosure.getProductTeams() != null ? String.join(", ", disclosure.getProductTeams()) : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            log.info("Excel file generated successfully!");
            return out;
        } catch (IOException e) {
            log.error("Error creating Excel file: {}", e.getMessage());
        }
        return null;
    }

}
