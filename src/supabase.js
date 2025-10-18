import { createClient } from '@supabase/supabase-js'

// Supabase configuration using CHETAN_ prefixed environment variables
const supabaseUrl = process.env.REACT_APP_CHETAN_SUPABASE_URL || 'https://pqstodkgwmsuocslpily.supabase.co'
const supabaseKey = process.env.REACT_APP_CHETAN_NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc3RvZGtnd21zdW9jc2xwaWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTE3MDIsImV4cCI6MjA3NjI4NzcwMn0.9S3Szq_wh9J9VL9X2N46qgH-AAYafc68tsrSb72a_5Y'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Counter service using Supabase with device tracking
export const counterService = {
  async getCount() {
    try {
      // Try to get count from Supabase
      const { data, error } = await supabase
        .from('counter')
        .select('count')
        .eq('id', 1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error
      }

      if (data) {
        return data.count || 0
      } else {
        // If no record exists, create one with count 0
        const { data: newData, error: insertError } = await supabase
          .from('counter')
          .insert([{ id: 1, count: 0 }])
          .select()
          .single()

        if (insertError) throw insertError
        return newData.count
      }
    } catch (error) {
      console.log('Supabase error, using localStorage fallback:', error.message)
      // Fallback to localStorage
      return parseInt(localStorage.getItem('testCount') || '0')
    }
  },

  async getDeviceCount() {
    try {
      // Get total number of unique devices that have clicked
      const { count, error } = await supabase
        .from('device_clicks')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      return count || 0
    } catch (error) {
      console.log('Supabase error getting device count:', error.message)
      return 0
    }
  },

  async checkDeviceExists(deviceId) {
    try {
      // Check if device has already clicked
      const { data, error } = await supabase
        .from('device_clicks')
        .select('device_id')
        .eq('device_id', deviceId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error
      }

      return !!data // Return true if device exists, false if not
    } catch (error) {
      console.log('Supabase error checking device:', error.message)
      return false
    }
  },

  async recordDeviceClick(deviceId, deviceInfo) {
    try {
      // Record device click in database
      const { error } = await supabase
        .from('device_clicks')
        .insert([{
          device_id: deviceId,
          device_type: deviceInfo.deviceType,
          user_agent: deviceInfo.userAgent,
          clicked_at: new Date().toISOString()
        }])

      if (error) throw error

      // Also increment the main counter
      const currentCount = await this.getCount()
      const newCount = currentCount + 1

      const { error: counterError } = await supabase
        .from('counter')
        .upsert([{ id: 1, count: newCount }])
        .select()
        .single()

      if (counterError) throw counterError

      return newCount
    } catch (error) {
      console.log('Supabase error recording device click:', error.message)
      // Fallback to localStorage
      const currentCount = parseInt(localStorage.getItem('testCount') || '0')
      const newCount = currentCount + 1
      localStorage.setItem('testCount', newCount.toString())
      return newCount
    }
  }
}
