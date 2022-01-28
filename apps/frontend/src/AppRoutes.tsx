import * as React from 'react'
import {Route, Routes, useNavigate, useLocation, useParams} from 'react-router-dom'
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
import ProcessorListPage from "./pages/ProcessorListPage";
import ProcessorView from "./components/Processor/ProcessorView";

export const processPath = '/process/:section/:code/:processId?'

const AppRoutes = (): JSX.Element => (
  <Root>
    <Routes>
      <Route path="/dashboard/:processStatus?" element={<DashboardPage/>} caseSensitive={true}/>
      <Route path="/thirdparty" element={<ThirdPartyListPage/>} caseSensitive={true}/>
      <Route path="/thirdparty/:thirdPartyCode/:section?/:id?" element={<ThirdPartyMetadataPage/>} caseSensitive={true}/>
      <Route path="/system" element={<SystemListPage/>} caseSensitive={true}/>
      <Route path="/system/:systemCode" element={<SystemPage/>} caseSensitive={true}/>
      <Route path="/team/:teamId" element={<TeamPage/>} caseSensitive={true}/>
      <Route path="/productarea/:productAreaId" element={<ProductAreaPage/>} caseSensitive={true}/>
      <Route path="/process" element={<PurposeListPage/>} caseSensitive={true}/>
      <Route path={processPath} element={<ProcessPage/>} caseSensitive={true}/>
      <Route path="/process/legal" element={<LegalPage/>} caseSensitive={true}/>

      <Route path="/dpprocess" element={<DpProcessPage/>} caseSensitive={true}/>
      <Route path="/dpprocess/:id" element={<DpProcessView/>} caseSensitive={true}/>

      <Route path="/processor" element={<ProcessorListPage/>} caseSensitive={true}/>
      <Route path="/processor/:id" element={<ProcessorView/>} caseSensitive={true}/>


      <Route path="/dashboard/:filterName/:filterValue/:filterStatus" element={<PurposeTable/>} caseSensitive={true}/>

      <Route path="/process/:id" element={redirect(processUrl)} caseSensitive={true}/>
      <Route path="/policy/:id" element={redirect(policyUrl)} caseSensitive={true}/>
      <Route path="/disclosure" element={<DisclosureListPage/>} caseSensitive={true}/>
      <Route path="/disclosure/:id" element={redirect(disclosureUrl)} caseSensitive={true}/>

      <Route path="/informationtype/create" element={<InformationtypeCreatePage/>} caseSensitive={true}/>
      <Route path="/informationtype/:id?" element={<InformationtypePage/>} caseSensitive={true}/>
      <Route path="/informationtype/:id/edit" element={<InformationtypeEditPage/>} caseSensitive={true}/>

      <Route path="/admin/codelist/:listname?" element={<CodelistPage/>} caseSensitive={true}/>
      <Route path="/admin/audit/:id?/:auditId?" element={<AuditPage/>} caseSensitive={true}/>
      <Route path="/admin/settings" element={<SettingsPage/>} caseSensitive={true}/>
      <Route path="/admin/request-revision" element={<RequestRevisionPage/>} caseSensitive={true}/>
      <Route path="/admin/maillog" element={<MailLogPage/>} caseSensitive={true}/>

      <Route path="/document/create" element={<DocumentCreatePage/>} caseSensitive={true}/>
      <Route path="/document/:id?" element={<DocumentPage/>} caseSensitive={true}/>
      <Route path="/document/:id/edit" element={<DocumentEditPage/>} caseSensitive={true}/>

      <Route path="/alert/events/:objectType?/:id?" element={<AlertEventPage/>} caseSensitive={true}/>

      <Route path="/" element={<MainPage/>} caseSensitive={true}/>
      <Route element={<NotFound/>}/>
    </Routes>
  </Root>
)

const NotFound = () => (
  <Block display="flex" justifyContent="center" alignContent="center" marginTop={theme.sizing.scale4800}>
    <Paragraph1>{intl.pageNotFound} - {useLocation().pathname}</Paragraph1>
    <img src={notFound} alt={intl.pageNotFound} style={{maxWidth: '65%'}}/>
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
  const {id} = useParams<{ id: string }>()
  if(id){
    (async ()=>{
      const url = await fetch(id)
      const navigate= useNavigate()
      navigate(url,{replace:true})
    })()
  }
  return <Spinner/>
}

export default AppRoutes
