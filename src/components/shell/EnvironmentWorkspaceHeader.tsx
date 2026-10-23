import type { Environment } from '../../types';
import { Icon } from '../Icon';
import type { IconName } from '../icons';
import { SimmButton } from '../primitives';
import {
  environmentGameVersion,
  environmentSourceLabel,
  runtimeLabel,
  runtimeTagClass,
  summarizeEnvironmentStatus,
} from './environmentPresentation';

export type EnvironmentWorkspaceTab = 'overview' | 'mods' | 'plugins' | 'userLibs' | 'config' | 'logs';

const TABS: ReadonlyArray<{ id: EnvironmentWorkspaceTab; label: string; icon: IconName }> = [
  { id: 'overview', label: 'Overview', icon: 'hardDrive' },
  { id: 'mods', label: 'Mods', icon: 'puzzlePiece' },
  { id: 'plugins', label: 'Plugins', icon: 'plug' },
  { id: 'userLibs', label: 'UserLibs', icon: 'book' },
  { id: 'config', label: 'Config', icon: 'fileCode' },
  { id: 'logs', label: 'Logs', icon: 'fileLines' },
];

interface EnvironmentWorkspaceHeaderProps {
  environment: Environment;
  activeTab: EnvironmentWorkspaceTab;
  modUpdateCount: number;
  launching: boolean;
  onSelectTab: (tab: EnvironmentWorkspaceTab) => void;
  onLaunch: () => void;
}

/**
 * Header of the environment workspace: which install this is, its one status,
 * the Play action, and the tabs that hold every per-environment tool.
 */
export function EnvironmentWorkspaceHeader({
  environment,
  activeTab,
  modUpdateCount,
  launching,
  onSelectTab,
  onLaunch,
}: EnvironmentWorkspaceHeaderProps) {
  const status = summarizeEnvironmentStatus(environment, modUpdateCount);
  const gameVersion = environmentGameVersion(environment);
  const playable = environment.status === 'completed';

  return (
    <header className="env-header">
      <div className="env-header__main">
        <div className="env-header__titles">
          <div className="env-header__title-row">
            <h1 className="ui-page-title env-header__title" title={environment.name}>{environment.name}</h1>
            <span className={`ui-status ui-status--${status.tone}`}>{status.label}</span>
          </div>
          <div className="ui-meta env-header__meta">
            <span className={runtimeTagClass(environment.runtime)}>{runtimeLabel(environment.runtime)}</span>
            <span>{environmentSourceLabel(environment)}</span>
            {gameVersion && <span className="ui-num">Game {gameVersion}</span>}
            <span className="ui-num">
              {environment.melonLoaderVersion ? `MelonLoader ${environment.melonLoaderVersion}` : 'No MelonLoader'}
            </span>
          </div>
        </div>
        <SimmButton
          type="button"
          className="env-header__play"
          onClick={onLaunch}
          disabled={!playable || launching}
          aria-label={`Play ${environment.name}`}
        >
          <Icon name={launching ? 'spinner' : 'play'} spin={launching} />
          {launching ? 'Starting…' : 'Play'}
        </SimmButton>
      </div>
      <nav className="ui-tabs-line env-header__tabs" aria-label={`${environment.name} sections`}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="ui-tabs-line__tab"
            aria-current={activeTab === tab.id ? 'page' : undefined}
            onClick={() => onSelectTab(tab.id)}
          >
            <Icon name={tab.icon} />
            {tab.label}
            {tab.id === 'mods' && modUpdateCount > 0 && (
              <span
                className="ui-tabs-line__count ui-tabs-line__count--attention"
                aria-label={`${modUpdateCount} updates`}
              >
                {modUpdateCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </header>
  );
}
