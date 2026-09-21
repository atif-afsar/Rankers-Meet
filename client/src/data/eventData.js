/**
 * Centralized Event Data Model for Rankers Meet 2026
 * Reference: Section 45 in Rankers-Meet-2026-UI-UX-Frontend-Spec.md
 */

export const EVENT_DATA = {
  name: 'Rankers Meet 2026',
  year: '2026',
  organization: 'Yasir Ali Classes',
  officialWebsite: 'https://www.yasiraliclasses.in/',
  tagline: 'Honoring The Commerce Champions of Yasir Ali Classes',
  subtitle: 'A grand celebration recognizing the relentless dedication, outstanding ranks, and triumphs of our commerce achievers.',
  
  // Date & Logistics
  dateString: 'Sunday, October 4, 2026',
  timeString: '10:00 AM - 02:00 PM IST',
  eventDateTimestamp: new Date('2026-10-04T10:00:00+05:30').getTime(),
  venueName: 'Royal Fort, Aligarh',
  venueAddress: 'Royal Fort, Near Exhibition Ground, GT Road, Aligarh, Uttar Pradesh 202001',
  mapUrl: 'https://maps.google.com/?q=Royal+Fort+Aligarh',
  registrationDeadline: 'Saturday, October 3, 2026, 11:59 PM IST',
  
  // Contact info
  helplinePhone: '+91 90454 17079',
  helplinePhoneAlt: '+91 94126 17279',
  contactEmail: 'admissions@yasiraliclasses.in',
  
  // Verified Official Statistics (Section 19)
  stats: [
    { value: 80000, suffix: '+', label: 'Students Mentored', desc: 'Across offline classrooms & online digital programs' },
    { value: 20000, suffix: '+', label: 'Selections & Qualifiers', desc: 'In CA Foundation, AMU, CUET & Commerce Entrances' },
    { value: 16, suffix: '+', label: 'Years of Excellence', desc: 'Aligarh’s most trusted commerce mentorship since 2010' },
    { value: 4.9, suffix: '★', label: 'Google Rating', desc: 'Based on thousands of verified student & parent reviews' },
  ],

  // Interactive Schedule Timeline (Section 15)
  schedule: [
    {
      step: 'Ceremony 01',
      title: 'Arrival & Red Carpet Welcome',
      desc: 'Attendee entry, digital QR code badge verification, and welcome drinks.',
      badge: 'Welcome Desk',
    },
    {
      step: 'Ceremony 02',
      title: 'Inaugural Address & Lamp Lighting',
      desc: 'Welcome remarks by Yasir Ali Sir, chief guests, and faculty mentors.',
      badge: 'Main Stage',
    },
    {
      step: 'Ceremony 03',
      title: 'Grand Rankers Felicitation Ceremony',
      desc: 'Trophy presentations, medals, and certificates of distinction for qualifying rankers.',
      badge: 'Felicitation Session',
    },
    {
      step: 'Ceremony 04',
      title: 'Mentorship & Career Roadmap Session',
      desc: 'One-on-one career counseling for higher studies, college choices, and professional guidance.',
      badge: 'Career Masterclass',
    },
    {
      step: 'Ceremony 05',
      title: 'Parent Pride Gathering & VIP Banquet',
      desc: 'Honoring proud parents on stage followed by a grand celebratory lunch buffet.',
      badge: 'Celebration Banquet',
    },
  ],

  // Who Can Attend (Section 16)
  audienceCategories: [
    {
      id: 'ca-foundation',
      title: 'CA & Professional Wings',
      desc: 'Students qualifying in CA Foundation, CMA Foundation, and CS Executive Entrance Tests.',
      tag: 'Chartered Accountancy',
      highlight: 'ICAI / ICMAI Qualifiers',
    },
    {
      id: 'boards-commerce',
      title: 'Class 12th Board Toppers',
      desc: 'High scorers securing 90%+ or school-top ranks in CBSE, ISC, and State Commerce streams.',
      tag: 'Board Distinction',
      highlight: 'Class 11 & 12 Commerce',
    },
    {
      id: 'cuet-commerce',
      title: 'CUET (UG / PG) Percentilers',
      desc: 'Achievers securing 99%+ or 100%ile in Accountancy, Economics, Business Studies, and General Test.',
      tag: 'Central Universities',
      highlight: 'DU / SRCC / Hindu Aspirants',
    },
    {
      id: 'amu-entrance',
      title: 'AMU & JMI Entrance Rankers',
      desc: 'Top rank holders in AMU & JMI B.Com, BBA, MBA, and Class 11th Commerce entrance examinations.',
      tag: 'University Entrance',
      highlight: 'B.Com / BBA / MBA Top Ranks',
    },
  ],

  // Highlights Gallery (Section 20)
  highlights: [
    {
      id: 1,
      category: 'Stage Felicitation',
      title: 'Distinguished Guest Felicitation',
      subtitle: 'Honoring dignitaries and guests of honor alongside Yasir Ali Sir with engraved mementos',
      year: 'Rankers Meet',
      badge: 'Main Stage',
      imageUrl: '/images/highlights/highlight-1.jpg',
      gradient: 'from-rose-950/90 via-slate-900 to-black',
    },
    {
      id: 2,
      category: 'Stage Felicitation',
      title: "Ranker's Meet Felicitation Memento",
      subtitle: "Presenting the prestigious Ranker's Meet trophy celebrating exceptional student excellence",
      year: 'Rankers Meet',
      badge: 'Special Honor',
      imageUrl: '/images/highlights/highlight-2.jpg',
      gradient: 'from-amber-950/90 via-slate-900 to-black',
    },
    {
      id: 3,
      category: 'Academic Distinction',
      title: 'Sir Syed Talent Hunt Scholarship (₹11,000)',
      subtitle: 'Awarding merit scholarship cheque and winner trophy to top talent hunt examination achievers',
      year: 'Rankers Meet',
      badge: 'Cash Award',
      imageUrl: '/images/highlights/highlight-3.jpg',
      gradient: 'from-red-950/90 via-slate-900 to-black',
    },
    {
      id: 4,
      category: 'Academic Distinction',
      title: 'Talent Hunt Merit Prize (₹15,000) & Medal',
      subtitle: 'Rewarding top-ranking students with commemorative medal and ₹15,000 cash prize on stage',
      year: 'Rankers Meet',
      badge: 'Merit Prize',
      imageUrl: '/images/highlights/highlight-4.jpg',
      gradient: 'from-slate-950 via-slate-900 to-black',
    },
    {
      id: 5,
      category: 'Mentorship',
      title: 'Celebrating Achievers with Faculty & Mentors',
      subtitle: 'Yasir Ali Sir and YAC senior educators commemorating glorious milestones with students',
      year: 'Rankers Meet',
      badge: 'Mentorship',
      imageUrl: '/images/highlights/highlight-5.jpg',
      gradient: 'from-rose-900/90 via-slate-900 to-black',
    },
    {
      id: 6,
      category: 'Banquet & Moments',
      title: 'Celebratory Moments & Grand Felicitation',
      subtitle: 'Rankers, mentors, and families gathering together to celebrate outstanding academic success',
      year: 'Rankers Meet',
      badge: 'Grand Meet',
      imageUrl: '/images/highlights/highlight-6.jpg',
      gradient: 'from-red-900/80 via-slate-900 to-black',
    },
  ],

  // Testimonials (Section 18)
  testimonials: [
    {
      quote:
        'Secured CA Foundation All India Rank with complete conceptual clarity from Yasir Sir and the YAC team. Rankers Meet gave me memories I will cherish for life.',
      name: 'Mohd. Hamza',
      achievement: 'CA Foundation AIR • ICAI Ranker',
    },
    {
      quote:
        'Cracked AMU B.Com Entrance with Rank 1! The structured test series and mentorship at Yasir Ali Classes turned my aspirations into reality.',
      name: 'Ayesha Siddiqui',
      achievement: 'AMU B.Com Entrance Rank 1',
    },
    {
      quote:
        'Scored 100 percentile in Accountancy and Business Studies in CUET and got admitted to SRCC, Delhi University. Best commerce coaching anywhere!',
      name: 'Rohan Agarwal',
      achievement: 'CUET 100%ile • SRCC, Delhi University',
    },
  ],

  // Top Rankers Storytelling Showcase (Sections 25-26 in Mobile Spec)
  rankers: [
    {
      rank: '01',
      name: 'Mohd. Hamza',
      exam: 'CA Foundation • ICAI Examination',
      achievement: 'All India Rank Distinction',
      highlight: 'AIR Achiever',
      quote: 'Conceptual mastery with Yasir Sir turned difficult accounting problems into second nature.',
      category: 'Chartered Accountancy',
      tag: 'ICAI Top Rank',
    },
    {
      rank: '02',
      name: 'Ayesha Siddiqui',
      exam: 'AMU Commerce Entrance 2024',
      achievement: 'Rank 1 — Highest Aggregate Score',
      highlight: 'Entrance Rank 1',
      quote: 'Rigorous mock tests and direct faculty counseling gave me complete confidence on exam day.',
      category: 'University Entrance',
      tag: 'AMU Rank 1',
    },
    {
      rank: '03',
      name: 'Rohan Agarwal',
      exam: 'CUET (UG) Commerce',
      achievement: '100th Percentile & SRCC Admission',
      highlight: '100%ile • SRCC Admitted',
      quote: 'YAC mentorship made my dream of entering Shri Ram College of Commerce come true.',
      category: 'Central Universities',
      tag: 'CUET 100%ile',
    },
  ],

  // Frequently Asked Questions
  faqs: [
    {
      q: 'Who is eligible to register for Rankers Meet 2026?',
      a: 'All students of Yasir Ali Classes who have qualified in CA Foundation, CMA, CUET (UG/PG), AMU/JMI Commerce Entrances, or achieved outstanding marks in Class 11th & 12th Commerce Board examinations are warmly invited.',
    },
    {
      q: 'Can parents accompany the student to the venue?',
      a: 'Yes! To ensure seating and banquet arrangements for all felicitated rankers, each student is warmly welcome to bring their parents (Mother and Father). Please indicate this during online registration so seating can be reserved.',
    },
    {
      q: 'How will I receive my digital pass and QR ticket?',
      a: 'Immediately upon submitting the registration form, your digital ticket with a unique Registration ID (e.g. RM1001) and entry QR code will appear on screen for instant download/print. A copy is also dispatched to your email address.',
    },
    {
      q: 'Do I need to carry a printed physical ticket?',
      a: 'A printed copy is welcome, but a digital ticket on your smartphone screen is completely sufficient. Our gate staff will scan your QR code directly from your device.',
    },
    {
      q: 'Is there any registration fee for Rankers Meet 2026?',
      a: 'No. Registration, felicitation, honors, and refreshments are completely complimentary for all verified Yasir Ali Classes rankers and their accompanying parents.',
    },
  ],
};
