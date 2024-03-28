/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/display-name */
import { forwardRef, useMemo } from 'react';
import Image from 'next/image';

import { AvatarIcon, useAvatar, AvatarProps as BaseAvatarProps } from '@nextui-org/avatar';

export interface AvatarProps extends BaseAvatarProps { }

const MyAvatar = forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
  const {
    src,
    icon = <AvatarIcon />,
    alt,
    classNames,
    slots,
    name,
    showFallback,
    fallback: fallbackComponent,
    getInitials,
    getAvatarProps,
  } = useAvatar({
    ref,
    ...props,
  });

  const fallback = useMemo(() => {
    if (!showFallback && src) return null;

    const ariaLabel = alt || name || 'avatar';

    if (fallbackComponent) {
      return (
        fallbackComponent
      );
    }

    return name ? (
      <span aria-label={ariaLabel} className={slots.name({ class: classNames?.name })} role='img'>
        {getInitials(name)}
      </span>
    ) : (
      <span aria-label={ariaLabel} className={slots.icon({ class: classNames?.icon })} role='img'>
        {icon}
      </span>
    );
  }, [showFallback, src, fallbackComponent, name, classNames]);

  return (
    <div {...getAvatarProps()} className='rounded-full overflow-clip relative w-full h-full'>
      {src ? (
        <Image
          // className='absolute w-full max-w-md rounded-lg'
          src={src}
          alt='Profile Picture'
          fill
          style={{ objectFit: 'cover' }}
        />
      ) : fallback}
    </div>
  );
});

// Avatar.displayName = 'MyAvatar';

export default MyAvatar;
