import React from 'react'
import ReactSVG from 'react-svg'

import es6Logo from './es6.png'
import reactLogo from './react.svg'
import reactRouterLogo from './react-router.png'
import reduxLogo from './redux.svg'
import reduxSagaLogo from './redux-saga.svg'
import reduxFormLogo from './redux-form.png'
import sassLogo from './sass.svg'
import webpackLogo from './webpack.svg'
import babelLogo from './babel.svg'

import pythonLogo from './python.svg'
import flaskLogo from './flask.svg'
import flaskSecurityLogo from './flask-security.svg'
import sqlalchemyLogo from './sqlalchemy.svg'
import flaskRestfulLogo from './flask-restful.png'
import marshmallowLogo from './marshmallow.png'
import flaskMailLogo from './flask-mail.png'
import celeryLogo from './celery.svg'

import ansibleLogo from './ansible.svg'
import centosLogo from './centos.svg'
import postgresLogo from './postgresql.svg'
import redisLogo from './redis.svg'
import nginxLogo from './nginx.svg'
import uwsgiLogo from './uwsgi.png'
import letsEncryptLogo from './letsencrypt.svg'
import postfixLogo from './postfix.svg'


const Logo = ({ children, maxWidth }) => (
  <div className="logo" style={{ display: 'inline-block', paddingRight: '15px' }}>
    {children}
  </div>
)

const SvgLogo = ({ logo, label, maxWidth='110px' }) => (
  <Logo maxWidth={maxWidth}>
    <div className="center" style={{ width: maxWidth }}>
      <ReactSVG path={logo} style={{ height: '100px', maxWidth }} />
    </div>
    <div className="center">{label}</div>
  </Logo>
)

const PngLogo = ({ logo, label, maxWidth='110px', style }) => (
  <Logo maxWidth={maxWidth}>
    <div className="center">
      <img src={logo} style={{ maxHeight: '100px', maxWidth, ...style }} />
    </div>
    <div className="center">{label}</div>
  </Logo>
)


export default (props) => (
  <div>
    <h1>Welcome to Flask React SPA!</h1>
    <p>A <strong>production-ready</strong> boilerplate built with <strong>Python 3</strong>, <strong>Flask</strong> and <strong>ES6 React/Redux</strong>.</p>
    <div className="row">
      <h2>Frontend Stack</h2>
      <a href="https://babeljs.io/learn-es2015/" target="_blank">
        <PngLogo logo={es6Logo} label="ES6+ JavaScript" />
      </a>
      <a href="https://webpack.js.org/" target="_blank">
        <SvgLogo logo={webpackLogo} label="Webpack 3" />
      </a>
      <a href="https://babeljs.io/" target="_blank">
        <SvgLogo logo={babelLogo} label="Babel 6" />
      </a>
      <a href="https://reactjs.org/blog/2017/09/26/react-v16.0.html" target="_blank">
        <SvgLogo logo={reactLogo} label="React 16" />
      </a>
      <a href="https://reacttraining.com/react-router/" target="_blank">
        <PngLogo logo={reactRouterLogo} label="React Router 4" />
      </a>
      <a href="http://redux.js.org/" target="_blank">
        <SvgLogo logo={reduxLogo} label="Redux" />
      </a>
      <a href="https://redux-saga.js.org/" target="_blank">
        <SvgLogo logo={reduxSagaLogo} label="Redux-Saga" maxWidth="130px" />
      </a>
      <a href="https://redux-form.com" target="_blank">
        <PngLogo logo={reduxFormLogo} label="Redux-Form" maxWidth="100px" style={{ marginBottom: '15px' }} />
      </a>
      <a href="http://sass-lang.com/" target="_blank">
        <SvgLogo logo={sassLogo} label="SCSS Styles" />
      </a>
    </div>
    <div className="row">
      <h2>Backend Stack</h2>
      <a href="https://www.python.org/" target="_blank">
        <SvgLogo logo={pythonLogo} label="Python 3.6+" />
      </a>
      <a href="http://flask.pocoo.org/" target="_blank">
        <SvgLogo logo={flaskLogo} label="Flask" />
      </a>
      <a href="https://flask-security.readthedocs.io/en/latest/" target="_blank">
        <SvgLogo logo={flaskSecurityLogo} label="Flask-Security" />
      </a>
      <a href="http://docs.sqlalchemy.org/en/rel_1_1/" target="_blank">
        <SvgLogo logo={sqlalchemyLogo} label="SQLAlchemy ORM" maxWidth="200px" />
      </a>
      <a href="http://flask-restful.readthedocs.io/en/latest/" target="_blank">
        <PngLogo logo={flaskRestfulLogo} label="Flask-RESTful" style={{ marginBottom: '8px' }} />
      </a>
      <a href="http://flask-marshmallow.readthedocs.io/en/latest/" target="_blank">
        <PngLogo logo={marshmallowLogo} label="Flask-Marshmallow" />
      </a>
      <a href="http://pythonhosted.org/Flask-Mail/" target="_blank">
        <PngLogo logo={flaskMailLogo} label="Flask-Mail" style={{ marginBottom: '10px' }} />
      </a>
      <a href="http://www.celeryproject.org/" target="_blank">
        <SvgLogo logo={celeryLogo} label="Celery" />
      </a>
    </div>
    <div className="row">
      <h2>Production Deployment</h2>
      <a href="http://docs.ansible.com/ansible/latest/index.html" target="_blank">
        <SvgLogo logo={ansibleLogo} label="Ansible 2" />
      </a>
      <a href="https://www.centos.org/" target="_blank">
        <SvgLogo logo={centosLogo} label="CentOS 7.4" />
      </a>
      <a href="http://nginx.org/en/" target="_blank">
        <SvgLogo logo={nginxLogo} label="NGINX" maxWidth="140px" />
      </a>
      <a href="https://uwsgi-docs.readthedocs.io/en/latest/" target="_blank">
        <PngLogo logo={uwsgiLogo} label="uWSGI" maxWidth="130px" style={{ marginBottom: '30px' }} />
      </a>
      <a href="https://www.postgresql.org/" target="_blank">
        <SvgLogo logo={postgresLogo} label="PostgreSQL 9.6" maxWidth="140px" />
      </a>
      <a href="https://redis.io/" target="_blank">
        <SvgLogo logo={redisLogo} label="Redis" />
      </a>
      <a href="http://www.postfix.org/" target="_blank">
        <SvgLogo logo={postfixLogo} label="Postfix" maxWidth="150px" />
      </a>
      <a href="https://letsencrypt.org/" target="_blank">
        <SvgLogo logo={letsEncryptLogo} label="Let's Encrypt" />
      </a>
    </div>
    <div className="row">
      <h2>License</h2>
      <p>MIT</p>
    </div>
  </div>
)
