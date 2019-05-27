package no.nav.data.catalog.backend.app.informationtype;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InformationTypeResponseEntity {

	private List<InformationTypeResponse> content = new ArrayList<>();
	private Long currentPage = 0L;  //TODO: Implement pagination
	private Long pageSize= 0L;
	private Long totalElements= 0L;
}

