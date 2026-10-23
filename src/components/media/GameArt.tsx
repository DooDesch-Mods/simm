import { useState } from 'react';

import { cn } from '@/lib/utils';

export type GameArtVariant = 'header' | 'hero';

/** Official store artwork for a Steam app, loaded at runtime from Steam's CDN. */
export function steamArtUrl(appId: string, variant: GameArtVariant): string {
  const file = variant === 'hero' ? 'library_hero.jpg' : 'header.jpg';
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${encodeURIComponent(appId)}/${file}`;
}

interface GameArtProps {
  appId: string;
  variant?: GameArtVariant;
  className?: string;
}

/**
 * The game's own artwork. Purely decorative and optional: offline or when the
 * CDN refuses, the element removes itself and the layout keeps working.
 */
export function GameArt({ appId, variant = 'header', className }: GameArtProps) {
  const [failed, setFailed] = useState(false);
  if (!appId || failed) return null;
  return (
    <span className={cn('ui-game-art', `ui-game-art--${variant}`, className)} aria-hidden="true">
      <img src={steamArtUrl(appId, variant)} alt="" loading="lazy" decoding="async" draggable={false} onError={() => setFailed(true)} />
    </span>
  );
}
