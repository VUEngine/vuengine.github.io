/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
    'use strict'
  
    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)
  
    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme()
      if (storedTheme) {
        return storedTheme
      }
  
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  
    const setTheme = theme => {
      if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
      }
    }
  
    setTheme(getPreferredTheme())
  
    const showActiveTheme = (theme, focus = false) => {
      const themeSwitcher = document.querySelector('#bd-theme')
  
      if (!themeSwitcher) {
        return
      }
  
      themeSwitcher.setAttribute('data-bs-theme', theme)
      document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
        if (element.getAttribute('data-bs-theme-value') === theme) {
            element.setAttribute('style', 'display:block')
        } else {
            element.setAttribute('style', 'display:none')
        }
      })
  
      const themeSwitcherLabel = `Toggle theme (${theme[0].toUpperCase()}${theme.slice(1)})`
      themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)
      themeSwitcher.setAttribute('title', themeSwitcherLabel)
  
      if (focus) {
        themeSwitcher.focus()
      }
    }
  
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const storedTheme = getStoredTheme()
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme(getPreferredTheme())
      }
    })
  
    window.addEventListener('DOMContentLoaded', () => {
      showActiveTheme(getPreferredTheme())
  
      const themeSwitcher = document.querySelector('#bd-theme')
      themeSwitcher.addEventListener('click', () => {
          const activeTheme = themeSwitcher.getAttribute('data-bs-theme')
          let newTheme = 'light'
          if (activeTheme === 'light') {
            newTheme = 'dark'
          } else if (activeTheme === 'dark') {
            newTheme = 'auto'
          }
          setStoredTheme(newTheme)
          setTheme(newTheme)
          showActiveTheme(newTheme, true)
        })
      })
  })()
    