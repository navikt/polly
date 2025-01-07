import { Spinner } from 'baseui/icon'
import { ParagraphLarge } from 'baseui/typography'
import { JSX, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router'
import { getDisclosure, getPolicy, getProcess } from './api/GetAllApi'
import PurposeTable from './components/Dashboard/PurposeTable'
import DpProcessView from './components/DpProcess/DpProcessView'
import ProcessorView from './components/Processor/ProcessorView'
import Root from './components/Root'
import CodelistPage from './components/admin/CodeList/CodelistPage'
import { AuditPage } from './components/admin/audit/AuditPage'
import { MailLogPage } from './components/admin/maillog/MailLogPage'
import { RequestRevisionPage } from './components/admin/revision/RequestRevisionPage'
import { SettingsPage } from './components/admin/settings/SettingsPage'
import { AlertEventPage } from './pages/AlertEventPage'
import { DashboardPage } from './pages/DashboardPage'
import { DisclosureListPage } from './pages/DisclosureListPage'
import DocumentCreatePage from './pages/DocumentCreatePage'
import DocumentEditPage from './pages/DocumentEditPage'
import DocumentPage from './pages/DocumentPage'
import DpProcessPage from './pages/DpProcessPage'
import InformationtypeCreatePage from './pages/InformationtypeCreatePage'
import InformationtypeEditPage from './pages/InformationtypeEditPage'
import InformationtypePage from './pages/InformationtypePage'
import { LegalPage } from './pages/LegalPage'
import { SystemListPage, ThirdPartyListPage } from './pages/ListSearchPage'
import { MainPage } from './pages/MainPage'
import ProcessPage from './pages/ProcessPage'
import ProcessorListPage from './pages/ProcessorListPage'
import { ProductAreaPage } from './pages/ProductAreaPage'
import { PurposeListPage } from './pages/PurposeListPage'
import { SystemPage } from './pages/SystemPage'
import { TeamPage } from './pages/TeamPage'
import ThirdPartyMetadataPage from './pages/ThirdPartyPage'
import notFound from './resources/notfound.svg'

export const processPath = '/process/:section/:code/:processId'
export const processPathNoId = '/process/:section/:code/'

const AppRoutes = (): JSX.Element => (
  <Root>
    <Routes>
      <Route
        path="/dashboard/:filterName/:filterValue/:filterStatus"
        element={<PurposeTable />}
        caseSensitive={true}
      />
      <Route path="/dashboard/:processStatus" element={<DashboardPage />} caseSensitive={true} />
      <Route path="/dashboard/" element={<DashboardPage />} caseSensitive={true} />

      <Route path="/thirdparty" element={<ThirdPartyListPage />} caseSensitive={true} />
      <Route
        path="/thirdparty/:thirdPartyCode/:section/:id"
        element={<ThirdPartyMetadataPage />}
        caseSensitive={true}
      />
      <Route
        path="/thirdparty/:thirdPartyCode/:section/"
        element={<ThirdPartyMetadataPage />}
        caseSensitive={true}
      />
      <Route
        path="/thirdparty/:thirdPartyCode/"
        element={<ThirdPartyMetadataPage />}
        caseSensitive={true}
      />

      <Route path="/system" element={<SystemListPage />} caseSensitive={true} />
      <Route path="/system/:systemCode" element={<SystemPage />} caseSensitive={true} />

      <Route path="/team/:teamId" element={<TeamPage />} caseSensitive={true} />

      <Route
        path="/productarea/:productAreaId"
        element={<ProductAreaPage />}
        caseSensitive={true}
      />
      <Route path="/process" element={<PurposeListPage />} caseSensitive={true} />

      <Route path={processPathNoId} element={<ProcessPage />} caseSensitive={true} />
      <Route path={processPath} element={<ProcessPage />} caseSensitive={true} />
      <Route path="/process/legal" element={<LegalPage />} caseSensitive={true} />

      <Route path="/dpprocess" element={<DpProcessPage />} caseSensitive={true} />
      <Route path="/dpprocess/:id" element={<DpProcessView />} caseSensitive={true} />

      <Route path="/processor" element={<ProcessorListPage />} caseSensitive={true} />
      <Route path="/processor/:id" element={<ProcessorView />} caseSensitive={true} />

      <Route path="/process/:id" element={<Redirect to={processUrl} />} caseSensitive={true} />
      <Route path="/policy/:id" element={<Redirect to={policyUrl} />} caseSensitive={true} />
      <Route path="/disclosure" element={<DisclosureListPage />} caseSensitive={true} />
      <Route
        path="/disclosure/:id"
        element={<Redirect to={disclosureUrl} />}
        caseSensitive={true}
      />

      <Route
        path="/informationtype/create"
        element={<InformationtypeCreatePage />}
        caseSensitive={true}
      />
      <Route path="/informationtype/:id" element={<InformationtypePage />} caseSensitive={true} />
      <Route path="/informationtype/" element={<InformationtypePage />} caseSensitive={true} />

      <Route
        path="/informationtype/:id/edit"
        element={<InformationtypeEditPage />}
        caseSensitive={true}
      />

      <Route path="/admin/codelist/:listname" element={<CodelistPage />} caseSensitive={true} />
      <Route path="/admin/codelist/" element={<CodelistPage />} caseSensitive={true} />

      <Route path="/admin/audit/:id/:auditId" element={<AuditPage />} caseSensitive={true} />
      <Route path="/admin/audit/:id/" element={<AuditPage />} caseSensitive={true} />
      <Route path="/admin/audit/" element={<AuditPage />} caseSensitive={true} />

      <Route path="/admin/settings" element={<SettingsPage />} caseSensitive={true} />
      <Route
        path="/admin/request-revision"
        element={<RequestRevisionPage />}
        caseSensitive={true}
      />
      <Route path="/admin/maillog" element={<MailLogPage />} caseSensitive={true} />

      <Route path="/document/create" element={<DocumentCreatePage />} caseSensitive={true} />
      <Route path="/document/:id" element={<DocumentPage />} caseSensitive={true} />
      <Route path="/document/" element={<DocumentPage />} caseSensitive={true} />

      <Route path="/document/:id/edit" element={<DocumentEditPage />} caseSensitive={true} />

      <Route
        path="/alert/events/:objectType/:id"
        element={<AlertEventPage />}
        caseSensitive={true}
      />
      <Route path="/alert/events/:objectType/" element={<AlertEventPage />} caseSensitive={true} />
      <Route path="/alert/events/" element={<AlertEventPage />} caseSensitive={true} />

      <Route path="/" element={<MainPage />} caseSensitive={true} />
      <Route element={<NotFound />} />
    </Routes>
  </Root>
)

const NotFound = () => (
  <div className="flex justify-center content-center just mt-48">
    <ParagraphLarge>
      Oida 404! Fant ikke den siden der nei - {useLocation().pathname}
    </ParagraphLarge>
    <img src={notFound} alt="404 Finner ikke den siden" style={{ maxWidth: '65%' }} />
  </div>
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

const Redirect = ({ to }: { to: (id: string) => Promise<string> }) => {
  const { id } = useParams<{ id: string }>()
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (id) {
      ;(async () => {
        to(id).then((url) => {
          setUrl(url)
        })
      })()
    }
  }, [id])

  if (!url) {
    return <Spinner />
  }

  return <Navigate to={url} replace />
}

export default AppRoutes
