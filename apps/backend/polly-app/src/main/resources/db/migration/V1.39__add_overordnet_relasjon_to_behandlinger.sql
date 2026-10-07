alter table process
    add column overordnet_behandling uuid;

alter table process
    add column behandlingsnivaa text not null default 'VANLIG';

alter table process
    add constraint fk_process_overordnet_behandling
        foreign key (overordnet_behandling) references process (process_id);

create index ix_process_overordnet_behandling on process (overordnet_behandling);