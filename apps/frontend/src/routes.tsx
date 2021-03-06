import * as React from 'react'
import {Route, Switch, useHistory, useLocation, useParams} from 'react-router-dom'
import {Block} from 'baseui/block'
import {Paragraph1} from 'baseui/typography'
import {Spinner} from 'baseui/icon'


import Root from './components/Root'
import ProcessPage from './pages/ProcessPage'
import InformationtypeCreatePage from './pages/InformationtypeCreatePage'
import InformationtypeEditPage from './pages/InformationtypeEditPage'
import InformationtypePage from './pages/InformationtypePage'
import {SystemListPage, ThirdPartyListPage} from './pages/ListSearchPage'
import ThirdPartyMetadataPage from './pages/ThirdPartyPage'
import {MainPage} from './pages/MainPage'
import CodelistPage from './pages/admin/CodelistPage'
import {AuditPage} from './pages/admin/AuditPage'
import {intl, theme} from './util'
import notFound from './resources/notfound.svg'
import {SettingsPage} from './pages/admin/SettingsPage'
import DocumentCreatePage from './pages/DocumentCreatePage'
import DocumentPage from './pages/DocumentPage'
import DocumentEditPage from './pages/DocumentEditPage'
import {PurposeListPage} from './pages/PurposeListPage'
import {AlertEventPage} from './pages/AlertEventPage'
import {getDisclosure, getPolicy, getProcess} from './api'
import PurposeTable from './components/Dashboard/PurposeTable'
import {SystemPage} from './pages/SystemPage'
import {TeamPage} from './pages/TeamPage'
import {ProductAreaPage} from './pages/ProductAreaPage'
import {LegalPage} from './pages/LegalPage'
import DpProcessPage from "./pages/DpProcessPage";
import DpProcessView from "./components/DpProcess/DpProcessView";
import {RequestRevisionPage} from './pages/admin/RequestRevisionPage'
import {MailLogPage} from './pages/admin/MailLogPage'
import {DashboardPage} from './pages/DashboardPage'
import {DisclosureListPage} from './pages/DisclosureListPage'

export const processPath = '/process/:section/:code/:processId?'

const Routes = (): JSX.Element => (
  <Root>
    <Switch>
      <Route exact path="/dashboard/:processStatus?" component={DashboardPage} />
      <Route exact path="/thirdparty" component={ThirdPartyListPage} />
      <Route exact path="/thirdparty/:thirdPartyCode/:section?/:id?" component={ThirdPartyMetadataPage} />
      <Route exact path="/system" component={SystemListPage} />
      <Route exact path="/system/:systemCode" component={SystemPage} />
      <Route exact path="/team/:teamId" component={TeamPage} />
      <Route exact path="/productarea/:productAreaId" component={ProductAreaPage} />
      <Route exact path="/process" component={PurposeListPage} />
      <Route exact path={processPath} component={ProcessPage} />
      <Route exact path="/process/legal" component={LegalPage} />

      <Route exact path="/dpprocess" component={DpProcessPage} />
      <Route exact path="/dpprocess/:id" component={DpProcessView} />

      <Route exact path="/dashboard/:filterName/:filterValue/:filterStatus" component={PurposeTable} />

      <Route exact path="/process/:id" component={redirect(processUrl)} />
      <Route exact path="/policy/:id" component={redirect(policyUrl)} />
      <Route exact path="/disclosure" component={DisclosureListPage} />
      <Route exact path="/disclosure/:id" component={redirect(disclosureUrl)} />

      <Route exact path="/informationtype/create" component={InformationtypeCreatePage} />
      <Route exact path="/informationtype/:id?" component={InformationtypePage} />
      <Route exact path="/informationtype/:id/edit" component={InformationtypeEditPage} />

      <Route exact path="/admin/codelist/:listname?" component={CodelistPage} />
      <Route exact path="/admin/audit/:id?/:auditId?" component={AuditPage} />
      <Route exact path="/admin/settings" component={SettingsPage} />
      <Route exact path="/admin/request-revision" component={RequestRevisionPage} />
      <Route exact path="/admin/maillog" component={MailLogPage}/>

      <Route exact path="/document/create" component={DocumentCreatePage} />
      <Route exact path="/document/:id?" component={DocumentPage} />
      <Route exact path="/document/:id/edit" component={DocumentEditPage} />

      <Route exact path="/alert/events/:objectType?/:id?" component={AlertEventPage} />

      <Route exact path="/" component={MainPage} />
      <Route component={NotFound} />
    </Switch>
  </Root>
)

const NotFound = () => (
  <Block display="flex" justifyContent="center" alignContent="center" marginTop={theme.sizing.scale4800}>
    <Paragraph1>{intl.pageNotFound} - {useLocation().pathname}</Paragraph1>
    <img src={notFound} alt={intl.pageNotFound} style={{ maxWidth: '65%' }} />
  </Block>
)

const processUrl = async (id: string) => {
  const process = await getProcess(id)
  // todo multipurpose url
  return `/process/purpose/${process.purposes[0].code}/${process.id}`
}

const policyUrl = async (id: string) => {
  const policy = await getPolicy(id)
  // todo multipurpose url
  return `/process/purpose/${policy.purposes[0].code}/${policy.process.id}`
}

const disclosureUrl = async (id: string) => {
  const disclosure = await getDisclosure(id)
  return `/thirdparty/${disclosure.recipient.code}/disclosure/${id}`
}

const redirect = (fetch: (id: string) => Promise<string>) => () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  fetch(id).then(history.replace)
  return <Spinner />
}

export default Routes
