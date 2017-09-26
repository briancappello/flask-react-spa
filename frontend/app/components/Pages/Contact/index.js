import { Loadable } from 'components'


export default Loadable({
  loader: () => import('./Contact'),
})
