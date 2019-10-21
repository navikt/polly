package no.nav.polly.kafka;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.polly.distributionchannel.DistributionChannelRequest;
import no.nav.polly.kafka.schema.domain.AvroSchema;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@CrossOrigin
@RequestMapping("/kafkametadata")
@Api(value = "Kafkametadata", description = "REST API for Kafkametadata", tags = {"Kafkametadata"})
public class KafkaMetadataController {

    private final KafkaMetadataService service;

    public KafkaMetadataController(KafkaMetadataService service) {
        this.service = service;
    }

    @ApiOperation(value = "Get Avroschema for topic", tags = {"Kafkametadata"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "AvroSchema fetched", response = AvroSchema.class),
            @ApiResponse(code = 404, message = "Topic not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/schema/{topic}")
    public ResponseEntity<AvroSchema> findForId(@PathVariable String topic) {
        log.info("Received request for AvroSchema for topic={}", topic);
        Optional<AvroSchema> metadata = Optional.ofNullable(service.getSchemaForTopic(topic));
        if (metadata.isEmpty()) {
            log.info("Cannot find topic={}", topic);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned AvroSchema");
        return new ResponseEntity<>(metadata.get(), HttpStatus.OK);
    }

    @ApiOperation(value = "Get DistributionChannel for topic", tags = {"Kafkametadata"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "DistributionChannel fetched", response = DistributionChannelRequest.class),
            @ApiResponse(code = 404, message = "Topic not found"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/distribution/{topic}")
    public ResponseEntity<DistributionChannelRequest> distributionChannelsForTopic(@PathVariable String topic) {
        log.info("Received request for DistributionChannel for topic={}", topic);
        Optional<DistributionChannelRequest> distributionChannelRequest = Optional.ofNullable(service.getDistributionChannelsForTopic(topic));
        if (distributionChannelRequest.isEmpty()) {
            log.info("Cannot find topic={}", topic);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned DistributionChannel");
        return new ResponseEntity<>(distributionChannelRequest.get(), HttpStatus.OK);
    }

    @ApiOperation(value = "Get Topics", tags = {"Kafkametadata"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Topics fetched", response = String.class, responseContainer = "list"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @GetMapping("/topics")
    public ResponseEntity<List<String>> listTopics() {
        return new ResponseEntity<>(service.listTopics(), HttpStatus.OK);
    }


}
