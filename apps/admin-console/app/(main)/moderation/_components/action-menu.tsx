import {
  Menu,
  MenuTrigger,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuContent,
} from '@/components/ui/multi-mode-menu';
import { PropsWithChildren } from 'react';

type ActionMenuProps = PropsWithChildren & {
  mode: 'context' | 'dropdown';
  reportId: number;
};
const ActionMenu: React.FC<ActionMenuProps> = ({
  mode,
  reportId,
  children,
}) => {
  return (
    <Menu mode={mode}>
      <MenuTrigger mode={mode} asChild>
        {children}
      </MenuTrigger>
      <MenuContent mode={mode}>
        <MenuLabel mode={mode}>Actions: {reportId}</MenuLabel>
        <MenuItem mode={mode}>Approve</MenuItem>
        <MenuItem mode={mode}>Reject</MenuItem>
        <MenuSeparator mode={mode} />
        <MenuItem mode={mode}>Delete</MenuItem>
      </MenuContent>
    </Menu>
  );
};

export default ActionMenu;
