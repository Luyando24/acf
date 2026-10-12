import { z } from 'zod'

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(30).optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(150),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000),
  consent_given: z.boolean().refine((val) => val === true, {
    message: 'You must consent to data processing under the Data Protection Act to submit.',
  }),
  honeypot: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
  turnstile_token: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Membership Application Schema
export const membershipFormSchema = z.object({
  applicant_type: z.enum(['organisation', 'individual']),
  org_name: z.string().max(150).optional().or(z.literal('')),
  contact_name: z.string().min(2, 'Contact person name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Please enter a valid contact phone number').max(30),
  category_id: z.string().min(1, 'Please select a membership category'),
  location_province: z.string().min(2, 'Province or location is required').max(100),
  sector_interest: z.string().min(2, 'Area of agricultural interest is required').max(150),
  message: z.string().max(2000).optional().or(z.literal('')),
  consent_given: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and consent to data storage.',
  }),
  honeypot: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
  turnstile_token: z.string().optional(),
})

export type MembershipFormData = z.infer<typeof membershipFormSchema>

// Newsletter Signup Schema
export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  consent_given: z.boolean().refine((val) => val === true, {
    message: 'You must agree to receive ACF newsletter communications.',
  }),
  source: z.string().default('website'),
  honeypot: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
})

export type NewsletterFormData = z.infer<typeof newsletterSchema>

// Opportunity Schema
export const opportunitySchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  type: z.enum(['Job', 'Consultancy', 'Tender', 'Procurement', 'Call for Proposals']),
  description: z.string().min(10, 'Description is required'),
  opens_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid opening date required'),
  closes_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid closing date required'),
  application_instructions: z.string().optional().nullable(),
  apply_url: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
  contact_info: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
})

export type OpportunityFormData = z.infer<typeof opportunitySchema>
