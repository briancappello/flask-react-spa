import React from 'react'
import LoadingBar from 'react-redux-loading-bar'


export default ({ style, ...props }) => (
  <LoadingBar updateTime={100} {...props}
              style={Object.assign({
                position: 'fixed',
                top: 0,
                zIndex: 99999,
                height: '2px',
                backgroundColor: '#0366d6',
              }, style)}
  />
)
