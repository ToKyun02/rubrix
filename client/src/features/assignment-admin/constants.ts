import { TierSchema, TrackSchema, type Tier } from './hooks/types';

export const TIER_LABEL: Record<Tier, string> = {
  BRONZE: '브론즈',
  SILVER: '실버',
  GOLD: '골드',
  PLATINUM: '플래티넘',
  DIAMOND: '다이아',
};

export const TIER_COLOR_CLASS: Record<Tier, string> = {
  BRONZE: 'text-tier-bronze',
  SILVER: 'text-tier-silver',
  GOLD: 'text-tier-gold',
  PLATINUM: 'text-tier-platinum',
  DIAMOND: 'text-tier-diamond',
};

export const TIER_OPTIONS = TierSchema.options.map((value) => ({
  value,
  label: TIER_LABEL[value],
}));

export const TRACK_OPTIONS = TrackSchema.options.map((value) => ({
  value,
  label: value,
}));
