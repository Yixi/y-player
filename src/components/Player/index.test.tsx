import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Player from './index'

global.URL.createObjectURL = jest.fn(() => 'mock-url')

describe('Player component', () => {
  test('should render player interface correctly', () => {
    render(<Player />)

    expect(screen.getByText('Y-Player')).toBeInTheDocument()
    expect(screen.getByText('支持多种音频格式的音乐播放器')).toBeInTheDocument()
    expect(screen.getByText('添加音乐文件')).toBeInTheDocument()
    expect(
      screen.getByText(/支持格式.*MP3.*WAV.*FLAC.*APE/),
    ).toBeInTheDocument()
  })

  test('should show upload button', () => {
    render(<Player />)

    const uploadInput = document.querySelector('input[type="file"]')
    expect(uploadInput).toBeInTheDocument()
    expect(uploadInput).toHaveAttribute('accept', 'audio/*,.flac,.ape')
    expect(uploadInput).toHaveAttribute('multiple')
  })

  test('should not show controls when no tracks are loaded', () => {
    render(<Player />)

    expect(screen.queryByText('播放列表')).not.toBeInTheDocument()
  })

  test('should handle file upload', async () => {
    render(<Player />)

    const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' })
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    })

    fireEvent.change(input)

    await waitFor(() => {
      expect(screen.getByText('播放列表')).toBeInTheDocument()
      expect(screen.getAllByText('test.mp3').length).toBeGreaterThan(0)
    })
  })

  test('should display playback controls after loading tracks', async () => {
    render(<Player />)

    const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' })
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    })

    fireEvent.change(input)

    await waitFor(() => {
      expect(screen.getByText(/Track 1 of 1/)).toBeInTheDocument()
    })
  })
})
