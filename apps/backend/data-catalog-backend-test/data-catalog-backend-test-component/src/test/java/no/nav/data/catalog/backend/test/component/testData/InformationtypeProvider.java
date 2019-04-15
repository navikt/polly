//package no.nav.data.catalog.backend.test.component.testData;
//
//
//import no.nav.data.catalog.backend.app.informationtype.InformationType;
//
//import java.time.LocalDate;
//
//public class InformationtypeProvider {
//
//	public static String getSivilstandJsonString() {
//		return "{\n" +
//				"      \"name\": \"sivilstand\",\n" +
//				"      \"createdBy\": Mårten Elmgren\n" +
//				"    }";
//	}
//
//
//	private static InformationType sivilstand = InformationType.builder()
//			.id(1L)
//			.functionalId("gTkIxmkBJh6v6nYA9I_r")
//			.name("sivilstand")
//			.dateCreated(LocalDate.of(2019, 3, 28))
//			.createdBy("Mårten Elmgren")
//			.synchedToElasticsearch(false)
//			.build();
//
//	public static InformationType getSivilstand(){
//		return sivilstand;
//	}
//}
