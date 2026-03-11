export const env = {
  pollyBaseUrl: process.env.REACT_APP_POLLY_ENDPOINT,
  lovdataLovBaseUrl: process.env.REACT_APP_LOVDATA_LOV_BASE_URL,
  lovdataForskriftBaseUrl: process.env.REACT_APP_LOVDATA_FORSKRIFT_BASE_URL,
  teamKatBaseUrl: process.env.REACT_APP_TEAMKAT_BASE_URL,
  slackId: process.env.REACT_APP_SLACK_ID,
  defaultStartDate: process.env.REACT_APP_DEFAULT_START_DATE || '0001-01-01',
  disableRiskOwner: process.env.REACT_APP_DISABLE_RISK_OWNER,
  disableDpProcess: process.env.REACT_APP_DISABLE_DP_PROCESS,
}
