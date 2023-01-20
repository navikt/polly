package no.nav.data.polly.bigquery.queryService;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.BigQueryException;
import com.google.cloud.bigquery.BigQueryOptions;
import com.google.cloud.bigquery.Field;
import com.google.cloud.bigquery.QueryJobConfiguration;
import com.google.cloud.bigquery.Schema;
import com.google.cloud.bigquery.TableResult;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.bigquery.domain.AaregAvtale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class AaregAvtaleQueryService {

    @Value("${BIGQUERY_AAREG_DATASETNAME}")
    private String projectId;

    @Value("${BIGQUERY_AAREG_PROJECTID}")
    private String datasetName;

    @Value("${BIGQUERY_AAREG_TABLENAME}")
    private String tableName;

    public String getByAvtaleIdQuery(String id) {
        return "SECELT * FROM `"  + projectId + "." + datasetName + "." + tableName + "` WHERE avtalenummer = " + id;
    }


    public AaregAvtale getByAvtaleId(String id) {
        List<AaregAvtale> aaregAvtaleList = new ArrayList<>();
        try {
            BigQuery bigquery = BigQueryOptions.getDefaultInstance().getService();
            QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(getByAvtaleIdQuery(id)).build();

            TableResult results = bigquery.query(queryConfig);
            Schema schema = results.getSchema();
            results
                    .iterateAll()
                    .forEach(row -> {
                        Map<String, String> mappedBiqQueryTable = new HashMap<>();
                        for(Field field : schema.getFields()) {
                            mappedBiqQueryTable.put(field.getName(), (String) row.get(field.getName()).getValue());
                        }
                        ObjectMapper mapper = new ObjectMapper();
                        aaregAvtaleList.add(mapper.convertValue(mappedBiqQueryTable, AaregAvtale.class));
                    });

            log.info("Query performed successfully.");
        } catch (BigQueryException | InterruptedException e) {
            log.error("Query not performed \n" + e.toString());
        }

        if(aaregAvtaleList.size() >0) {
            return aaregAvtaleList.get(0);
        }
        else {
            return null;
        }
    }
}
