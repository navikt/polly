package no.nav.data.catalog.backend.app.system;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
import no.nav.data.catalog.backend.app.common.validator.RequestValidator;
import no.nav.data.catalog.backend.app.common.validator.ValidationError;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRepository;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelShort;
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
public class SystemService extends RequestValidator<SystemRequest> {

	private final SystemRepository systemRepository;
	private final DistributionChannelRepository distributionChannelRepository;

	public SystemService(SystemRepository repository, DistributionChannelRepository distributionChannelRepository) {
		this.systemRepository = repository;
		this.distributionChannelRepository = distributionChannelRepository;
	}

	public Optional<System> findSystemById(UUID id) {
		return systemRepository.findById(id);
	}

	public Page<SystemResponse> getAllSystems(Pageable pageable) {
		return systemRepository.findAll(pageable).map(System::convertToResponse);
	}

	public Long getRepositoryCount() {
		return systemRepository.count();
	}

	@Transactional
	public List<System> saveAll(List<SystemRequest> requests) {
		List<System> systems = requests.stream().map(this::convertNew).collect(Collectors.toList());
		return systemRepository.saveAll(systems);
	}

	@Transactional
	public List<System> updateAll(List<SystemRequest> requests) {
		List<System> systems = systemRepository.findAllByNameIn(requests.stream().map(SystemRequest::getName).collect(Collectors.toList()));

		systems.forEach(
				system -> {
					Optional<SystemRequest> request = requests.stream()
							.filter(r -> r.getName().equals(system.getName()))
							.findFirst();
					request.ifPresent(systemRequest -> convertUpdate(systemRequest, system));
				});

		return systemRepository.saveAll(systems);
	}

	@Transactional
	public System delete(System system) {
		// remove this system from all producers and consumers (DistributionChannel)
		safeStream(system.getConsumerDistributionChannels())
				.forEach(consumerDistChannel -> consumerDistChannel.removeConsumer(system));
		safeStream(system.getProducerDistributionChannels())
				.forEach(producerDistChannel -> producerDistChannel.removeProducer(system));

		systemRepository.delete(system);
		return system;
	}

	private System convertNew(SystemRequest request) {
		System system = new System().convertNewFromRequest(request);
		attachDependencies(system, request);
		return system;
	}

	private void convertUpdate(SystemRequest request, System system) {
		system.convertUpdateFromRequest(request);
		attachDependencies(system, request);
	}

	private void attachDependencies(System system, SystemRequest request) {
		var consumerBefore = DistributionChannel.names(system.getConsumerDistributionChannels());
		var producerBefore = DistributionChannel.names(system.getProducerDistributionChannels());

		attachDistributionChannels(system, request);

		var consumerAfter = DistributionChannel.names(system.getConsumerDistributionChannels());
		var producerAfter = DistributionChannel.names(system.getProducerDistributionChannels());

		if (!consumerBefore.equals(consumerAfter)) {
			log.info("System {} changed DistributionChannels for consumers {}", system.getName(), StreamUtils.difference(consumerBefore, consumerAfter).changeString());
		}
		if (!producerBefore.equals(producerAfter)) {
			log.info("System {} changed DistributionChannels for producers {}", system.getName(), StreamUtils.difference(producerBefore, producerAfter).changeString());
		}
	}

	private void attachDistributionChannels(System system, SystemRequest request) {
		// filter out by name which distributionChannels that are in the request but not in the repository, convert from DistChannelShort to DistChannels and add them to the consumers
		safeStream(request.getConsumerDistributionChannels())
				.filter(requestedConsumer -> safeStream(system.getConsumerDistributionChannels()).noneMatch(existingConsumer -> existingConsumer.getName()
						.equals(requestedConsumer.getName())))
				.forEach(consumer -> system.addConsumerDistributionChannel(distributionChannelRepository.findByName(consumer.getName())
						.orElseGet(() -> createNewDistributionChannel(consumer))));

		// filter out by name which distributionChannels that are in the repository but not in the request and remove these from the system
		safeStream(system.getConsumerDistributionChannels())
				.filter(existingConsumer -> safeStream(request.getConsumerDistributionChannels()).noneMatch(requestedConsumer -> requestedConsumer.getName()
						.equals(existingConsumer.getName())))
				.forEach(system::removeConsumerDistributionChannel);


		// same procedure for producerDistributionChannels
		safeStream(request.getProducerDistributionChannels())
				.filter(requestedProducer -> safeStream(system.getProducerDistributionChannels()).noneMatch(existingProducer -> existingProducer.getName()
						.equals(requestedProducer.getName())))
				.forEach(producer -> system.addProducerDistributionChannel(distributionChannelRepository.findByName(producer.getName()).orElseGet(() ->
						createNewDistributionChannel(producer))));
		safeStream(system.getProducerDistributionChannels())
				.filter(existingProducer -> safeStream(request.getProducerDistributionChannels()).noneMatch(requestedProducer -> requestedProducer.getName()
						.equals(existingProducer.getName())))
				.forEach(system::removeProducerDistributionChannel);
	}


	private DistributionChannel createNewDistributionChannel(DistributionChannelShort distributionChannelShort) {
		log.info("Creating new distributionChannel={}", distributionChannelShort.getName());
		return new DistributionChannel().convertNewFromRequest(distributionChannelShort.toRequest());
	}


	public void validateRequest(List<SystemRequest> requests) {
		List<ValidationError> validationErrors = validateRequestsAndReturnErrors(requests);

		if (!validationErrors.isEmpty()) {
			log.error("The request was not accepted. The following errors occurred during validation: {}", validationErrors);
			throw new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation: ");
		}
	}

	private List<ValidationError> validateRequestsAndReturnErrors(List<SystemRequest> requests) {
		if (requests.isEmpty()) {
			return Collections.emptyList();
		}

		List<ValidationError> validationErrors = new ArrayList<>(validateNoDuplicates(requests));

		requests.forEach(request -> {
			validationErrors.addAll(validateFields(request));

			boolean existInRepository = systemRepository.findByName(request.getName()).isPresent();
			validationErrors.addAll(validateRepositoryValues(request, existInRepository));
		});

		return validationErrors;
	}
}
