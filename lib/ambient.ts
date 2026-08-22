/**
 * Shared registry bridging the ambient background canvas and the connector
 * layer. The canvas publishes its orb positions (in viewport coordinates)
 * every frame; connectors read them to draw live links onto moving orbs.
 */

export type AmbientAnchor = {
  id: number;
  /** Viewport x, in CSS pixels. */
  x: number;
  /** Viewport y, in CSS pixels. */
  y: number;
  /** Visual core radius of the orb, used to land lines on its edge. */
  radius: number;
};

const anchors = new Map<number, AmbientAnchor>();

export function publishAnchor(anchor: AmbientAnchor) {
  anchors.set(anchor.id, anchor);
}

export function clearAnchors() {
  anchors.clear();
}

export function hasAnchors() {
  return anchors.size > 0;
}

/**
 * Nearest orb to a viewport point. Orbs parked far offscreen are skipped so
 * connectors always land on something the user can actually see.
 */
export function nearestAnchor(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number
): AmbientAnchor | null {
  let best: AmbientAnchor | null = null;
  let bestDist = Infinity;

  for (const anchor of anchors.values()) {
    const margin = anchor.radius * 0.5;
    if (
      anchor.x < -margin ||
      anchor.x > viewportWidth + margin ||
      anchor.y < -margin ||
      anchor.y > viewportHeight + margin
    ) {
      continue;
    }
    const dist = Math.hypot(anchor.x - x, anchor.y - y);
    if (dist < bestDist) {
      bestDist = dist;
      best = anchor;
    }
  }

  return best;
}

export function getAnchor(id: number): AmbientAnchor | null {
  return anchors.get(id) ?? null;
}
