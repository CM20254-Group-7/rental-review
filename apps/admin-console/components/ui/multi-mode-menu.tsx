import React, { forwardRef } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
  ContextMenuProps,
  ContextMenuSeparatorProps,
  ContextMenuTriggerProps,
} from '@radix-ui/react-context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DropdownMenuContentProps,
  DropdownMenuLabelProps,
  DropdownMenuProps,
  DropdownMenuSeparatorProps,
  DropdownMenuTriggerProps,
} from '@radix-ui/react-dropdown-menu';

// Menu
type MenuProps =
  | ({ mode: 'context' } & ContextMenuProps)
  | ({ mode: 'dropdown' } & DropdownMenuProps);
const Menu = forwardRef<HTMLElement, MenuProps>((props) => {
  const { mode, ...otherProps } = props;

  if (mode === 'context') {
    return <ContextMenu {...otherProps} />;
  }
  if (mode === 'dropdown') {
    return <DropdownMenu {...otherProps} />;
  }
  throw new Error(`Invalid mode prop: ${mode}`);
});
Menu.displayName = 'Menu';

// MenuTrigger
type MenuTriggerProps =
  | ({ mode: 'context' } & ContextMenuTriggerProps)
  | ({ mode: 'dropdown' } & DropdownMenuTriggerProps);
const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>((props) => {
  const { mode, ...otherProps } = props;

  if (mode === 'context') {
    return <ContextMenuTrigger {...otherProps} />;
  }
  if (mode === 'dropdown') {
    return <DropdownMenuTrigger {...otherProps} />;
  }
  throw new Error(`Invalid mode prop: ${mode}`);
});
MenuTrigger.displayName = 'MenuTrigger';

// MenuItem
type MenuItemProps =
  | ({ mode: 'context' } & ContextMenuItemProps)
  | ({ mode: 'dropdown' } & DropdownMenuProps);
const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>((props) => {
  const { mode, ...otherProps } = props;

  if (mode === 'context') {
    return <ContextMenuItem {...otherProps} />;
  }
  if (mode === 'dropdown') {
    return <DropdownMenuItem {...otherProps} />;
  }
  throw new Error(`Invalid mode prop: ${mode}`);
});
MenuItem.displayName = 'MenuItem';

// MenuLabel
type MenuLabelProps =
  | ({ mode: 'context' } & ContextMenuLabelProps)
  | ({ mode: 'dropdown' } & DropdownMenuLabelProps);
const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>((props) => {
  const { mode, ...otherProps } = props;

  if (mode === 'context') {
    return <ContextMenuLabel {...otherProps} />;
  }
  if (mode === 'dropdown') {
    return <DropdownMenuLabel {...otherProps} />;
  }
  throw new Error(`Invalid mode prop: ${mode}`);
});
MenuLabel.displayName = 'MenuLabel';

// MenuSeparator
type MenuSeparatorProps =
  | ({ mode: 'context' } & ContextMenuSeparatorProps)
  | ({ mode: 'dropdown' } & DropdownMenuSeparatorProps);
const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  (props) => {
    const { mode, ...otherProps } = props;

    if (mode === 'context') {
      return <ContextMenuSeparator {...otherProps} />;
    }
    if (mode === 'dropdown') {
      return <DropdownMenuSeparator {...otherProps} />;
    }
    throw new Error(`Invalid mode prop: ${mode}`);
  },
);
MenuSeparator.displayName = 'MenuSeparator';

// MenuContent
type MenuContentProps =
  | ({ mode: 'context' } & ContextMenuContentProps)
  | ({ mode: 'dropdown' } & DropdownMenuContentProps);
const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>((props) => {
  const { mode, ...otherProps } = props;

  if (mode === 'context') {
    return <ContextMenuContent {...otherProps} />;
  }
  if (mode === 'dropdown') {
    return <DropdownMenuContent {...otherProps} />;
  }
  throw new Error(`Invalid mode prop: ${mode}`);
});
MenuContent.displayName = 'MenuContent';

export { Menu, MenuTrigger, MenuItem, MenuLabel, MenuSeparator, MenuContent };
