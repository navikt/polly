package no.nav.data.polly.bigquery;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.BigQueryException;
import com.google.cloud.bigquery.BigQueryOptions;
import com.google.cloud.bigquery.Field;
import com.google.cloud.bigquery.QueryJobConfiguration;
import com.google.cloud.bigquery.Schema;
import com.google.cloud.bigquery.TableResult;
import no.nav.data.polly.bigquery.domain.EtterlevelseData;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class TestBigQuery {

    String projectId = "teamdatajegerne-prod-c8b1";
    String datasetName = "Etterlevelse_Publisering";
    String tableName = "Etterlevelse";

    String projectId1= "teamcrm-prod-31a7";
    String datasetName1 = "aareg_avtaler";
    String tableName1 = "aareg_avtaler_for_tilgang";
    String query =
            "SELECT * "
                    + " FROM `"
                    + projectId
                    + "."
                    + datasetName
                    + "."
                    + tableName
                    + "`"
                    + " LIMIT 10";

    public List<EtterlevelseData> queryBigquery(String query) {
        List<EtterlevelseData> etterlevelseDataList = new ArrayList<>();

        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream(getClass().getClassLoader().getResource("teamdatajegerne-prod-c8b1-ff4f59e3edd0.json").getPath()));
            BigQuery bigquery = BigQueryOptions.newBuilder().setCredentials(credentials).build().getService();

            QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(query).build();

            TableResult results = bigquery.query(queryConfig);
            Schema schema = results.getSchema();
            results
                    .iterateAll()
                    .forEach(row -> {
                        Map<String, String> m = new HashMap<>();
                        for(Field field : schema.getFields()) {
                            m.put(field.getName(), (String) row.get(field.getName()).getValue());
                        }
                        ObjectMapper mapper = new ObjectMapper();
                        etterlevelseDataList.add(mapper.convertValue(m, EtterlevelseData.class));
                    });

            System.out.println(etterlevelseDataList);

            System.out.println("Query performed successfully.");
        } catch (BigQueryException | InterruptedException | IOException e) {
            System.out.println("Query not performed \n" + e.toString());
        }
        return  etterlevelseDataList;
    }

    public String getDatasetName() {
        return datasetName;
    }
}
