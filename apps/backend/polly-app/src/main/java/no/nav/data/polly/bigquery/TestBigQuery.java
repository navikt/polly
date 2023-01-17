package no.nav.data.polly.bigquery;

import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.BigQueryException;
import com.google.cloud.bigquery.BigQueryOptions;
import com.google.cloud.bigquery.QueryJobConfiguration;
import com.google.cloud.bigquery.TableResult;



public class TestBigQuery {
    String projectId = "teamdatajegerne-prod-c8b1";
    String datasetName = "Etterlevelse_Publisering";
    String tableName = "Etterlevelse";
    String query =
            "SELECT *\n"
                    + " FROM `"
                    + projectId
                    + "."
                    + datasetName
                    + "."
                    + tableName
                    + "`"
                    + " LIMIT 10";

    public void queryBigquery(String query) {
        try {
            BigQuery bigquery = BigQueryOptions.getDefaultInstance().getService();

            QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(query).build();

            TableResult results = bigquery.query(queryConfig);

            results
                    .iterateAll()
                    .forEach(row -> row.forEach(val -> System.out.printf("%s,", val.toString())));

            System.out.println("Query performed successfully.");
        } catch (BigQueryException | InterruptedException e) {
            System.out.println("Query not performed \n" + e.toString());
        }
    }

    public String getDatasetName() {
        return datasetName;
    }
}
