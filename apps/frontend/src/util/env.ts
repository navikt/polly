export const env = {
  pollyBaseUrl: process.env.NEXT_PUBLIC_POLLY_ENDPOINT || '/api',
  lovdataLovBaseUrl: process.env.NEXT_PUBLIC_LOVDATA_LOV_BASE_URL,
  lovdataForskriftBaseUrl: process.env.NEXT_PUBLIC_LOVDATA_FORSKRIFT_BASE_URL,
  teamKatBaseUrl: process.env.NEXT_PUBLIC_TEAMKAT_BASE_URL,
  slackId: process.env.NEXT_PUBLIC_SLACK_ID,
  defaultStartDate: process.env.NEXT_PUBLIC_DEFAULT_START_DATE || '0001-01-01',
  disableRiskOwner: process.env.NEXT_PUBLIC_DISABLE_RISK_OWNER,
  disableDpProcess: process.env.NEXT_PUBLIC_DISABLE_DP_PROCESS,
}
