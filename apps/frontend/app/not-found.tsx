import notFound from '@/resources/notfound.svg'
import { BodyLong } from '@navikt/ds-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const NotFound = () => {
  const pathName = usePathname()

  return (
    <div className='flex justify-center content-center mt-48'>
      <BodyLong>Oida 404! Fant ikke den siden der nei - {pathName}</BodyLong>
      <Image src={notFound} alt='404 Finner ikke den siden' style={{ maxWidth: '65%' }} />
    </div>
  )
}

export default NotFound
