package no.nav.data.catalog.backend.test.component.testData;


import no.nav.data.catalog.backend.app.record.Category;
import no.nav.data.catalog.backend.app.record.Record;
import no.nav.data.catalog.backend.app.record.RecordResponse;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class RecordServiceProvider {

	private static final String ID = "Wf76gGkBCYXyZRynmzUR";
	private static final Record sivilstand = Record.builder()
			.id("1")
			.name("Sivilstand")
			.description("En overordnet kategori som beskriver en persons forhold til en annen person.")
			.category(Category.PERSONALIA)
			.sensitivity("5")
			.ownership("Ytelsesavdelingen")
			.sourceOfRecord("Folkeregisteret")
			.qualityOfData("God")
			.personalData(true)
			.recordCreationDate(LocalDate.now())
			.build();
	private static final Record inntekt = Record.builder()
			.id(ID)
			.name("Inntekt")
			.description("Inntekt rapportert inn via a-ordningen, ferdiglignet PGI fra Opptjeningsregisteret eller inntekter oppgitt av bruker som beskriver brukers inntekt forut for uttak av ytelsen.")
			.category(Category.INNTEKT_TRYGDE_OG_PENSJONSYTELSER)
			.sensitivity("5")
			.ownership("Ytelsesavdelingen")
			.sourceOfRecord("Folkeregisteret")
			.qualityOfData("God")
			.personalData(true)
			.recordCreationDate(LocalDate.now())
			.build();

	public static String getInntektId() {
		return ID;
	}

	public static String getInntektJsonString() {
		return "{\n" +
				"      \"name\": \"Inntekt\",\n" +
				"      \"description\": \"Inntekt rapportert inn via a-ordningen, ferdiglignet PGI fra Opptjeningsregisteret eller inntekter oppgitt av bruker som beskriver brukers inntekt forut for uttak av ytelsen.\",\n" +
				"      \"category\": \"INNTEKT_TRYGDE_OG_PENSJONSYTELSER\",\n" +
				"      \"sensitivity\": \"5\",\n" +
				"      \"ownership\": \"Ytelsesavdelingen\",\n" +
				"      \"sourceOfRecord\": \"Folkeregisteret\",\n" +
				"      \"qualityOfData\": \"God\",\n" +
				"      \"personalData\": true\n" +
				"    }";
	}

	public static String getFaltyJsonString() {
		return "{\n" +
				"      \"description\": \"Inntekt rapportert inn via a-ordningen, ferdiglignet PGI fra Opptjeningsregisteret eller inntekter oppgitt av bruker som beskriver brukers inntekt forut for uttak av ytelsen.\",\n" +
				"      \"category\": \"INNTEKT_TRYGDE_OG_PENSJONSYTELSER\",\n" +
				"      \"sensitivity\": \"5\",\n" +
				"      \"ownership\": \"Ytelsesavdelingen\",\n" +
				"      \"sourceOfRecord\": \"Folkeregisteret\",\n" +
				"      \"qualityOfData\": \"God\",\n" +
				"      \"personalData\": true\n" +
				"    }";
	}

	public static String getUpdateJsonString() {
		return "{\n" +
				"\t\"name\" : \"UpdateTest\",\n" +
				"\t\"description\" : \"Test at update funker\",\n" +
				"\t\"qualityOfData\": \"Superb\"\n" +
				"}";
	}

	public static Record getSivilstandRecord() {
		return sivilstand;
	}

	public static Record getInntektRecord() {
		return inntekt;
	}

	public static RecordResponse getInntektResponse() {
		Record record = getInntektRecord();
		return RecordResponse.builder()
				.id(record.getId())
				.status(String.format("Created a new record with id=%s", record.getId()))
				.build();
	}

	public static RecordResponse getUpdatedResponse() {
		Record record = getInntektRecord();
		return RecordResponse.builder()
				.id(record.getId())
				.status(String.format("Updated record with id=%s", record.getId()))
				.build();
	}

	public static RecordResponse getDeleteResponse() {
		String id = getInntektId();
		return RecordResponse.builder()
				.id(id)
				.status(String.format("Deleted record with id=%s", id))
				.build();
	}

	public static List<Record> getAllRecords() {
		List<Record> records = new ArrayList<>();
		records.add(getSivilstandRecord());
		records.add(getInntektRecord());
		return records;
	}
}

