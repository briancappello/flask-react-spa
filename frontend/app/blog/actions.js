import { createRoutine } from 'actions'

export const listArticles = createRoutine('articles/LIST_ARTICLES')
export const loadArticleDetail = createRoutine('articleDetail/LOAD_ARTICLE_DETAIL')

export const listCategories = createRoutine('categories/LIST_CATEGORIES')
export const loadCategoryDetail = createRoutine('categoryDetail/LOAD_CATEGORY_DETAIL')

export const listSeries = createRoutine('series/LIST_SERIES')
export const loadSeriesDetail = createRoutine('series-detail/LOAD_SERIES_DETAIL')

export const listTags = createRoutine('tags/LIST_TAGS')
export const loadTagDetail = createRoutine('tagDetail/LOAD_TAG_DETAIL')
