package no.nav.data.catalog.backend.test.component;

import static no.nav.data.catalog.backend.test.component.testData.RecordServiceProvider.getAllRecords;
import static no.nav.data.catalog.backend.test.component.testData.RecordServiceProvider.getDeleteResponse;
import static no.nav.data.catalog.backend.test.component.testData.RecordServiceProvider.getFaltyJsonString;
import static no.nav.data.catalog.backend.test.component.testData.RecordServiceProvider.getInntektId;
import static no.nav.data.catalog.backend.test.component.testData.RecordServiceProvider.getInntektJsonString;
import static no.nav.data.catalog.backend.test.component.testData.RecordServiceProvider.getInntektRecord;
import static no.nav.data.catalog.backend.test.component.testData.RecordServiceProvider.getInntektResponse;
import static no.nav.data.catalog.backend.test.component.testData.RecordServiceProvider.getSivilstandRecord;
import static no.nav.data.catalog.backend.test.component.testData.RecordServiceProvider.getUpdateJsonString;
import static no.nav.data.catalog.backend.test.component.testData.RecordServiceProvider.getUpdatedResponse;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

import no.nav.data.catalog.backend.app.common.exceptions.DocumentNotFoundException;
import no.nav.data.catalog.backend.app.record.Record;
import no.nav.data.catalog.backend.app.record.RecordResponse;
import no.nav.data.catalog.backend.app.record.RecordService;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ComponentTestConfig.class)
@ActiveProfiles("test")
public class RecordServiceSpringComponentTest {

	@MockBean
	private RecordService recordServiceMock;

	@Rule
	public ExpectedException expectedException = ExpectedException.none();

	@Test
	public void should_insertRecord_givenCorrectJsonString() {
		when(recordServiceMock.insertRecord(getInntektJsonString())).thenReturn(getInntektResponse());

		RecordResponse recordResponse = recordServiceMock.insertRecord(getInntektJsonString());
		assertEquals(recordResponse.getStatus(), String.format("Created a new record with id=%s", getInntektId()));
	}

	@Test
	public void shouldFailToInsertRecord_givenFaultyJsonString() {
		expectedException.expect(IllegalArgumentException.class);

		when(recordServiceMock.insertRecord(getFaltyJsonString())).thenThrow(new IllegalArgumentException());

		recordServiceMock.insertRecord(getFaltyJsonString());
	}

	@Test
	public void should_getRecordById_givenIdToExistingDocument() {
		when(recordServiceMock.getRecordById(getInntektId())).thenReturn(getSivilstandRecord());

		Record record = recordServiceMock.getRecordById(getInntektId());
		assertEquals(record, getSivilstandRecord());
	}

	@Test
	public void shouldNot_getRecordById_givenIdToNonExistingDocument() {
		String idToNonExistingDocument = "6543";

		expectedException.expect(DocumentNotFoundException.class);
		expectedException.expectMessage(String.format("Could not find a document to retrieve, document id=%s", idToNonExistingDocument));

		when(recordServiceMock.getRecordById(idToNonExistingDocument)).thenThrow(
				new DocumentNotFoundException(String.format(
						"Could not find a document to retrieve, document id=%s",
						idToNonExistingDocument)));

		recordServiceMock.getRecordById(idToNonExistingDocument);
	}

	@Test
	public void should_updateFieldsById_givenIdToExistingDocument() {
		String updateString = getUpdateJsonString();
		when(recordServiceMock.updateFieldsById(getInntektId(), updateString)).thenReturn(getUpdatedResponse());

		RecordResponse recordResponse = recordServiceMock.updateFieldsById(getInntektId(), updateString);
		assertEquals(recordResponse, getUpdatedResponse());
		assertEquals(recordResponse.getStatus(), String.format("Updated record with id=%s", getInntektId()));
	}

	@Test
	public void shouldNot_updateFieldsById_givenIdToNonExistingDocument() {
		String idToNonExistingDocument = "6543";

		expectedException.expect(DocumentNotFoundException.class);
		expectedException.expectMessage(String.format("Could not find a document to update, document id=%s", idToNonExistingDocument));

		when(recordServiceMock.updateFieldsById(idToNonExistingDocument, getUpdateJsonString())).thenThrow(
				new DocumentNotFoundException(String.format(
						"Could not find a document to update, document id=%s",
						idToNonExistingDocument)));

		recordServiceMock.updateFieldsById(idToNonExistingDocument, getUpdateJsonString());
	}

	@Test
	public void should_deleteRecordById_givenIdToExistingDocument() {
		when(recordServiceMock.deleteRecordById(getInntektId())).thenReturn(getDeleteResponse());

		RecordResponse recordResponse = recordServiceMock.deleteRecordById(getInntektId());
		assertEquals(recordResponse, getDeleteResponse());
		assertEquals(recordResponse.getStatus(), String.format("Deleted record with id=%s", getInntektId()));
	}

	@Test
	public void shouldNot_deleteRecordById_givenIdToNonExistingDocument() {
		String idToNonExistingDocument = "6543";

		expectedException.expect(DocumentNotFoundException.class);
		expectedException.expectMessage(String.format("Could not find a document to delete, document id=%s", idToNonExistingDocument));

		when(recordServiceMock.deleteRecordById(idToNonExistingDocument)).thenThrow(
				new DocumentNotFoundException(String.format(
						"Could not find a document to delete, document id=%s",
						idToNonExistingDocument)));

		recordServiceMock.deleteRecordById(idToNonExistingDocument);
	}

	@Test
	public void should_getAllRecords() {
		when(recordServiceMock.getAllRecords()).thenReturn(getAllRecords());

		List<Record> records = recordServiceMock.getAllRecords();
		assertThat(records.size(), is(2));
		assertThat(records.get(0), is(getSivilstandRecord()));
		assertThat(records.get(1), is(getInntektRecord()));
	}


}
