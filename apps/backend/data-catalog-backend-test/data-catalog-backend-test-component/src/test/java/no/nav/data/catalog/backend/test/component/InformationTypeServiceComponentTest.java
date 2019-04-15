//package no.nav.data.catalog.backend.test.component;
//
//import static no.nav.data.catalog.backend.test.component.testData.InformationtypeProvider.getSivilstandJsonString;
//import static org.hamcrest.CoreMatchers.containsString;
//import static org.junit.Assert.assertThat;
//import static org.mockito.Mockito.when;
//
//import no.nav.data.catalog.backend.app.service.InformationtypeService;
//import org.junit.Rule;
//import org.junit.Test;
//import org.junit.rules.ExpectedException;
//import org.junit.runner.RunWith;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.context.junit4.SpringRunner;
//
//@RunWith(SpringRunner.class)
//@SpringBootTest(classes = ComponentTestConfig.class)
//@ActiveProfiles("test")
//public class InformationtypeServiceComponentTest {
//
//	@MockBean
//	private InformationtypeService informationtypeService;
//
//	@Rule
//	public ExpectedException expectedException = ExpectedException.none();
//
//	@Test
//	public void should_insertInformationtype_givenCorrectJsonString() {
//		when(informationtypeService.createInformationtype(getSivilstandJsonString()))
//				.thenReturn("Created a new service with id=1");
//
//		String response = informationtypeService.createInformationtype(getSivilstandJsonString());
//		assertThat(response, containsString("Created a new service"));
//	}
//
//	/**
//	@Test
//	public void shouldFailTo_InsertRecord_givenFaultyJsonString() {
//		expectedException.expect(IllegalArgumentException.class);
//
//		when(recordServiceMock.insertInformationType(getFaltyJsonString())).thenThrow(new IllegalArgumentException());
//
//		recordServiceMock.insertInformationType(getFaltyJsonString());
//	}
//
//	@Test
//	public void should_getRecordById_givenIdToExistingDocument() {
//		when(recordServiceMock.getInformationTypeById(getInntektId())).thenReturn(getSivilstandRecord());
//
//		Record record = recordServiceMock.getInformationTypeById(getInntektId());
//		assertEquals(record, getSivilstandRecord());
//	}
//
//	@Test
//	public void shouldNot_getRecordById_givenIdToNonExistingDocument() {
//		String idToNonExistingDocument = "6543";
//
//		expectedException.expect(DocumentNotFoundException.class);
//		expectedException.expectMessage(String.format("Could not find a document to retrieve, document id=%s", idToNonExistingDocument));
//
//		when(recordServiceMock.getInformationTypeById(idToNonExistingDocument)).thenThrow(
//				new DocumentNotFoundException(String.format(
//						"Could not find a document to retrieve, document id=%s",
//						idToNonExistingDocument)));
//
//		recordServiceMock.getInformationTypeById(idToNonExistingDocument);
//	}
//
//	@Test
//	public void should_updateFieldsById_givenIdToExistingDocument() {
//		String updateString = getUpdateJsonString();
//		when(recordServiceMock.updateInformationTypeById(getInntektId(), updateString)).thenReturn(getUpdatedResponse());
//
//		RecordResponse recordResponse = recordServiceMock.updateInformationTypeById(getInntektId(), updateString);
//		assertEquals(recordResponse, getUpdatedResponse());
//		assertEquals(recordResponse.getStatus(), String.format("Updated record with id=%s", getInntektId()));
//	}
//
//	@Test
//	public void shouldNot_updateFieldsById_givenIdToNonExistingDocument() {
//		String idToNonExistingDocument = "6543";
//
//		expectedException.expect(DocumentNotFoundException.class);
//		expectedException.expectMessage(String.format("Could not find a document to update, document id=%s", idToNonExistingDocument));
//
//		when(recordServiceMock.updateInformationTypeById(idToNonExistingDocument, getUpdateJsonString())).thenThrow(
//				new DocumentNotFoundException(String.format(
//						"Could not find a document to update, document id=%s",
//						idToNonExistingDocument)));
//
//		recordServiceMock.updateInformationTypeById(idToNonExistingDocument, getUpdateJsonString());
//	}
//
//	@Test
//	public void should_deleteRecordById_givenIdToExistingDocument() {
//		when(recordServiceMock.deleteInformationTypeById(getInntektId())).thenReturn(getDeleteResponse());
//
//		RecordResponse recordResponse = recordServiceMock.deleteInformationTypeById(getInntektId());
//		assertEquals(recordResponse, getDeleteResponse());
//		assertEquals(recordResponse.getStatus(), String.format("Deleted record with id=%s", getInntektId()));
//	}
//
//	@Test
//	public void shouldNot_deleteRecordById_givenIdToNonExistingDocument() {
//		String idToNonExistingDocument = "6543";
//
//		expectedException.expect(DocumentNotFoundException.class);
//		expectedException.expectMessage(String.format("Could not find a document to delete, document id=%s", idToNonExistingDocument));
//
//		when(recordServiceMock.deleteInformationTypeById(idToNonExistingDocument)).thenThrow(
//				new DocumentNotFoundException(String.format(
//						"Could not find a document to delete, document id=%s",
//						idToNonExistingDocument)));
//
//		recordServiceMock.deleteInformationTypeById(idToNonExistingDocument);
//	}
//
//	@Test
//	public void should_getAllRecords() {
//		when(recordServiceMock.getAllRecords()).thenReturn(getAllRecords());
//
//		List<Record> records = recordServiceMock.getAllRecords();
//		assertThat(records.size(), is(2));
//		assertThat(records.get(0), is(getSivilstandRecord()));
//		assertThat(records.get(1), is(getInntektRecord()));
//	}
//
//	*/
//}
