import { useGameLaunchStore, type GameLaunchAttempt } from '../stores/gameLaunchStore';
import { Icon } from './Icon';
import { SimmButton } from './primitives';

export function launchStatusCopy(attempt: GameLaunchAttempt): string {
  if (attempt.detail) return attempt.detail;
  if (attempt.state === 'exited') return 'Schedule I closed before MelonLoader startup was confirmed.';
  if (attempt.snapshot?.processState === 'running') return attempt.snapshot.loaderState === 'notInstalled' ? 'Schedule I is running.' : 'Schedule I is running; MelonLoader has not been confirmed.';
  if (attempt.snapshot?.processState === 'unknown') return 'SIMM could not inspect whether Schedule I is running. Startup remains unconfirmed.';
  if (attempt.state === 'unconfirmed') return 'SIMM could not confirm that Schedule I started.';
  return 'SIMM is checking for the selected game process and startup log.';
}

interface GameLaunchStatusViewProps {
  attempts: ReadonlyMap<string, GameLaunchAttempt>;
  onViewLogs: (environmentId: string) => void;
  checkAgain: (environmentId: string) => void;
  dismissNotice: (environmentId: string) => void;
}

export function GameLaunchStatus({ onViewLogs }: { onViewLogs: (environmentId: string) => void }) {
  const { attempts, checkAgain, dismissNotice } = useGameLaunchStore();
  return <GameLaunchStatusView attempts={attempts} checkAgain={checkAgain} dismissNotice={dismissNotice} onViewLogs={onViewLogs} />;
}

export function GameLaunchStatusView({ attempts, checkAgain, dismissNotice, onViewLogs }: GameLaunchStatusViewProps) {
  const visible = [...attempts.values()].filter((attempt) => !attempt.noticeDismissed && ['checking', 'slow', 'unconfirmed', 'exited'].includes(attempt.state));
  if (visible.length === 0) return null;
  return (
    <section className="game-launch-status" aria-label="Game launch status">
      {visible.map((attempt) => (
        <div key={attempt.attemptId} className="game-launch-status__notice" role="status" aria-live="polite" aria-atomic="true">
          <Icon name="circleInfo" aria-hidden="true" />
          <div className="game-launch-status__content">
            <strong>{attempt.state === 'slow' ? 'Schedule I is taking longer to start' : attempt.state === 'checking' ? 'Starting Schedule I' : 'Schedule I startup status'}</strong>
            <span className="game-launch-status__environment">{attempt.environmentName}</span>
            <p>{launchStatusCopy(attempt)}</p>
            {attempt.snapshot?.diagnostic ? <p>{attempt.snapshot.diagnostic}</p> : null}
            {attempt.snapshot?.logPath ? <span className="game-launch-status__path">{attempt.snapshot.logPath}</span> : null}
          </div>
          <div className="game-launch-status__actions">
            <SimmButton className="btn btn-secondary" variant="outline" size="sm" onClick={() => onViewLogs(attempt.environmentId)}>View logs</SimmButton>
            {['unconfirmed', 'exited'].includes(attempt.state) ? <SimmButton className="btn btn-secondary" variant="outline" size="sm" onClick={() => checkAgain(attempt.environmentId)}>Check again</SimmButton> : null}
            <SimmButton className="btn btn-secondary" variant="ghost" size="sm" onClick={() => dismissNotice(attempt.environmentId)}>Dismiss</SimmButton>
          </div>
        </div>
      ))}
    </section>
  );
}
