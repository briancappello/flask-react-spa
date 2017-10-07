import React from 'react'

import { LongDate } from 'components'

import CategoryLink from '../CategoryLink'
import TagLink from '../TagLink'

import './category-tags.scss'


const Category = ({ category }) =>
  <span className="category">
    Category: <CategoryLink category={category} />
  </span>

const Tags = ({ tags }) =>
  <span className="tags">
    Tags: {tags.map((tag, i) => <TagLink tag={tag} key={i} />)}
  </span>

const CategoryTags = ({ category, tags }) => {
  const hasCategory = !!category
  const hasTags = tags && tags.length
  if (hasCategory && hasTags) {
    return [
      <Category category={category} key="category" />,
      <Tags tags={tags} key="tags" />
    ]
  } else if (hasCategory) {
    return <Category category={category} />
  } else if (hasTags) {
    return <Tags tags={tags} />
  }
}

export default ({ category, tags }) => {
  if (!category && !(tags && tags.length)) {
    return null
  }
  return (
    <p className="category-tags">
      <CategoryTags category={category} tags={tags} />
    </p>
  )
}
