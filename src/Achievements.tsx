import { Award, Lock, Star, Trophy } from 'lucide-react';
import type { Progress } from './types';
import { achievements, userLevel } from './progress';

interface Props {
  progress: Progress;
}

export function Achievements({ progress }: Props) {
  const earnedAchievements = achievements.filter(a => (progress.achievements || []).includes(a.id));
  const lockedAchievements = achievements.filter(a => !(progress.achievements || []).includes(a.id));
  const levelInfo = userLevel(progress.xp);
  
  return (
    <div className="achievements-view">
      <div className="achievements-header">
        <div className="level-badge-large">
          <div className="level-badge-ring">
            <Trophy size={36} />
          </div>
          <div className="level-info">
            <span className="eyebrow">NIVEL {levelInfo.level}</span>
            <h2>{levelInfo.title}</h2>
            <p>{progress.xp} XP · Siguiente nivel en {levelInfo.nextLevelXP - progress.xp} XP</p>
            <div className="level-progress-bar">
              <div style={{ width: `${levelInfo.progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <section className="achievements-section">
        <h3>
          <Award size={22} />
          Logros desbloqueados ({earnedAchievements.length}/{achievements.length})
        </h3>
        {earnedAchievements.length === 0 ? (
          <p className="empty-state-text">Completá ejercicios para desbloquear tus primeros logros.</p>
        ) : (
          <div className="achievements-grid">
            {earnedAchievements.map(achievement => (
              <div key={achievement.id} className="achievement-card earned">
                <span className="achievement-icon">{achievement.icon}</span>
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
                <span className="achievement-badge">
                  <Star size={14} />
                  Desbloqueado
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="achievements-section">
        <h3>
          <Lock size={22} />
          Por desbloquear ({lockedAchievements.length})
        </h3>
        <div className="achievements-grid">
          {lockedAchievements.map(achievement => (
            <div key={achievement.id} className="achievement-card locked">
              <span className="achievement-icon grayscale">{achievement.icon}</span>
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
              <span className="achievement-badge locked-badge">
                <Lock size={14} />
                Bloqueado
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="achievements-stats">
        <div className="stat-card">
          <Trophy size={24} color="#fbbf24" />
          <b>{earnedAchievements.length}</b>
          <small>Logros desbloqueados</small>
        </div>
        <div className="stat-card">
          <Star size={24} color="#8b5cf6" />
          <b>{progress.xp}</b>
          <small>Experiencia total</small>
        </div>
        <div className="stat-card">
          <Award size={24} color="#10b981" />
          <b>{Math.round((earnedAchievements.length / achievements.length) * 100)}%</b>
          <small>Completado</small>
        </div>
      </div>
    </div>
  );
}
