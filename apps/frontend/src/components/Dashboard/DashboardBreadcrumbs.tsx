import { BodyShort } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { getAvdelingByNomId, getByNomId } from '../../api/NomApi'
import RouteLink from '../common/RouteLink'

type TBreadcrumbItem = {
  label: string
  href?: string
}

type TDashboardBreadcrumbsProps = {
  departmentId?: string
  seksjonId?: string
  currentPageTitle?: string
}

const DashboardBreadcrumbs = (props: TDashboardBreadcrumbsProps) => {
  const { departmentId, seksjonId, currentPageTitle } = props
  const [departmentName, setDepartmentName] = useState<string>('')
  const [seksjonName, setSeksjonName] = useState<string>('')

  useEffect(() => {
    if (departmentId) {
      getAvdelingByNomId(departmentId)
        .then((res) => setDepartmentName(res.navn))
        .catch(() => setDepartmentName(departmentId))
    }
  }, [departmentId])

  useEffect(() => {
    if (seksjonId) {
      getByNomId(seksjonId)
        .then((res) => setSeksjonName(res.navn))
        .catch(() => setSeksjonName(seksjonId))
    }
  }, [seksjonId])

  const items: TBreadcrumbItem[] = [{ label: 'Dashboard', href: '/dashboard' }]

  if (departmentId) {
    const depLabel = departmentName || departmentId
    if (currentPageTitle) {
      items.push({
        label: depLabel,
        href: `/process/department/${departmentId}/?tab=Dashboard`,
      })
    } else {
      items.push({ label: depLabel })
    }
  }

  if (seksjonId) {
    const sekLabel = seksjonName || seksjonId
    items.push({ label: sekLabel })
  }

  if (currentPageTitle) {
    items.push({ label: currentPageTitle })
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 list-none p-0 m-0">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && (
              <BodyShort as="span" style={{ fontSize: '18px' }} className="text-gray-500">
                /
              </BodyShort>
            )}
            {item.href ? (
              <RouteLink href={item.href}>
                <BodyShort as="span" style={{ fontSize: '18px' }}>
                  {item.label}
                </BodyShort>
              </RouteLink>
            ) : (
              <BodyShort as="span" style={{ fontSize: '18px' }} className="text-gray-600">
                {item.label}
              </BodyShort>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default DashboardBreadcrumbs
