export type TwoRegions = { onlyA: string; onlyB: string; both: string; out: string };
export type ThreeRegions = { onlyA: string; onlyB: string; onlyC: string; ab: string; ac: string; bc: string; abc: string; out: string };

export const emptyTwo: TwoRegions = { onlyA: '', onlyB: '', both: '', out: '' };
export const emptyThree: ThreeRegions = { onlyA: '', onlyB: '', onlyC: '', ab: '', ac: '', bc: '', abc: '', out: '' };

export function parseCount(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return Number.NaN;
  return Number(trimmed);
}

function count(value: string): number {
  const parsed = parseCount(value);
  return parsed === null || !Number.isFinite(parsed) ? 0 : parsed;
}

export function twoSetTotals(regions: TwoRegions) {
  const onlyA = count(regions.onlyA);
  const onlyB = count(regions.onlyB);
  const both = count(regions.both);
  const out = count(regions.out);
  return {
    onlyA,
    onlyB,
    both,
    out,
    a: onlyA + both,
    b: onlyB + both,
    union: onlyA + onlyB + both,
    total: onlyA + onlyB + both + out,
  };
}

export function threeSetTotals(regions: ThreeRegions) {
  const onlyA = count(regions.onlyA);
  const onlyB = count(regions.onlyB);
  const onlyC = count(regions.onlyC);
  const ab = count(regions.ab);
  const ac = count(regions.ac);
  const bc = count(regions.bc);
  const abc = count(regions.abc);
  const out = count(regions.out);
  return {
    onlyA,
    onlyB,
    onlyC,
    ab,
    ac,
    bc,
    abc,
    out,
    a: onlyA + ab + ac + abc,
    b: onlyB + ab + bc + abc,
    c: onlyC + ac + bc + abc,
    union: onlyA + onlyB + onlyC + ab + ac + bc + abc,
    total: onlyA + onlyB + onlyC + ab + ac + bc + abc + out,
  };
}
