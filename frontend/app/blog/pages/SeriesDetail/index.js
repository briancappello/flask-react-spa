import Loadable from 'components/Loadable'

export default Loadable({
  loader: () => import('./SeriesDetail'),
})
