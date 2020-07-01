import {env} from './env'


export const navSlackTeamId = 'T5LNAMWNA'
export const behandlingskatalogSlackChannelId = 'CR1B19E6L'

export const datajegerSlackLink = `slack://channel?team=${navSlackTeamId}&id=${behandlingskatalogSlackChannelId}`
export const documentationLink = 'https://dataplattform.gitbook.io/nada/kataloger/behandlingskatalog'

export const termUrl = (termId: string) => `https://data.adeo.no/begrep/${termId}`
export const slackRedirectUrl = (c: string) => `https://slack.com/app_redirect?team=${navSlackTeamId}&channel=${c.toLowerCase()}`

export const teamLink = (teamId: string) => `${env.teamKatBaseUrl}team/${teamId}`
export const productAreaLink = (productAreaId: string) => `${env.teamKatBaseUrl}productarea/${productAreaId}`
