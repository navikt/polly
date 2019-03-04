package no.nav.data.catalog.backend.app.common.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;

/**
 * @author Ugur Alpay Cenar, Visma Consulting.
 */
@Slf4j
public class ConverterUtils {

    private ConverterUtils() {
        throw new IllegalStateException("Utility class");
    }

    public static <T extends Enum<T>> T stringToEnum(String value, Class<T> clazz) {
        if (value == null) {
            return null;
        }

        return Enum.valueOf(clazz, value);
    }

    public static String objectToJsonString(Object object) {
        ObjectMapper mapper = new ObjectMapper();

        try {
            return mapper.writeValueAsString(object);
        } catch (IOException e) {
            return null;
        }
    }

    public static <T> T jsonStringToObject(String jsonString, Class<T> tClass) {
        ObjectMapper mapper = new ObjectMapper();

        try {

            // Reformat jsonString from FitNesse test
            if (jsonString.startsWith("\"") && jsonString.endsWith("\"")) {
                jsonString = jsonString.substring(1, jsonString.length() - 1);
                jsonString = jsonString.replaceAll(";", ":");
                jsonString = jsonString.replaceAll("\\(", "[");
                jsonString = jsonString.replaceAll("\\)", "]");
            }

            return mapper.readValue(jsonString, tClass);
        } catch (IOException e) {
            throw new DataCatalogBackendTechnicalException(String.format("Feilet ved lesing av jsonString=%s, feilmelding=%s", jsonString, e
                    .getMessage()), e);
        }

    }

    public static <T> List<T> jsonStringToObjectList(String jsonString, Class<T> tClass) {
        ObjectMapper mapper = new ObjectMapper();

        try {
            return mapper.readValue(jsonString, mapper.getTypeFactory().constructCollectionType(List.class, tClass));
        } catch (IOException e) {
            throw new DataCatalogBackendTechnicalException(e.getMessage(), e);
        }

    }

    public static String getValueFromJsonString(String body, String parameter) {
        JSONObject jsonObject = convertJsonStringToJsonObject(body);
        return jsonObject == null ? body : (String) jsonObject.get(parameter);
    }

    public static JSONObject convertJsonStringToJsonObject(String body) {
        try {
            return (JSONObject) new JSONParser(body).parse();
        } catch (Exception e) {
            return null;
        }
    }

}
