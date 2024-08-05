import { useStyletron } from 'baseui'
import { ListItem, ListItemLabel } from 'baseui/list'

export default (props: any) => {
  const { list } = props
  const [useCss] = useStyletron()

  return (
    <ul
      className={useCss({
        width: '375px',
        paddingLeft: 0,
        paddingRight: 0,
      })}
    >
      {list.map((object: any) => (
        <ListItem sublist>
          <ListItemLabel sublist>{object.description}</ListItemLabel>
        </ListItem>
      ))}
    </ul>
  )
}
