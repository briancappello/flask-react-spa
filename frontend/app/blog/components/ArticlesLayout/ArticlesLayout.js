import React from 'react'
import classnames from 'classnames'

import { PageContent } from 'components'
import { CONTENT_TOP } from 'constants.js'

import { ALL } from 'blog/constants'

import CategoryList from '../CategoryList'
import TagList from '../TagList'

import './articles-layout.scss'


export default class ArticlesLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sticky: false,
      stickyPos: null,
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.handleScroll()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const el = document.getElementById('categorization-col')
    const elTop = el.getBoundingClientRect().top
    const scrollTop = document.documentElement.scrollTop
    const { sticky, stickyPos } = this.state

    if (!sticky && elTop <= CONTENT_TOP) {
      this.setState({ sticky: true, stickyPos: scrollTop })
    } else if (sticky && scrollTop < stickyPos) {
      this.setState({ sticky: false, stickyPos: null })
    }
  }

  render() {
    const { children, category, tag } = this.props
    const { sticky } = this.state
    return (
      <div>
        <div className="articles-grid">
          <div className="content-col">
            {children}
          </div>
          <div className="categorization-col-container">
            <div id="categorization-col" className={classnames({ sticky })}>
              <h4>Categories</h4>
              <CategoryList current={category && category || ALL} />
              <h4>Tags</h4>
              <TagList current={tag && tag || ALL} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
