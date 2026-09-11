import { apiClient, userAuthHeader } from './axiosClient'

export const FALLBACK_BOOKS = [
  {
    id: 1,
    title: 'The 2-Hour AI Side Hustle',
    subtitle: 'A Step-by-Step Blueprint to Build 5 Automated Income Streams Using Modern AI Tools',
    authorName: 'Abikumar Dharmaraj',
    sellerName: 'Abikumar Dharmaraj',
    description: 'Master the 2-Hour AI Side Hustle system. Learn how to launch 5 profitable, automated micro-businesses in just 120 minutes a day using ChatGPT, Midjourney, Claude, and modern automation tools. Includes prompt templates, workflow diagrams, and scaling frameworks.',
    price: 399.00,
    paperbackPrice: 699.00,
    category: 'AI & Technology',
    keywords: 'AI, Side Hustle, Automation, ChatGPT, Passive Income, Business, Digital Products',
    isbn: '979-889-2026-01-1',
    language: 'English',
    printLength: 36,
    contentType: 'EBOOK',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    filePath: 'https://res.cloudinary.com/demo/image/upload/v1/samples/kdp/the_2_hour_ai_side_hustle.pdf',
    averageRating: 4.9,
    reviewCount: 48,
    sampleText: 'CHAPTER 1: THE ASYNCHRONOUS INCOME REVOLUTION\n\nThe traditional model of trading 40 hours a week for a fixed paycheck is fundamentally broken in the age of artificial intelligence. Today, a solo creator armed with modern generative AI models can produce what previously required a ten-person creative studio.\n\nIn this book, you will discover the exact 5 automated income streams designed to be operated in just 2 hours a day: AI-generated micro-eBooks, programmatic newsletter curation, automated prompt templates, workflow automation sidecars, and faceless YouTube content syndication.\n\nEach system is structured with step-by-step master prompts, daily 24-minute workflows, and zero upfront overhead costs.'
  },
  {
    id: 2,
    title: 'The 7-Day Dopamine Reset',
    subtitle: 'A Practical Protocol to Eliminate Brain Fog, Break Phone Addiction, and Reclaim Deep Focus',
    authorName: 'Abikumar Dharmaraj',
    sellerName: 'Abikumar Dharmaraj',
    description: 'A clinically backed neurobiology protocol designed to reset your dopamine baseline, crush screen addiction, and restore relentless daily focus and emotional clarity in just one week.',
    price: 299.00,
    paperbackPrice: 599.00,
    category: 'Health & Mindset',
    keywords: 'Dopamine, Neuroscience, Focus, Productivity, Mental Health, Habit Building',
    isbn: '979-889-2026-02-8',
    language: 'English',
    printLength: 28,
    contentType: 'EBOOK',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    filePath: 'https://res.cloudinary.com/demo/image/upload/v1/samples/kdp/the_7_day_dopamine_reset.pdf',
    averageRating: 4.8,
    reviewCount: 35,
    sampleText: 'INTRODUCTION: THE HIJACKED BRAIN\n\nEvery notification chime, infinite scroll feed, and algorithmic hook is engineered to extract your most precious biological asset: your dopamine baseline. When your brain is constantly overstimulated, baseline dopamine crashes, leaving you perpetually fatigued, unfocused, and anxious.\n\nThis 7-day protocol is your neurochemical reset button. Over the next seven days, you will systematically eliminate hyper-stimuli, implement cold morning grounding, restore restful REM sleep, and rebuild natural drive.'
  },
  {
    id: 3,
    title: 'The 10-Minute Nervous System Reset',
    subtitle: 'Somatic Exercises and Vagus Nerve Protocols to Stop Overthinking, Release Chronic Stress, and Master Emotional Calm',
    authorName: 'Abikumar Dharmaraj',
    sellerName: 'Abikumar Dharmaraj',
    description: 'Transform your physical and emotional state in 10 minutes. Evidence-based somatic exercises and vagus nerve stimulation techniques to dissolve acute anxiety and restore nervous system balance.',
    price: 349.00,
    paperbackPrice: 649.00,
    category: 'Self-Help & Wellness',
    keywords: 'Somatic, Nervous System, Vagus Nerve, Stress Relief, Anxiety, Meditation',
    isbn: '979-889-2026-03-5',
    language: 'English',
    printLength: 32,
    contentType: 'EBOOK',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    filePath: 'https://res.cloudinary.com/demo/image/upload/v1/samples/kdp/the_10_minute_nervous_system_reset.pdf',
    averageRating: 5.0,
    reviewCount: 52,
    sampleText: 'SECTION 1: THE SOMATIC CODE\n\nStress does not originate solely in your thoughts; it is stored physically in your fascia, diaphragm, and autonomic nervous system. By activating the ventral vagal complex through rapid somatic micro-movements, you can down-regulate cortisol in under 120 seconds.\n\nThis guide teaches you the exact 10-minute daily sequence to ground your body and dissolve chronic overthinking.'
  },
  {
    id: 4,
    title: 'Shadow Work Journal & Workbook',
    subtitle: 'Transformative Prompts, Exercises, and Guided Inquiries to Heal the Past and Integrate Your Hidden Self',
    authorName: 'Abikumar Dharmaraj',
    sellerName: 'Abikumar Dharmaraj',
    description: 'A deep, transformative psychological journey into Jungian shadow work. 90 guided journal prompts, inner-child integration exercises, and emotional release frameworks.',
    price: 449.00,
    paperbackPrice: 799.00,
    category: 'Psychology & Healing',
    keywords: 'Shadow Work, Carl Jung, Healing, Journaling, Inner Child, Personal Growth',
    isbn: '979-889-2026-04-2',
    language: 'English',
    printLength: 42,
    contentType: 'EBOOK',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    filePath: 'https://res.cloudinary.com/demo/image/upload/v1/samples/kdp/shadow_work_journal.pdf',
    averageRating: 4.9,
    reviewCount: 41,
    sampleText: 'PROMPT DAY 1: MEETING YOUR TRIGGER\n\nWhat is the single quality in other people that frustrates you the most? Often, our strongest emotional reactions to others mirror the parts of ourselves we have disowned or repressed. Write without judgment...'
  }
]

export const listContent = async (category = '', search = '') => {
  try {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (search) params.append('search', search)
    const qs = params.toString() ? `?${params.toString()}` : ''
    const res = await apiClient.get(`/api/content${qs}`, { headers: userAuthHeader() })
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res
    }
  } catch (e) {
    console.warn('Backend loading, using showcase catalog fallback:', e)
  }

  // Filter fallback catalog
  let filtered = [...FALLBACK_BOOKS]
  if (category) {
    filtered = filtered.filter(b => b.category?.toLowerCase().includes(category.toLowerCase()))
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.authorName.toLowerCase().includes(q) ||
      (b.keywords && b.keywords.toLowerCase().includes(q))
    )
  }
  return { data: filtered }
}

export const getContent = async (id) => {
  try {
    const res = await apiClient.get(`/api/content/${id}`, { headers: userAuthHeader() })
    if (res.data) return res
  } catch (e) {
    console.warn('Backend loading, using fallback item:', e)
  }
  const item = FALLBACK_BOOKS.find(b => String(b.id) === String(id)) || FALLBACK_BOOKS[0]
  return { data: item }
}

export const getSample = async (id) => {
  try {
    const res = await apiClient.get(`/api/content/${id}/sample`)
    if (res.data) return res
  } catch (e) {
    // fallback
  }
  const item = FALLBACK_BOOKS.find(b => String(b.id) === String(id)) || FALLBACK_BOOKS[0]
  return {
    data: {
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      authorName: item.authorName,
      thumbnailUrl: item.thumbnailUrl,
      category: item.category,
      printLength: item.printLength,
      sampleText: item.sampleText
    }
  }
}

export const getMyLibrary = () =>
  apiClient.get('/api/content/my-library', { headers: userAuthHeader() })
