export function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification')
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement('div')
  notification.className = `notification ${type}`
  notification.textContent = message

  // Add to DOM
  document.body.appendChild(notification)

  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show')
  }, 10)

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show')
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

export function showOfflineIndicator(isOffline) {
  let indicator = document.querySelector('.offline-indicator')
  
  if (isOffline) {
    if (!indicator) {
      indicator = document.createElement('div')
      indicator.className = 'offline-indicator'
      indicator.innerHTML = '📵 Offline Mode'
      document.body.appendChild(indicator)
    }
  } else {
    if (indicator) {
      indicator.remove()
    }
  }
}
