import type { RateRule } from "./config";
import { abuseStore } from "./store";

export type RateVerdict = {
  allowed: boolean;
  /** The strictest rule that was exceeded, if any. */
  exceeded: RateRule | null;
  retryAfterSeconds: number;
  /** `ruleId -> count` after this request, for logging. */
  counts: Record<string, number>;
};

const toRetryAfterSeconds = (resetAt: number) =>
  Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));

/**
 * Consumes one unit from every rule in the scope. Every rule is always
 * incremented, even when an earlier one already failed, so an attacker cannot
 * pick which counter to spend by varying the request.
 */
export const consumeRateRules = async (
  scope: string,
  identifier: string,
  rules: readonly RateRule[]
): Promise<RateVerdict> => {
  const counts: Record<string, number> = {};
  let exceeded: RateRule | null = null;
  let retryAfterSeconds = 0;

  for (const rule of rules) {
    const { count, resetAt } = await abuseStore.increment(
      `${scope}:${rule.id}:${identifier}`,
      rule.windowMs
    );

    counts[rule.id] = count;

    if (count <= rule.limit) {
      continue;
    }

    const ruleRetryAfter = toRetryAfterSeconds(resetAt);

    if (ruleRetryAfter > retryAfterSeconds) {
      exceeded = rule;
      retryAfterSeconds = ruleRetryAfter;
    }
  }

  return {
    allowed: exceeded === null,
    exceeded,
    retryAfterSeconds,
    counts,
  };
};
