package no.nav.polly.distributionchannel;

import lombok.extern.slf4j.Slf4j;
import no.nav.polly.common.exceptions.ValidationException;
import no.nav.polly.common.utils.StreamUtils;
import no.nav.polly.common.validator.RequestValidator;
import no.nav.polly.common.validator.ValidationError;
import no.nav.polly.system.System;
import no.nav.polly.system.SystemRepository;
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

import static java.util.stream.Collectors.toList;
import static no.nav.polly.common.utils.StreamUtils.safeStream;

@Slf4j
@Service
@Transactional
public class DistributionChannelService extends RequestValidator<DistributionChannelRequest> {

	private final DistributionChannelRepository distributionChannelRepository;
	private final SystemRepository systemRepository;

	public DistributionChannelService(DistributionChannelRepository repository, SystemRepository systemRepository) {
		this.distributionChannelRepository = repository;
		this.systemRepository = systemRepository;
	}

	public Optional<DistributionChannel> findDistributionChannelById(UUID id) {
		return distributionChannelRepository.findById(id);
	}

	public Page<DistributionChannelResponse> getAllDistributionChannels(Pageable pageable) {
		return distributionChannelRepository.findAll(pageable).map(DistributionChannel::convertToResponse);
	}

	@Transactional
	public List<DistributionChannel> saveAll(List<DistributionChannelRequest> requests) {
		List<DistributionChannel> distributionChannels = requests.stream().map(this::convertNew).collect(Collectors.toList());
		return distributionChannelRepository.saveAll(distributionChannels);
	}

	@Transactional
	public List<DistributionChannel> updateAll(List<DistributionChannelRequest> requests) {
		List<DistributionChannel> distChannels = distributionChannelRepository.findAllByNameIn(requests.stream()
				.map(DistributionChannelRequest::getName)
				.collect(toList()));

		distChannels.forEach(
				distChannel -> {
					Optional<DistributionChannelRequest> request = requests.stream()
							.filter(r -> r.getName().equals(distChannel.getName()))
							.findFirst();
					request.ifPresent(distChannelRequest -> convertUpdate(distChannelRequest, distChannel));
				});

		return distributionChannelRepository.saveAll(distChannels);

	}

	@Transactional
	public DistributionChannel delete(DistributionChannel distChannel) {
		// remove this distChannel from all producers and consumers (System)
		safeStream(distChannel.getConsumers()).forEach(system -> system.getConsumerDistributionChannels().remove(distChannel));
		safeStream(distChannel.getProducers()).forEach(system -> system.getProducerDistributionChannels().remove(distChannel));


		// remove this distChannel from all datasets ???
		distributionChannelRepository.delete(distChannel);
		return distChannel;
	}

	private DistributionChannel convertNew(DistributionChannelRequest request) {
		DistributionChannel distChannels = new DistributionChannel().convertNewFromRequest(request);
		attachDependencies(request, distChannels);
		return distChannels;
	}

	private DistributionChannel convertUpdate(DistributionChannelRequest request, DistributionChannel distChannel) {
		distChannel.convertUpdateFromRequest(request);
		attachDependencies(request, distChannel);
		return distChannel;
	}

	private void attachDependencies(DistributionChannelRequest request, DistributionChannel distributionChannel) {
		var consumerBefore = System.names(distributionChannel.getConsumers());
		var producerBefore = System.names(distributionChannel.getProducers());

		attachSystems(request, distributionChannel);

		var consumerAfter = System.names(distributionChannel.getConsumers());
		var producerAfter = System.names(distributionChannel.getProducers());

		if (!consumerBefore.equals(consumerAfter)) {
			log.info("System {} changed DistributionChannels for consumers {}", distributionChannel.getName(), StreamUtils.difference(consumerBefore, consumerAfter)
					.changeString());
		}
		if (!producerBefore.equals(producerAfter)) {
			log.info("System {} changed DistributionChannels for producers {}", distributionChannel.getName(), StreamUtils.difference(producerBefore, producerAfter)
					.changeString());
		}
	}

    private void attachSystems(DistributionChannelRequest request, DistributionChannel distributionChannel) {
        // filter out by name which systems that are in the request but not in the repository, convert from String to System and add to the consumers
        safeStream(request.getConsumers())
                .filter(requestedConsumer -> safeStream(distributionChannel.getConsumers()).noneMatch(existingConsumer -> existingConsumer.getName().equals(requestedConsumer)))
                .forEach(consumer -> distributionChannel.addConsumer(systemRepository.findByName(consumer).orElseGet(() -> createNewSystem(consumer))));
        // filter out by name which systems that are in the repository but not in the request and remove these from the distributionChannel
        var removeConsumers = distributionChannel.getConsumers().stream().filter(consumer -> !request.getConsumers().contains(consumer.getName())).collect(Collectors.toList());
        removeConsumers.forEach(distributionChannel::removeConsumer);

        // same procedure for producerSystems
        safeStream(request.getProducers())
                .filter(producer -> safeStream(distributionChannel.getProducers()).noneMatch(existingProducer -> existingProducer.getName().equals(producer)))
                .forEach(producer -> distributionChannel.addProducer(systemRepository.findByName(producer).orElseGet(() -> createNewSystem(producer))));
        var removeProducers = distributionChannel.getProducers().stream().filter(producer -> !request.getProducers().contains(producer.getName())).collect(Collectors.toList());
        removeProducers.forEach(distributionChannel::removeProducer);
	}

	public void createOrUpdateDistributionChannelFromKafka(DistributionChannelRequest request) {
		Optional<DistributionChannel> optional = distributionChannelRepository.findByName(request.getName());
		if (optional.isEmpty()) {
			log.info("Creating new distributionChannel={}", request.getName());
			saveAll(Collections.singletonList(request));
		} else {
			updateAll(Collections.singletonList(request));
		}
	}

	private System createNewSystem(String systemName) {
		log.info("Creating new system={}", systemName);
        System system = new System().createNewSystemWithName(systemName);
		return systemRepository.save(system);
	}

    void validateRequest(List<DistributionChannelRequest> requests) {
		List<ValidationError> validationErrors = validateRequestsAndReturnErrors(requests);

		if (!validationErrors.isEmpty()) {
			log.error("The request was not accepted. The following errors occurred during validation: {}", validationErrors);
			throw new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation: ");
		}
	}

	private List<ValidationError> validateRequestsAndReturnErrors(List<DistributionChannelRequest> requests) {
		if (requests.isEmpty()) {
			return Collections.emptyList();
		}

		List<ValidationError> validationErrors = new ArrayList<>(validateNoDuplicates(requests));

        requests.forEach(request -> {
            validationErrors.addAll(validateFields(request));

            boolean existInRepository = distributionChannelRepository.findByName(request.getName()).isPresent();
            validationErrors.addAll(validateRepositoryValues(request, existInRepository));
        });

		return validationErrors;
	}
}
