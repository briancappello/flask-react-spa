import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { bindRoutineCreators } from 'actions'
import { HashLink } from 'components'
import { injectReducer, injectSagas } from 'utils/async'

import { listSeries } from 'blog/actions'
import { selectSeriesList } from 'blog/reducers/series'

import SeriesPreview from './SeriesPreview'


class SeriesList extends React.Component {
  componentWillMount() {
    const { series, listSeries } = this.props
    if (!(series && series.length)) {
      listSeries.maybeTrigger()
    }
  }

  renderContents(allSeries) {
    if (allSeries.length < 3) {
      return null
    }

    return [
      <ul key="contents">
        {allSeries.map((series, i) =>
          <li key={i}>
            <HashLink to={`#${series.slug}`}>
              {series.title}
            </HashLink>
          </li>
        )}
      </ul>,
      <hr />
    ]
  }

  render() {
    const { series: allSeries } = this.props

    if (allSeries.length === 0) {
      return <p>No article series have been published yet.</p>
    }

    return (
      <div>
        {this.renderContents(allSeries)}
        {allSeries.map((series, i) => {
          const preview = <SeriesPreview series={series} key={i} />
          return i < allSeries.length - 1
            ? [preview, <hr key={`hr${i}`} />]
            : preview
        })}
      </div>
    )
  }
}

const withReducer = injectReducer(require('blog/reducers/series'))

const withSagas = injectSagas(require('blog/sagas/series'))

const withConnect = connect(
  (state, props) => ({ series: props.series || selectSeriesList(state) }),
  (dispatch) => bindRoutineCreators({ listSeries }, dispatch),
)

export default compose(
  withReducer,
  withSagas,
  withConnect,
)(SeriesList)
