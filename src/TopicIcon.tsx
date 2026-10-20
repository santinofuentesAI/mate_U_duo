import { MessageCircle, Link, Table2, Sparkles, Search, Zap, Puzzle, Landmark, Globe, ArrowLeftRight, Layers, Grid2X2, Package, Merge, Ruler, CircleDot, Users, Sprout, Calculator, Blocks, TriangleAlert, Divide, Sigma, CalendarDays, Dices, Compass, Target, PartyPopper, Scale, Hash, Copy } from 'lucide-react';

const icons: Record<string, typeof Calculator> = {
  '💬': MessageCircle, '🔗': Link, '▦': Table2, '✨': Sparkles, '🔎': Search, '⚡': Zap, '🧩': Puzzle, '🏛️': Landmark, '🌐': Globe, '∀': Sigma, '↔': ArrowLeftRight, '🪆': Layers, '🔢': Grid2X2, '📦': Package, '∪': Merge, '📏': Ruler, '◉': CircleDot, '👥': Users, '🌱': Sprout, '🧮': Calculator, '🧱': Blocks, '🚧': TriangleAlert, '➗': Divide, '√': Sigma, '🗓️': CalendarDays, '🎲': Dices, '🧭': Compass, '🎯': Target, '🎉': PartyPopper, '⚖️': Scale, '⧉': Copy, '#️⃣': Hash,
};

const fills = ['#d5c2fa', '#9be3bc', '#ffcf76', '#c0e9fa', '#ffd0c7', '#c9e4ff', '#f5d0f0', '#d4f0c2', '#ffe8a3', '#b8d4ff', '#ffc9b8', '#c5f0e8', '#e4d4ff', '#fde4b8', '#bfe8d4'];
const pool = [MessageCircle, Link, Table2, Sparkles, Search, Zap, Puzzle, Landmark, Globe, Sigma, ArrowLeftRight, Layers, Grid2X2, Package, Merge, Ruler, CircleDot, Users, Sprout, Calculator, Blocks, Divide, CalendarDays, Dices, Compass, Target, Scale, Hash, Copy];

function token(value: string) {
  let n = 2166136261;
  for (const char of value) n = Math.imul(n ^ char.charCodeAt(0), 16777619);
  return n >>> 0;
}

export function TopicIcon({ name, size = 27, topic = '' }: { name: string; size?: number; topic?: string }) {
  const key = topic || name;
  const Icon = icons[name] || pool[token(key) % pool.length];
  const fill = fills[token(key) % fills.length];
  if (size < 24) return <Icon size={size} strokeWidth={2.5} aria-hidden="true"/>;
  return (
    <span className="topic-illustration" aria-hidden="true" style={{ width: size, height: size, background: fill, borderRadius: Math.round(size * 0.28), color: '#30354b' }}>
      <Icon size={Math.round(size * 0.55)} strokeWidth={2.45}/>
    </span>
  );
}
