package no.nav.data.catalog.backend.app.distributionchannel;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.common.rest.PageParameters;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.system.System;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(DistributionChannelController.class)
@ContextConfiguration(classes = {AppStarter.class})
@ActiveProfiles("test")
class DistributionChannelControllerTest {

    @MockBean
    private DistributionChannelRepository repository;

    @MockBean
    private DistributionChannelService service;

    @Autowired
    private MockMvc mvc;

    private final DistributionChannelRequest distributionChannelRequest = DistributionChannelRequest.builder()
            .name("distributionChannelName")
            .description("description")
            .producers(Collections.singletonList("producer"))
            .consumers(Collections.singletonList("consumer"))
            .build();

    private final DistributionChannel distributionChannel = DistributionChannel.builder()
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

    @Test
    void getDistributionChannelById_shouldGetDistributionChannel_whenIdExists() throws Exception {
        when(repository.findById(distributionChannel.getId())).thenReturn(Optional.of(distributionChannel));
        mvc.perform(get("/distributionchannel/" + distributionChannel.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(distributionChannel.getId().toString()))
                .andExpect(jsonPath("$.name").value("distributionChannelName"));
    }

    @Test
    void getDistributionChannelById_shouldThrowNotFound_whenIdDoesNotExists() throws Exception {
        when(service.findDistributionChannelById(any(UUID.class))).thenReturn(Optional.empty());

        mvc.perform(get("/distributionchannel/" + distributionChannel.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllDistributionChannel_shouldGetPagedList_whenRequestContainsPageInformation() throws Exception {
        List<DistributionChannel> distributionChannels = List.of(distributionChannel);
        Pageable pageable = PageRequest.of(0, 20);

        Page<DistributionChannel> distributionChannelPage = new PageImpl<>(distributionChannels, pageable, 1);
        Page<DistributionChannelResponse> pagedResponse = distributionChannelPage.map(DistributionChannel::convertToResponse);

        PageParameters pageParameters = new PageParameters();
        when(service.getAllDistributionChannels(pageParameters.createIdSortedPage())).thenReturn(pagedResponse);

        mvc.perform(get("/distributionchannel")
                .contentType(MediaType.APPLICATION_JSON)
                .content(JsonUtils.toJson(new PageParameters())))
                .andExpect(status().isOk());
    }

    @Test
    void countAllDistributionChannels() throws Exception {
        when(repository.count()).thenReturn(20L);

        mvc.perform(get("/distributionchannel/count"))
                .andExpect(status().isOk())
                .andExpect(content().string("20"));
    }

    @Test
    void createDistributionChannels_shouldCreateNewDistributionChannel_withValidRequest() throws Exception {
        List<DistributionChannel> distributionChannels = List.of(distributionChannel);
        List<DistributionChannelRequest> requests = List.of(distributionChannelRequest);

        when(repository.saveAll(distributionChannels)).thenReturn(distributionChannels);
        when(service.createDistributionChannels(requests)).thenReturn(distributionChannels);

        mvc.perform(post("/distributionchannel")
                .contentType(MediaType.APPLICATION_JSON)
                .content(JsonUtils.toJson(requests)))
                .andExpect(status().isCreated());
    }

    @Test
    void deleteDistributionChannelBYId_shouldDeleteDistributionChannel_whenIdExist() throws Exception {
        DistributionChannel toBeDeletedDChannel = DistributionChannel.builder()
                .id(UUID.randomUUID())
                .name("toBeDeletedDChannel")
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

        when(service.findDistributionChannelById(toBeDeletedDChannel.getId())).thenReturn(Optional.of(toBeDeletedDChannel));
        when(service.deleteDistributionChannel(toBeDeletedDChannel)).thenReturn(toBeDeletedDChannel);

        mvc.perform(delete("/distributionchannel/" + toBeDeletedDChannel.getId())).andExpect(status().isAccepted());
    }
}
