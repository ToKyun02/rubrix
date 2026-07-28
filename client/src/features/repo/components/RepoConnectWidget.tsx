import { Button } from '@/atom-components/Button';
import { Listbox } from '@/atom-components/Listbox';
import { Card } from '@/composition-components/Card';
import GithubAppOnboardingModal from '@/features/github-app/components/GithubAppOnboardingModal';
import {
  useGithubAppStatus,
  useGithubRepos,
} from '@/features/github-app/hooks/queries';
import {
  useAssignmentRepo,
  useConnectRepo,
} from '@/features/repo/hooks/queries';
import { useState } from 'react';

interface RepoConnectWidgetProps {
  assignmentId: string;
}

export function RepoConnectWidget({ assignmentId }: RepoConnectWidgetProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState('');

  const { data: status } = useGithubAppStatus();
  const { data: repos } = useGithubRepos(!!status?.connected);
  const { data: repo } = useAssignmentRepo(assignmentId);
  const connectRepo = useConnectRepo();

  if (!status) return null;

  if (repo) {
    return (
      <Card className="flex flex-col gap-2 p-4.5 text-[13px]">
        <span className="text-muted">연결된 레포</span>
        <a
          href={`https://github.com/${repo.githubFullName}`}
          target="_blank"
          rel="noreferrer"
          className="text-heading font-bold hover:underline"
        >
          {repo.githubFullName}
        </a>
      </Card>
    );
  }

  if (!status.connected) {
    return (
      <>
        <Card className="flex flex-col gap-3 p-4.5 text-[13px]">
          <span className="text-muted">
            이 과제를 시작하려면 GitHub 레포 연결이 필요해요
          </span>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            레포 연결하고 시작하기
          </Button>
        </Card>
        <GithubAppOnboardingModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onInstall={() => {
            window.location.href = `https://github.com/apps/${import.meta.env.VITE_GITHUB_APP_SLUG}/installations/new?state=${assignmentId}`;
          }}
        />
      </>
    );
  }

  return (
    <Card className="flex flex-col gap-3 p-4.5 text-[13px]">
      <span className="text-muted">이 과제에 연결할 레포를 선택하세요</span>
      <Listbox
        value={selected}
        onChange={setSelected}
        options={(repos ?? []).map((name) => ({ value: name, label: name }))}
        placeholder="레포 선택"
      />
      <Button
        size="sm"
        disabled={!selected || connectRepo.isPending}
        onClick={() =>
          connectRepo.mutate({ assignmentId, githubFullName: selected })
        }
      >
        연결하기
      </Button>
    </Card>
  );
}
