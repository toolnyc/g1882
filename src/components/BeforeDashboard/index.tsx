import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Gallery 1882 — Dashboard</h4>
      </Banner>
      <ul className={`${baseClass}__instructions`}>
        <li>
          Manage <strong>Happenings</strong> (exhibitions and events), <strong>Artists</strong>, and{' '}
          <strong>News</strong> posts from the collections in the sidebar.
        </li>
        <li>
          Edit site-wide settings like gallery hours and contact info under{' '}
          <strong>Globals → Space</strong>.
        </li>
        <li>
          <a href="/" target="_blank">
            Visit the live site
          </a>
          {' to see your changes after publishing.'}
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
