import {
  Menu,
  MenuTrigger,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuContent,
} from '@/components/ui/multi-mode-menu';
import { PropsWithChildren } from 'react';
import { acceptReport, rejectReport, reopenReport } from './actions';

type ActionMenuProps = PropsWithChildren & {
  mode: 'context' | 'dropdown';
  reportId: number;
  currentStatus: 'reported' | 'accepted' | 'rejected';
};
const ActionMenu: React.FC<ActionMenuProps> = ({
  mode,
  reportId,
  currentStatus,
  children,
}) => {
  const acceptReportDispatch = acceptReport.bind(null, reportId);
  const rejectReportDispatch = rejectReport.bind(null, reportId);
  const reopenReportDispatch = reopenReport.bind(null, reportId);

  return (
    <Menu mode={mode}>
      <MenuTrigger mode={mode} asChild>
        {children}
      </MenuTrigger>
      <MenuContent mode={mode}>
        <MenuLabel mode={mode}>Actions</MenuLabel>
        {currentStatus === 'reported' && (
          <form action={acceptReportDispatch} className='contents'>
            <button type='submit' className='contents'>
              <MenuItem mode={mode}>Accept</MenuItem>
            </button>
          </form>
        )}
        {currentStatus === 'reported' && (
          <form action={rejectReportDispatch} className='contents'>
            <button type='submit' className='contents'>
              <MenuItem mode={mode}>Reject</MenuItem>
            </button>
          </form>
        )}
        {currentStatus !== 'reported' && (
          <form action={reopenReportDispatch} className='contents'>
            <button type='submit' className='contents'>
              <MenuItem mode={mode}>Reopen</MenuItem>
            </button>
          </form>
        )}
        {/* <MenuSeparator mode={mode} />
        <MenuItem mode={mode}>Delete</MenuItem> */}
      </MenuContent>
    </Menu>
  );
};

export default ActionMenu;
