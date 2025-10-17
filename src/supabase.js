import { createClient } from '@supabase/supabase-js'

// Supabase configuration using CHETAN_ prefixed environment variables
const supabaseUrl = process.env.REACT_APP_CHETAN_SUPABASE_URL || 'https://pqstodkgwmsuocslpily.supabase.co'
const supabaseKey = process.env.REACT_APP_CHETAN_NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc3RvZGtnd21zdW9jc2xwaWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTE3MDIsImV4cCI6MjA3NjI4NzcwMn0.9S3Szq_wh9J9VL9X2N46qgH-AAYafc68tsrSb72a_5Y'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Counter service using Supabase
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

  async incrementCount() {
    try {
      // Get current count
      const currentCount = await this.getCount()
      const newCount = currentCount + 1

      // Update count in Supabase
      const { data, error } = await supabase
        .from('counter')
        .upsert([{ id: 1, count: newCount }])
        .select()
        .single()

      if (error) throw error

      // Also save to localStorage as backup
      localStorage.setItem('testCount', newCount.toString())
      return newCount
    } catch (error) {
      console.log('Supabase error, using localStorage fallback:', error.message)
      // Fallback to localStorage
      const currentCount = parseInt(localStorage.getItem('testCount') || '0')
      const newCount = currentCount + 1
      localStorage.setItem('testCount', newCount.toString())
      return newCount
    }
  }
}
