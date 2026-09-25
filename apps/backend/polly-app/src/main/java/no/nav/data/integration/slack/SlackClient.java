package no.nav.data.integration.slack;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.TechnicalException;
import no.nav.data.common.security.SecurityProperties;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.integration.slack.domain.SlackMeldingData;
import no.nav.data.integration.slack.dto.SlackDtos;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.env.Environment;
import org.springframework.web.util.DefaultUriBuilderFactory;


import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class SlackClient {

    private final RestTemplate restTemplate;
    private final SecurityProperties securityProperties;

    private static final String POST_MESSAGE = "/chat.postMessage";

    @Autowired
    private Environment env;

    private static final int MAX_PARTS_PER_MESSAGE = 50;
    private static final int MAX_CHARS_PER_PART = 3000;


    public SlackClient(SecurityProperties securityProperties, SlackProperties properties) {
        this.securityProperties = securityProperties;

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setUriTemplateHandler(new DefaultUriBuilderFactory(properties.getBaseUrl()));
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().set(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getToken());
            return execution.execute(request, body);
        });
        this.restTemplate = restTemplate;
    }

    public void sendMessageToChannel(String channel, List<SlackMeldingData.MeldingPart> parts) {
        try {
            List<List<SlackMeldingData.MeldingPart>> partitions = ListUtils.partition(splitLongParts(parts), MAX_PARTS_PER_MESSAGE);

            String channelToRecieve = securityProperties.isDev() ? env.getProperty("client.devmail.slack-channel-id") : channel;

            partitions.forEach(partition -> doSendMessageToChannel(channelToRecieve, partition));

        } catch (Exception e) {
            throw new TechnicalException("Failed to send message to " + channel + " " + JsonUtils.toJson(parts), e);
        }
    }

    private List<SlackMeldingData.MeldingPart> splitLongParts(List<SlackMeldingData.MeldingPart> parts) {
        var newParts = new ArrayList<SlackMeldingData.MeldingPart>();
        for (SlackMeldingData.MeldingPart part : parts) {
            if (part.getText() == null || part.getText().length() <= MAX_CHARS_PER_PART) {
                newParts.add(part);
            } else {
                var text = part.getText();
                var lines = StringUtils.splitPreserveAllTokens(text, StringUtils.LF);
                var sb = new StringBuilder(StringUtils.LF);
                for (String line : lines) {
                    if (sb.length() + line.length() >= MAX_CHARS_PER_PART) {
                        newParts.add(part.withText(sb.toString()));
                        sb = new StringBuilder(StringUtils.LF);
                    }
                    sb.append(line).append(StringUtils.LF);
                }
                newParts.add(part.withText(sb.toString()));
            }
        }
        return newParts;
    }

    private void doSendMessageToChannel(String channel, List<SlackMeldingData.MeldingPart> parts) {
        try {
            log.info("Sending slack message to {}", channel);
            if (securityProperties.isDev()) {
                parts.add(0, SlackMeldingData.MeldingPart.header("[DEV]"));
            }
            var request = SlackDtos.PostMessageRequest.createRequest(channel, parts);
            var response = restTemplate.postForEntity(POST_MESSAGE, request, SlackDtos.PostMessageResponse.class);
            checkResponse(response);
        } catch (Exception e) {
            throw new TechnicalException("Failed to send message to channel " + channel, e);
        }
    }

    private <T extends SlackDtos.Response> T checkResponse(ResponseEntity<T> response) {
        Assert.notNull(response.getBody(), "empty body");
        Assert.isTrue(response.getBody().isOk(), "Not ok error: " + response.getBody().getError());
        return response.getBody();
    }
}
