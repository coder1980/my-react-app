// Counter service using JSONBin (free database service)
// This will persist data across sessions and devices
export const counterService = {
  // JSONBin configuration - you can get your own free account at jsonbin.io
  binId: '6751a8e5e41b4d34e8b1a2c3', // Demo bin ID
  apiKey: '$2a$10$demo-key-replace-with-your-own', // Demo API key

  async getCount() {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}/latest`, {
        headers: {
          'X-Master-Key': this.apiKey
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.record.count || 0
      } else {
        throw new Error('Failed to fetch count')
      }
    } catch (error) {
      console.log('Using localStorage fallback:', error.message)
      // Fallback to localStorage
      return parseInt(localStorage.getItem('testCount') || '0')
    }
  },

  async incrementCount() {
    try {
      const currentCount = await this.getCount()
      const newCount = currentCount + 1
      
      // Try to save to JSONBin
      const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': this.apiKey
        },
        body: JSON.stringify({ count: newCount })
      })
      
      if (response.ok) {
        // Also save to localStorage as backup
        localStorage.setItem('testCount', newCount.toString())
        return newCount
      } else {
        throw new Error('Failed to save count')
      }
    } catch (error) {
      console.log('Using localStorage fallback:', error.message)
      // Fallback to localStorage
      const currentCount = parseInt(localStorage.getItem('testCount') || '0')
      const newCount = currentCount + 1
      localStorage.setItem('testCount', newCount.toString())
      return newCount
    }
  }
}
