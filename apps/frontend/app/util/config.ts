import { env } from './env'

const navSlackTeamId = 'T5LNAMWNA'
const behandlingskatalogSlackChannelId = 'CR1B19E6L'

export const datajegerSlackLink = `slack://channel?team=${navSlackTeamId}&id=${behandlingskatalogSlackChannelId}`

export const termUrl = (termId: string) =>
  `https://navno.sharepoint.com/sites/begreper/SitePages/Begrep.aspx?bid=${termId}`

export const teamLink = (teamId: string) => `${env.teamKatBaseUrl}team/${teamId}`
export const productAreaLink = (productAreaId: string) =>
  `${env.teamKatBaseUrl}productarea/${productAreaId}`
