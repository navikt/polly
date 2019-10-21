package no.nav.polly.distributionchannel;

import no.nav.polly.system.System;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class DistributionChannelServiceTest {

	@InjectMocks
	private DistributionChannelService service;
	@Mock
	private DistributionChannelRepository repository;

	@Test
	void findDistribtionChannelById_shouldReturnDistributionChannel() {
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