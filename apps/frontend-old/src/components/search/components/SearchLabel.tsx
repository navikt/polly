interface IProps {
  name: string
  type: string
  backgroundColor?: string
  foregroundColor?: string
}

export const SearchLabel = (props: IProps) => {
  const { name, type, backgroundColor } = props

  return (
    <div className="flex justify-between w-full">
      <span style={{ padding: '5px' }}>{name}</span>
      <div
        className={`p-[5px] m-[5px] border-r-[5px] ${backgroundColor ? `{bg-[${backgroundColor}]}` : ''}`}
      >
        {type}
      </div>
    </div>
  )
}
