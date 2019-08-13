package no.nav.data.catalog.backend.app.distributionchannel;

import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRepository;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelService;
import no.nav.data.catalog.backend.app.system.System;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
@ActiveProfiles("test")
public class DistributionChannelServiceTest {

	@InjectMocks
	private DistributionChannelService service;
	@Mock
	private DistributionChannelRepository repository;

	@Test
	public void findDistribtionChannelById_shouldReturnDistributionChannel() {
		DistributionChannel distributionChannel = DistributionChannel.builder()
				.id(UUID.randomUUID())
				.name("Distribution")
				.description("Description")
				.producers(Set.of(System.builder()
						.id(UUID.randomUUID())
						.name("producer")
						.build()))
				.consumers(Set.of(System.builder()
						.id(UUID.randomUUID())
						.name("consumer")
						.build()))
				.build();

		when(repository.findById(distributionChannel.getId())).thenReturn(Optional.of(distributionChannel));

		service.findDistributionChannelById(distributionChannel.getId());

		verify(repository, times(1)).findById(any(UUID.class));
	}
}