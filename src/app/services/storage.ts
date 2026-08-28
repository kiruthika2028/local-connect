import { Injectable, signal, computed } from '@angular/core';
import { Provider, Review, ProviderWithRating, SkillType, AvailabilityType, ProviderStatus } from '../models/provider.model';

const STORAGE_KEY_PROVIDERS = 'localconnect_providers_v2';
const STORAGE_KEY_REVIEWS = 'localconnect_reviews_v2';
const STORAGE_KEY_ADMIN_AUTH = 'localconnect_admin_logged_in';

// High-quality SVG avatars for sample providers
const createSvgAvatar = (bg: string, text: string, iconBg: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <rect width="160" height="160" rx="32" fill="${bg}"/>
    <circle cx="80" cy="58" r="30" fill="${iconBg}"/>
    <path d="M30 142 C30 102 50 92 80 92 C110 92 130 102 130 142 Z" fill="${iconBg}"/>
    <text x="80" y="66" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">${text}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const SEED_PROVIDERS: Provider[] = [
  {
    id: 'prov-1',
    name: 'K. Murugesan (முருகேசன்)',
    photoUrl: createSvgAvatar('#0284c7', 'KM', '#0369a1'),
    phone: '9842156780',
    skill: 'Electrician',
    location: 'Pollachi (பொள்ளாச்சி)',
    availability: 'now',
    experienceYears: 12,
    bio: 'House wiring, motor rewinding, inverter installation, and 3-phase agricultural pump maintenance.',
    status: 'approved',
    createdAt: '2026-08-10T09:00:00Z',
    approvedAt: '2026-08-10T10:00:00Z',
    contactCount: 48
  },
  {
    id: 'prov-2',
    name: 'S. Selvakumar (செல்வக்குமார்)',
    photoUrl: createSvgAvatar('#0d9488', 'SS', '#0f766e'),
    phone: '9443218765',
    skill: 'Plumber',
    location: 'Tenkasi (தென்காசி)',
    availability: 'today',
    experienceYears: 9,
    bio: 'Pipeline fitting, borewell motor connection, bathroom sanitary works, and leak repairs.',
    status: 'approved',
    createdAt: '2026-08-12T11:30:00Z',
    approvedAt: '2026-08-12T12:00:00Z',
    contactCount: 34
  },
  {
    id: 'prov-3',
    name: 'M. Manimegalai (மணிமேகலை)',
    photoUrl: createSvgAvatar('#db2777', 'MM', '#be185d'),
    phone: '9789456123',
    skill: 'Tailor',
    location: 'Thiruvannamalai (திருவண்ணாமலை)',
    availability: 'now',
    experienceYears: 15,
    bio: 'Blouse Aari embroidery, churidar, school uniforms, and gents clothing alteration specialist.',
    status: 'approved',
    createdAt: '2026-08-14T08:15:00Z',
    approvedAt: '2026-08-14T09:00:00Z',
    contactCount: 52
  },
  {
    id: 'prov-4',
    name: 'P. Anand Raj, M.Sc (ஆனந்த் ராஜ்)',
    photoUrl: createSvgAvatar('#7c3aed', 'AR', '#6d28d9'),
    phone: '9865321478',
    skill: 'Tutor',
    location: 'Kumbakonam (கும்பகோணம்)',
    availability: 'this_week',
    experienceYears: 7,
    bio: 'Maths and Science tuition for 6th to 12th standard (State Board & CBSE). Special care for slow learners.',
    status: 'approved',
    createdAt: '2026-08-15T14:20:00Z',
    approvedAt: '2026-08-15T15:00:00Z',
    contactCount: 29
  },
  {
    id: 'prov-5',
    name: 'V. Palanichamy (பழனிச்சாமி)',
    photoUrl: createSvgAvatar('#d97706', 'VP', '#b45309'),
    phone: '9488765432',
    skill: 'Carpenter',
    location: 'Gobichettipalayam (கோபி)',
    availability: 'today',
    experienceYears: 20,
    bio: 'Teakwood pooja doors, modular kitchen cabinets, wooden cot, and window frame repairs.',
    status: 'approved',
    createdAt: '2026-08-16T10:00:00Z',
    approvedAt: '2026-08-16T11:00:00Z',
    contactCount: 41
  },
  {
    id: 'prov-6',
    name: 'G. Vignesh (விக்னேஷ்)',
    photoUrl: createSvgAvatar('#ea580c', 'GV', '#c2410c'),
    phone: '9944123890',
    skill: 'Auto Driver',
    location: 'Sivakasi (சிவகாசி)',
    availability: 'now',
    experienceYears: 6,
    bio: '24x7 local passenger auto, hospital emergency trips, and village goods parcel delivery.',
    status: 'approved',
    createdAt: '2026-08-18T07:45:00Z',
    approvedAt: '2026-08-18T08:30:00Z',
    contactCount: 65
  },
  {
    id: 'prov-7',
    name: 'R. Muthuvel Mesthri (முத்துவேல் மேஸ்திரி)',
    photoUrl: createSvgAvatar('#475569', 'RM', '#334155'),
    phone: '9629874512',
    skill: 'Mason',
    location: 'Ambasamudram (அம்பாசமுத்திரம்)',
    availability: 'this_week',
    experienceYears: 25,
    bio: 'Building construction, compound wall, tile & granite laying, and plastering work.',
    status: 'approved',
    createdAt: '2026-08-20T16:00:00Z',
    approvedAt: '2026-08-20T17:00:00Z',
    contactCount: 38
  },
  {
    id: 'prov-8',
    name: 'C. Karthikeyan (கார்த்திகேயன்)',
    photoUrl: createSvgAvatar('#059669', 'CK', '#047857'),
    phone: '9751234890',
    skill: 'Painter',
    location: 'Dindigul (திண்டுக்கல்)',
    availability: 'today',
    experienceYears: 8,
    bio: 'Interior & exterior emulsion painting, wood polish, and wall putty finish with own spraying gear.',
    status: 'approved',
    createdAt: '2026-08-22T13:10:00Z',
    approvedAt: '2026-08-22T14:00:00Z',
    contactCount: 22
  },
  {
    id: 'prov-9',
    name: 'A. Subbiah (சுப்பையா)',
    photoUrl: createSvgAvatar('#4f46e5', 'AS', '#4338ca'),
    phone: '9843678129',
    skill: 'Appliance Repair',
    location: 'Melur (மேலூர்)',
    availability: 'now',
    experienceYears: 11,
    bio: 'Washing machine, refrigerator, grinder, mixer, and fan repair on-site in surrounding villages.',
    status: 'approved',
    createdAt: '2026-08-24T09:40:00Z',
    approvedAt: '2026-08-24T10:30:00Z',
    contactCount: 57
  }
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    providerId: 'prov-1',
    reviewerName: 'V. Sundaram',
    reviewerLocation: 'Pollachi North',
    rating: 5,
    comment: 'Quick response for farm motor wiring. Arrived within 30 minutes and resolved the issue neatly.',
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'rev-2',
    providerId: 'prov-1',
    reviewerName: 'K. Lakshmi',
    reviewerLocation: 'Anaimalai',
    rating: 5,
    comment: 'Very polite and fair pricing for house electrical fitting.',
    createdAt: '2026-08-18T14:30:00Z'
  },
  {
    id: 'rev-3',
    providerId: 'prov-2',
    reviewerName: 'Thiru. Muthu',
    reviewerLocation: 'Tenkasi Town',
    rating: 4,
    comment: 'Fixed overhead tank pipeline leak without damaging tiles. Excellent plumbing knowledge.',
    createdAt: '2026-08-19T11:20:00Z'
  },
  {
    id: 'rev-4',
    providerId: 'prov-3',
    reviewerName: 'S. Revathi',
    reviewerLocation: 'Thiruvannamalai',
    rating: 5,
    comment: 'Aari work embroidery was tailored with perfect finishing in time for our family function.',
    createdAt: '2026-08-21T16:00:00Z'
  },
  {
    id: 'rev-5',
    providerId: 'prov-4',
    reviewerName: 'B. Senthil Kumar',
    reviewerLocation: 'Kumbakonam',
    rating: 5,
    comment: 'My son scored 92% in 10th Maths after Anand master coaching. Very patient and clear.',
    createdAt: '2026-08-22T18:00:00Z'
  },
  {
    id: 'rev-6',
    providerId: 'prov-6',
    reviewerName: 'M. Pandian',
    reviewerLocation: 'Sivakasi Bypass',
    rating: 5,
    comment: 'Very helpful night auto service for emergency hospital drop. Highly dependable brother.',
    createdAt: '2026-08-23T22:15:00Z'
  },
  {
    id: 'rev-7',
    providerId: 'prov-9',
    reviewerName: 'A. Chitra',
    reviewerLocation: 'Melur Bazaar',
    rating: 5,
    comment: 'Repaired our refrigerator cooling problem in 1 hour on the same day. Saved our groceries!',
    createdAt: '2026-08-25T15:40:00Z'
  }
];

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly providersSignal = signal<Provider[]>(this.loadProviders());
  private readonly reviewsSignal = signal<Review[]>(this.loadReviews());
  readonly isAdminLoggedIn = signal<boolean>(this.loadAdminAuth());

  // Public readonly signals
  readonly providers = this.providersSignal.asReadonly();
  readonly reviews = this.reviewsSignal.asReadonly();

  // Filtered/Computed lists
  readonly approvedProvidersWithRatings = computed<ProviderWithRating[]>(() => {
    const allProviders = this.providersSignal();
    const allReviews = this.reviewsSignal();

    return allProviders
      .filter(p => p.status === 'approved')
      .map(provider => {
        const providerReviews = allReviews.filter(r => r.providerId === provider.id);
        const totalReviews = providerReviews.length;
        const averageRating = totalReviews > 0 
          ? Number((providerReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
          : 0;

        // Sort reviews descending by date
        const sortedReviews = [...providerReviews].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return {
          ...provider,
          averageRating,
          totalReviews,
          latestReviews: sortedReviews
        };
      });
  });

  readonly pendingProviders = computed<Provider[]>(() => {
    return this.providersSignal()
      .filter(p => p.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  readonly pendingCount = computed<number>(() => {
    return this.pendingProviders().length;
  });

  readonly totalApprovedCount = computed<number>(() => {
    return this.approvedProvidersWithRatings().length;
  });

  readonly distinctLocations = computed<string[]>(() => {
    const locations = this.approvedProvidersWithRatings().map(p => p.location.trim());
    return Array.from(new Set(locations)).sort();
  });

  readonly distinctSkills = computed<SkillType[]>(() => {
    const skills = this.approvedProvidersWithRatings().map(p => p.skill);
    return Array.from(new Set(skills));
  });

  readonly totalDirectContacts = computed<number>(() => {
    return this.providersSignal().reduce((acc, p) => acc + (p.contactCount || 0), 0);
  });

  constructor() {
    // Initial verification of localStorage availability
    this.ensureSeedDataLoaded();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private loadProviders(): Provider[] {
    if (this.isBrowser()) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_PROVIDERS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to parse providers from localStorage:', e);
      }
    }
    return SEED_PROVIDERS;
  }

  private loadReviews(): Review[] {
    if (this.isBrowser()) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to parse reviews from localStorage:', e);
      }
    }
    return SEED_REVIEWS;
  }

  private loadAdminAuth(): boolean {
    if (this.isBrowser()) {
      return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    }
    return false;
  }

  private ensureSeedDataLoaded(): void {
    if (this.isBrowser()) {
      if (!localStorage.getItem(STORAGE_KEY_PROVIDERS)) {
        this.saveProviders(SEED_PROVIDERS);
      }
      if (!localStorage.getItem(STORAGE_KEY_REVIEWS)) {
        this.saveReviews(SEED_REVIEWS);
      }
    }
  }

  private saveProviders(list: Provider[]): void {
    this.providersSignal.set(list);
    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(list));
      } catch (e) {
        console.error('Failed to save providers to localStorage:', e);
      }
    }
  }

  private saveReviews(list: Review[]): void {
    this.reviewsSignal.set(list);
    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(list));
      } catch (e) {
        console.error('Failed to save reviews to localStorage:', e);
      }
    }
  }

  // --- CRUD Operations ---

  // 1. Check duplicate phone number
  isPhoneRegistered(phone: string, excludeId?: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    return this.providersSignal().some(p => {
      if (excludeId && p.id === excludeId) return false;
      const existingClean = p.phone.replace(/\D/g, '').slice(-10);
      return existingClean === cleanPhone;
    });
  }

  // 2. Register new provider (defaults to 'pending' status)
  addProvider(data: {
    name: string;
    photoUrl?: string;
    phone: string;
    skill: SkillType;
    customSkill?: string;
    location: string;
    availability: AvailabilityType;
    experienceYears?: number;
    bio?: string;
  }): { success: boolean; error?: string; provider?: Provider } {
    const cleanPhone = data.phone.trim();
    if (this.isPhoneRegistered(cleanPhone)) {
      return { success: false, error: 'duplicate_phone' };
    }

    const defaultAvatar = createSvgAvatar('#0284c7', data.name.slice(0, 2).toUpperCase(), '#0369a1');

    const newProvider: Provider = {
      id: 'prov-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: data.name.trim(),
      photoUrl: data.photoUrl && data.photoUrl.length > 20 ? data.photoUrl : defaultAvatar,
      phone: cleanPhone,
      skill: data.skill,
      customSkill: data.customSkill?.trim(),
      location: data.location.trim(),
      availability: data.availability,
      experienceYears: data.experienceYears,
      bio: data.bio?.trim(),
      status: 'pending', // IMPORTANT: pending until approved by admin
      createdAt: new Date().toISOString(),
      contactCount: 0
    };

    const updated = [newProvider, ...this.providersSignal()];
    this.saveProviders(updated);
    return { success: true, provider: newProvider };
  }

  // 3. Approve provider
  approveProvider(providerId: string): void {
    const updated = this.providersSignal().map(p => {
      if (p.id === providerId) {
        return {
          ...p,
          status: 'approved' as ProviderStatus,
          approvedAt: new Date().toISOString()
        };
      }
      return p;
    });
    this.saveProviders(updated);
  }

  // 4. Reject provider (permanently remove or change status to rejected)
  rejectProvider(providerId: string): void {
    const updated = this.providersSignal().filter(p => p.id !== providerId);
    this.saveProviders(updated);
  }

  // 5. Delete provider (and related reviews)
  deleteProvider(providerId: string): void {
    const updatedProviders = this.providersSignal().filter(p => p.id !== providerId);
    const updatedReviews = this.reviewsSignal().filter(r => r.providerId !== providerId);
    this.saveProviders(updatedProviders);
    this.saveReviews(updatedReviews);
  }

  // 6. Add review
  addReview(data: {
    providerId: string;
    reviewerName: string;
    reviewerLocation?: string;
    rating: number;
    comment?: string;
  }): Review {
    const newReview: Review = {
      id: 'rev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      providerId: data.providerId,
      reviewerName: data.reviewerName.trim() || 'Village Resident',
      reviewerLocation: data.reviewerLocation?.trim(),
      rating: Math.max(1, Math.min(5, data.rating)),
      comment: data.comment?.trim() || '',
      createdAt: new Date().toISOString()
    };

    const updated = [newReview, ...this.reviewsSignal()];
    this.saveReviews(updated);
    return newReview;
  }

  // 7. Increment contact click count
  logContact(providerId: string): void {
    const updated = this.providersSignal().map(p => {
      if (p.id === providerId) {
        return {
          ...p,
          contactCount: (p.contactCount || 0) + 1
        };
      }
      return p;
    });
    this.saveProviders(updated);
  }

  // 8. Admin Auth
  loginAdmin(passcode: string): boolean {
    if (passcode.trim() === 'admin123' || passcode.trim() === 'namma2026') {
      this.isAdminLoggedIn.set(true);
      if (this.isBrowser()) {
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      }
      return true;
    }
    return false;
  }

  logoutAdmin(): void {
    this.isAdminLoggedIn.set(false);
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    }
  }

  // 9. Reset seed data for testing
  resetSeedData(): void {
    this.saveProviders(SEED_PROVIDERS);
    this.saveReviews(SEED_REVIEWS);
  }
}
