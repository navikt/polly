create table if not exists slack_melding
(
    id                 serial primary key,
    data               jsonb not null
)