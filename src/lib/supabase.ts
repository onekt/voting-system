import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
    id: string
    email: string
    role: 'student' | 'admin' | 'head-admin'
    student_id?: string
    created_at: string
    updated_at: string
}

export interface Election {
    id: string
    title: string
    description: string
    application_start_date: string
    application_end_date: string
    start_date: string
    end_date: string
    status: 'draft' | 'published' | 'ongoing' | 'completed'
    positions: string[]
    created_at: string
    updated_at: string
}

export interface Candidate {
    id: string
    election_id: string
    student_id: string
    position: string
    manifesto: string
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    updated_at: string
}

export interface Vote {
    id: string
    election_id: string
    voter_id: string
    candidate_id: string
    created_at: string
}

export interface FaceRegistration {
    id: string
    student_id: string
    image_url: string
    created_at: string
}

// Helper functions for common operations
export const auth = {
    signUp: async (email: string, password: string, userData: Partial<User>) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        })
        return { data, error }
    },

    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        return { user, error }
    }
}

export const elections = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('elections')
            .select('*')
            .order('created_at', { ascending: false })
        return { data, error }
    },

    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('elections')
            .select('*')
            .eq('id', id)
            .single()
        return { data, error }
    },

    create: async (election: Omit<Election, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
            .from('elections')
            .insert(election)
            .select()
            .single()
        return { data, error }
    },

    update: async (id: string, updates: Partial<Election>) => {
        const { data, error } = await supabase
            .from('elections')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        return { data, error }
    },

    delete: async (id: string) => {
        const { error } = await supabase
            .from('elections')
            .delete()
            .eq('id', id)
        return { error }
    }
}

export const candidates = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('candidates')
            .select(`
        *,
        elections (title),
        users (email, student_id)
      `)
            .order('created_at', { ascending: false })
        return { data, error }
    },

    getByElection: async (electionId: string) => {
        const { data, error } = await supabase
            .from('candidates')
            .select(`
        *,
        users (email, student_id)
      `)
            .eq('election_id', electionId)
            .order('created_at', { ascending: false })
        return { data, error }
    },

    create: async (candidate: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
            .from('candidates')
            .insert(candidate)
            .select()
            .single()
        return { data, error }
    },

    update: async (id: string, updates: Partial<Candidate>) => {
        const { data, error } = await supabase
            .from('candidates')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        return { data, error }
    }
}

export const votes = {
    cast: async (vote: Omit<Vote, 'id' | 'created_at'>) => {
        const { data, error } = await supabase
            .from('votes')
            .insert(vote)
            .select()
            .single()
        return { data, error }
    },

    getByElection: async (electionId: string) => {
        const { data, error } = await supabase
            .from('votes')
            .select('*')
            .eq('election_id', electionId)
        return { data, error }
    },

    hasVoted: async (electionId: string, voterId: string) => {
        const { data, error } = await supabase
            .from('votes')
            .select('id')
            .eq('election_id', electionId)
            .eq('voter_id', voterId)
            .single()
        return { hasVoted: !!data, error }
    }
}

export const faceRecognition = {
    register: async (studentId: string, imageData: string) => {
        // TODO: Implement actual face registration with Supabase Storage
        const { data, error } = await supabase
            .from('face_registrations')
            .insert({
                student_id: studentId,
                image_url: imageData // This should be a URL to Supabase Storage
            })
            .select()
            .single()
        return { data, error }
    },

    verify: async (studentId: string, imageData: string) => {
        // TODO: Implement actual face verification
        // This would typically involve comparing the captured image with stored images
        const { data, error } = await supabase
            .from('face_registrations')
            .select('*')
            .eq('student_id', studentId)
            .single()

        if (error || !data) {
            return { verified: false, error }
        }

        // TODO: Add actual face comparison logic here
        // For now, return a mock verification
        return { verified: true, similarity: 95.5 }
    }
} 