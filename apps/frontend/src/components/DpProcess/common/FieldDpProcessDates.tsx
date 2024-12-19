import { DateField } from '../../common/DateField'

export const FieldDpProcessDates = () => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-[50%] mr-4 mt-4">
          <DateField name="start" label="Fom dato" />
        </div>
        <div className="w-[50%] mt-4">
          <DateField name="end" label="Tom dato" />
        </div>
      </div>
    </>
  )
}
