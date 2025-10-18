import { createClient } from '@supabase/supabase-js'

// Supabase configuration using CHETAN_ prefixed environment variables
const supabaseUrl = process.env.REACT_APP_CHETAN_SUPABASE_URL || 'https://pqstodkgwmsuocslpily.supabase.co'
const supabaseKey = process.env.REACT_APP_CHETAN_NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc3RvZGtnd21zdW9jc2xwaWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTE3MDIsImV4cCI6MjA3NjI4NzcwMn0.9S3Szq_wh9J9VL9X2N46qgH-AAYafc68tsrSb72a_5Y'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Voting service using Supabase with device tracking
export const votingService = {
  async getTotalVotes() {
    try {
      // Get total number of votes from device_clicks table
      const { count, error } = await supabase
        .from('device_clicks')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      return count || 0
    } catch (error) {
      console.log('Supabase error getting total votes:', error.message)
      return 0
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

  async recordVote(deviceId, votes, deviceInfo) {
    try {
      // Record vote in database
      const { error } = await supabase
        .from('device_clicks')
        .insert([{
          device_id: deviceId,
          device_type: deviceInfo.deviceType,
          user_agent: deviceInfo.userAgent,
          best_dressed: votes.best_dressed,
          most_creative: votes.most_creative,
          funniest: votes.funniest,
          voted_at: new Date().toISOString()
        }])

      if (error) throw error

      return true
    } catch (error) {
      console.log('Supabase error recording vote:', error.message)
      throw error
    }
  },

  async getVotingResults() {
    try {
      // Get all votes from database
      const { data, error } = await supabase
        .from('device_clicks')
        .select('best_dressed, most_creative, funniest, voted_at')
        .order('voted_at', { ascending: true })

      if (error) throw error

      return data || []
    } catch (error) {
      console.log('Supabase error getting voting results:', error.message)
      return []
    }
  }
}
