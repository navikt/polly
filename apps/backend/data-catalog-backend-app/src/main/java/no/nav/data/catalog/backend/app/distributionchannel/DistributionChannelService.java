package no.nav.data.catalog.backend.app.distributionchannel;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendNotFoundException;
import no.nav.data.catalog.backend.app.system.System;
import no.nav.data.catalog.backend.app.system.SystemRepository;
import no.nav.data.catalog.backend.app.system.SystemRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.safeStream;

@Slf4j
@Service
@Transactional
public class DistributionChannelService {

	private final DistributionChannelRepository repository;
	private final SystemRepository systemRepository;

	public DistributionChannelService(DistributionChannelRepository repository, SystemRepository systemRepository) {
		this.repository = repository;
		this.systemRepository = systemRepository;
	}

	public Optional<DistributionChannel> findDistributionChannelById(UUID id) {
		return repository.findById(id);
	}

	public Page<DistributionChannelResponse> getAllDistributionChannels(Pageable pageable) {
		return repository.findAll(pageable).map(DistributionChannel::convertToResponse);
	}

	public List<DistributionChannel> createDistributionChannels(List<DistributionChannelRequest> requests) {
		List<DistributionChannel> distributionChannels = requests.stream()
				.map(request -> {
					DistributionChannel distributionChannel = new DistributionChannel().convertFromRequest(request, false);
					attachSystems(request, distributionChannel);
					return distributionChannel;
				})
				.collect(Collectors.toList());

		//TODO: Her må alle berørte datasett og system updateres samtidig
		return new ArrayList<>(repository.saveAll(distributionChannels));
	}

	public List<DistributionChannel> updateDistributionChannels(List<DistributionChannelRequest> requests) {
		List<DistributionChannel> distributionChannels = updateAndReturnAllDistributionChannelsIfAllExists(requests);

		//TODO: Her må alle berørte datasett og system updateres samtidig -> if System_id update -> set ElasticsearchStatus to TO_BE_UDPATED?
		return new ArrayList<>(repository.saveAll(distributionChannels));
	}

	private List<DistributionChannel> updateAndReturnAllDistributionChannelsIfAllExists(List<DistributionChannelRequest> requests) {
		List<DistributionChannel> distributionChannels = new ArrayList<>();
		requests.forEach(request -> {
			Optional<DistributionChannel> optionalDistributionChannels = repository.findByName(request.getName());
			if (optionalDistributionChannels.isEmpty()) {
				throw new DataCatalogBackendNotFoundException(String.format("Cannot find distributionChannel with name: %s",
						request.getName()));
			}
			DistributionChannel distributionChannel = optionalDistributionChannels.get().convertFromRequest(request, true);
			attachSystems(request, distributionChannel);
			distributionChannels.add(distributionChannel);
		});
		return distributionChannels;
	}

	public DistributionChannel deleteDistributionChannel(DistributionChannel distributionChannel) {
		//TODO: Her må alle berørte datasett og system fjernes samtidig
		return repository.save(distributionChannel);
	}

    private void attachSystems(DistributionChannelRequest request, DistributionChannel distributionChannel) {
        safeStream(request.getConsumers())
                .filter(consumer -> safeStream(distributionChannel.getConsumers()).noneMatch(existingConsumer -> existingConsumer.getName().equals(consumer)))
                .forEach(consumer -> distributionChannel.addConsumer(systemRepository.findByName(consumer).orElseGet(() -> createNewSystem(consumer))));
        var removeConsumers = distributionChannel.getConsumers().stream().filter(consumer -> !request.getConsumers().contains(consumer.getName())).collect(Collectors.toList());
        removeConsumers.forEach(distributionChannel::removeConsumer);

        safeStream(request.getProducers())
                .filter(producer -> safeStream(distributionChannel.getProducers()).noneMatch(existingProducer -> existingProducer.getName().equals(producer)))
                .forEach(producer -> distributionChannel.addProducer(systemRepository.findByName(producer).orElseGet(() -> createNewSystem(producer))));
        var removeProducers = distributionChannel.getProducers().stream().filter(producer -> !request.getProducers().contains(producer.getName())).collect(Collectors.toList());
        removeProducers.forEach(distributionChannel::removeProducer);
	}

	public void createOrUpdateDistributionChannelFromKafka(DistributionChannelRequest request) {
		Optional<DistributionChannel> optional = repository.findByName(request.getName());
		if (optional.isEmpty()) {
			log.info("Creating new distributionChannel={}", request.getName());
			createDistributionChannels(Collections.singletonList(request));
		} else {
			updateDistributionChannels(Collections.singletonList(request));
		}
	}

	private System createNewSystem(String systemName) {
		log.info("Creating new system={}", systemName);
		System system = new System().convertFromRequest(SystemRequest.builder().name(systemName).build(), false);
		return systemRepository.save(system);
	}
}
