package no.nav.data.catalog.backend.app.informationtype;

import static no.nav.data.catalog.backend.app.codelist.CodelistService.codelists;

import lombok.Data;
import no.nav.data.catalog.backend.app.codelist.CodelistResponse;
import no.nav.data.catalog.backend.app.codelist.ListName;

@Data
public class InformationTypeResponse {

	private String elasticsearchId;  //TODO: Do we need this?
	private Long informationTypeId;
	private String name;
	private String description;
	private CodelistResponse category;
	private CodelistResponse producer;
	private CodelistResponse system;
	private Boolean personalData;
	private String createdBy;
	private String createdDate;
	private String lastModifiedBy;
	private String lastModifiedDate;


	public InformationTypeResponse(InformationType informationType) {
		this.elasticsearchId = informationType.getElasticsearchId();
		this.informationTypeId = informationType.getId();
		this.name = informationType.getName();
		this.description = informationType.getDescription();
		this.category = CodelistResponse.builder()
				.code(informationType.getCategory())
				.description(codelists.get(ListName.CATEGORY).get(informationType.getCategory()))
				.build();
		this.producer = CodelistResponse.builder()
				.code(informationType.getProducer())
				.description(codelists.get(ListName.PRODUCER).get(informationType.getProducer()))
				.build();
		this.system = CodelistResponse.builder()
				.code(informationType.getSystem())
				.description(codelists.get(ListName.SYSTEM).get(informationType.getSystem()))
				.build();
		this.personalData = informationType.isPersonalData();
		this.createdBy = informationType.getCreatedBy();
		this.createdDate = informationType.getCreatedDate().toString();
		this.lastModifiedBy = informationType.getLastModifiedBy();
		this.lastModifiedDate = informationType.getLastModifiedDate().toString();
	}
}
