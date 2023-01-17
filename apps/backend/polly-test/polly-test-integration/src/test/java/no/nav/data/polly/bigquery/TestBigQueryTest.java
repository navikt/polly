package no.nav.data.polly.bigquery;

import no.nav.data.polly.IntegrationTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.jupiter.api.Assertions.*;

class TestBigQueryTest extends IntegrationTestBase {

    TestBigQuery testBigQuery = new TestBigQuery();

    @Test
    public void test(){
        testBigQuery.queryBigquery(testBigQuery.query);
        System.out.println(System.getenv("GOOGLE_APPLICATION_CREDENTIALS"));
//        assertEquals(testBigQuery.getDatasetName(),"Etterlevelse_Publisering");
    }
}