package no.nav.data.polly.bigquery;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.BigQueryException;
import com.google.cloud.bigquery.BigQueryOptions;
import com.google.cloud.bigquery.QueryJobConfiguration;
import com.google.cloud.bigquery.TableResult;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;


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
                    + projectId1
                    + "."
                    + datasetName1
                    + "."
                    + tableName1
                    + "`"
                    + " LIMIT 10";

    public void queryBigquery(String query) {
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream(getClass().getClassLoader().getResource("teamdatajegerne-prod-c8b1-ff4f59e3edd0.json").getPath()));
            BigQuery bigquery = BigQueryOptions.newBuilder().setCredentials(credentials).build().getService();

            QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(query).build();

            TableResult results = bigquery.query(queryConfig);

            results
                    .iterateAll()
                    .forEach(row -> row.forEach(val -> System.out.printf("%s,", val.toString())));

            System.out.println("Query performed successfully.");
        } catch (BigQueryException | InterruptedException | IOException e) {
            System.out.println("Query not performed \n" + e.toString());
        }
    }

    public String getDatasetName() {
        return datasetName;
    }
}
