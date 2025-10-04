import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/style.less'
import Player from './components/Player'

const root = createRoot(document.getElementById('app'))

const APP: React.FC = () => {
  return <Player />
}

root.render(<APP />)
