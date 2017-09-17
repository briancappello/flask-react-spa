import React from 'react'


/**
 * PageHeader
 *
 * Renders a viewport-wide background image, with optional overlapping
 * content specified as children.
 *
 * Example usage in a component:
 *
 * import image from './backgroundImage.png';
 *
 * <PageHeader image={image} repeat="no-repeat" position="top left"
 *             size="cover" height="500px">
 *     <div className="title">This is a heading!</div>
 *     <div className="subtitle">
 *         This is a sub-heading with custom styling.
 *     </div>
 * </PageHeader>
 */
export default class PageHeader extends React.Component {
  static defaultProps = {
    image: false,
    repeat: 'no-repeat',
    position: 'center',
    size: 'cover',
    height: '500px',
    color: 'black',
    className: '',
  }

  render() {
    const { image, height, position, repeat, size, color } = this.props

    let inlineStyles = !image
      ? { color }
      : {
          backgroundImage: 'url(' + image + ')',
          backgroundRepeat: repeat,
          backgroundPosition: position,
          backgroundSize: size,
          height,
          color,
        }

    return (
      <header className="page-header-wrap" style={inlineStyles}>
        <div className="container">
          <div className="page-header">
            {this.props.children}
          </div>
        </div>
      </header>
    )
  }
}
