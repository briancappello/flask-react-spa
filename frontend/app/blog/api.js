import { get } from 'utils/request'
import { v1 } from 'api'


function blog(uri) {
  return v1(`/blog${uri}`)
}

export default class Blog {
  static listArticles() {
    return get(blog('/articles'))
  }

  /**
   * @param {Object} article
   * @param {string} article.slug
   */
  static loadArticleDetail(article) {
    return get(blog(`/articles/${article.slug}`))
  }

  static listCategories() {
    return get(blog('/categories'))
  }

  /**
   * @param {Object} category
   * @param {string} category.slug
   */
  static loadCategoryDetail(category) {
    return get(blog(`/categories/${category.slug}`))
  }

  static listSeries() {
    return get(blog('/series'))
  }

  /**
   * @param {Object} series
   * @param {string} series.slug
   */
  static loadSeriesDetail(series) {
    return get(blog(`/series/${series.slug}`))
  }

  static listTags() {
    return get(blog('/tags'))
  }

  /**
   * @param {Object} tag
   * @param {string} tag.slug
   */
  static loadTagDetail(tag) {
    return get(blog(`/tags/${tag.slug}`))
  }
}
