package no.nav.data.integration.slack.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.integration.slack.domain.SlackMeldingData;
import tools.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.List;

/**
 * These classes are to be used only for interaction with external services. Otherwise, use SlackMelding or SlackMeldingData.
 */
public final class SlackDtos {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PostMessageRequest {
        private String channel = null;
        private List<Block> blocks = null;
        public static PostMessageRequest createRequest(String channel, List<SlackMeldingData.MeldingPart> parts) {
            return new PostMessageRequest(channel, convertPartsToBlocks(parts));
        }
    }

    @Data
    public static class PostMessageResponse implements Response {

        private boolean ok;
        private Double ts;
        private String error;
        @JsonProperty("response_metadata")
        private JsonNode responseMetadata;

        @Override
        public String getError() {
            return error + "\n" + JsonUtils.toJson(responseMetadata);
        }

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Block {
        private BlockType type = null;
        @JsonInclude(Include.NON_NULL)
        private Text text = null;
    }

    public enum BlockType {
        header, section, divider
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Text {
        private TextType type;
        private String text;
    }

    public enum TextType {
        mrkdwn, plain_text
    }

    public interface Response {
        boolean isOk();
        String getError();
    }

    private static List<Block> convertPartsToBlocks(List<SlackMeldingData.MeldingPart> parts) {
        List<Block> result = new ArrayList<>();
        for (SlackMeldingData.MeldingPart part : parts) {
            BlockType blockType = BlockType.valueOf(part.getPartType().name()); // This works as long as the items have the same name
            TextType textType = part.getTextType() == SlackMeldingData.TextType.markdown ? TextType.mrkdwn : TextType.plain_text;
            Text text = new Text(textType, part.getText());
            result.add(new Block(blockType, text));
        }
        return result;
    }

}

