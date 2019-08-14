package no.nav.data.catalog.backend.app.distributionchannel;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.dataset.DatasetController;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import no.nav.data.catalog.backend.app.informationtype.RestResponsePage;
import no.nav.data.catalog.backend.app.system.System;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(DistributionChannelController.class)
@ContextConfiguration(classes = {AppStarter.class})
@ActiveProfiles("test")
public class DistributionChannelControllerTest {

    @MockBean
    private DistributionChannelRepository repository;

    @MockBean
    private DistributionChannelService service;

    @Autowired
    private MockMvc mvc;

    private ObjectMapper objectMapper = JsonUtils.getObjectMapper();

    private DistributionChannelRequest distributionChannelRequest = DistributionChannelRequest.builder()
            .name("distributionChannelName")
            .description("description")
            .producers(Set.of(System.builder()
                    .id(UUID.randomUUID())
                    .name("producer")
                    .build()))
            .consumers(Set.of(System.builder()
                    .id(UUID.randomUUID())
                    .name("consumer")
                    .build()))
            .build();

    private DistributionChannel distributionChannel = DistributionChannel.builder()
            .id(UUID.randomUUID())
            .name("distributionChannelName")
            .description("description")
            .producers(Set.of(System.builder()
                    .id(UUID.randomUUID())
                    .name("producer")
                    .build()))
            .consumers(Set.of(System.builder()
                    .id(UUID.randomUUID())
                    .name("consumer")
                    .build()))
            .build();

    // ResponseEntity getDistributionChannelById(@PathVariable UUID uuid) {
    @Test
    public void getDistributionChannelById_shouldGetDistributionChannel_whenIdExists() throws Exception {
        when(repository.findById(distributionChannel.getId())).thenReturn(Optional.of(distributionChannel));
        mvc.perform(get("/distributionchannel/" + distributionChannel.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(distributionChannel.getId().toString()))
                .andExpect(jsonPath("$.name").value("distributionChannelName"));
    }

    @Test
    public void getDistributionChannelById_shouldThrowNotFound_whenIdDoesNotExists() throws Exception {
        when(service.findDistributionChannelById(any(UUID.class))).thenReturn(Optional.empty());

        mvc.perform(get("/distributionchannel/" + distributionChannel.getId()))
                .andExpect(status().isNotFound());
    }

    // RestResponsePage<DistributionChannelResponse> getAllDistributionChannel(@RequestParam Map<String, String> queryMap) {
    //TODO: Fix this test
    @Ignore
    @Test
    public void getAllDistributionChannel_shouldGetPagedList_whenRequestContainsPageInformation() {
        List<DistributionChannel> distributionChannels = List.of(distributionChannel);
        Pageable pageable = PageRequest.of(0, 20);

        Page<DistributionChannel> distributionChannelPage = new PageImpl<>(distributionChannels, pageable, 1);
//        RestResponsePage<DistributionChannelResponse> pagedResponse =
//                new RestResponsePage<DistributionChannelResponse>(distributionChannelPage.getContent(), distributionChannelPage.getPageable(), distributionChannelPage.getTotalElements());

        when(repository.findAll((Specification<DistributionChannel>) null, pageable)).thenReturn(distributionChannelPage);
//        when(service.getAllDistributionChannelsByQuery(anyMap())).thenReturn(distributionChannelPage);
    }

    // Long countAllDistributionChannels() {
    @Test
    public void countAllDistributionChannels() throws Exception {
        when(repository.count()).thenReturn(20L);

        mvc.perform(get("/distributionchannel/count"))
                .andExpect(status().isOk())
                .andExpect(content().string("20"));
    }

    // List<DistributionChannelResponse> createDistributionChannels(@RequestBody List<DistributionChannelRequest> requests) {
    @Test
    public void createDistributionChannels_shouldCreateNewDistributionChannel_withValidRequest() throws Exception {
        List<DistributionChannel> distributionChannels = List.of(distributionChannel);
        List<DistributionChannelRequest> requests = List.of(distributionChannelRequest);
        List<DistributionChannelResponse> responses = List.of(new DistributionChannelResponse(distributionChannel));

        when(repository.saveAll(distributionChannels)).thenReturn(distributionChannels);
        when(service.createDistributionChannels(requests)).thenReturn(responses);

        mvc.perform(post("/distributionchannel")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requests)))
                .andExpect(status().isAccepted());
    }

    // ResponseEntity deleteDistributionChannelById(@PathVariable UUID id) {
}
