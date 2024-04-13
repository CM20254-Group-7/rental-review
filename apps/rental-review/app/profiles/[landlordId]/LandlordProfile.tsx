'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import StarRatingLayout from '@/components/StarRating';
import { createClientSupabaseClient } from '@repo/supabase-client-helpers';
import { useParams } from 'next/navigation';
import { Button, TextInput, Textarea } from '@/components/ClientTremor';
import { useFormState, useFormStatus } from 'react-dom';
import Avatar from '@/components/Avatar';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { ButtonProps } from '@tremor/react';
import {
  ProfilePictureState,
  saveProfile,
  uploadProfilePicture,
} from './actions';

// infer the type of a supabase user
type User = Exclude<
  Awaited<
    ReturnType<ReturnType<typeof createClientSupabaseClient>['auth']['getUser']>
  >['data']['user'],
  null
>;

const MaybeForm: React.FC<{
  editMode: boolean;
  action: (formData: FormData) => void;
  children: React.ReactNode;
}> = ({ editMode, action, children }) => {
  if (!editMode) return children;

  return (
    <form className='contents' action={action}>
      {children}
    </form>
  );
};

const SubmitButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' variant='primary' disabled={pending}>
      {children}
    </Button>
  );
};

const ChangeImageButton: React.FC<ButtonProps> = (props) => {
  const { pending } = useFormStatus();

  return (
    <Button
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      disabled={pending}
    />
  );
};

const LandlordProfile: React.FC<{
  landlordBio: {
    display_name: string;
    average_rating: number;
    display_email: string;
    bio: string;
    profile_picture: string | null;
  };
}> = ({ landlordBio: initialLandlordBio }) => {
  const params = useParams();
  const landlordId = params.landlordId as string;
  const supabase = createClientSupabaseClient();

  const [landlordBio, setLandlordBio] = useState(initialLandlordBio);

  // get the return type of the getUser function

  const [user, setUser] = useState<User | null>();
  const [isUserLandlord, setIsUserLandlord] = useState<boolean>();
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      setUser(supabaseUser);
    };

    fetchUser();
  });

  useEffect(() => {
    if (user) {
      setIsUserLandlord(user.id === landlordId);
    }
  }, [user, landlordId]);

  useEffect(() => {
    if (!isUserLandlord) {
      setEditMode(false);
    }
  }, [isUserLandlord]);

  const [profileState, profileDispatch] = useFormState(
    saveProfile.bind(null, landlordId),
    {},
  );
  const [message, setMessage] = useState(profileState.message);

  useEffect(() => {
    if (profileState.newLandlordBio) {
      setLandlordBio((prev) => ({
        ...prev,
        display_email: profileState.newLandlordBio!.email,
        bio: profileState.newLandlordBio!.bio,
      }));
      setEditMode(false);
    }
    setMessage(profileState.message);
  }, [profileState]);

  // 5 seconds after success message, clear the message
  useEffect(() => {
    if (message && /Saved/i.test(message)) {
      const timeout = setTimeout(() => {
        setMessage(null);
      }, 5000);

      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [message]);

  // set message to null when edit mode is toggled on
  useEffect(() => {
    if (editMode) {
      setMessage(null);
    }
  }, [editMode]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const urlForPath = useCallback(
    (path: string) =>
      supabase.storage.from('landlord_profile_pictures').getPublicUrl(path).data
        .publicUrl,
    [supabase.storage],
  );

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    landlordBio.profile_picture
      ? urlForPath(landlordBio.profile_picture)
      : undefined,
  );

  const initialUrlState: ProfilePictureState | undefined = undefined;
  const [urlState, urlDispatch] = useFormState(
    uploadProfilePicture,
    initialUrlState,
  );

  useEffect(() => {
    if (urlState?.newUrl) setAvatarUrl(urlForPath(urlState.newUrl));
  }, [urlState, urlForPath]);

  return (
    <div className='bg-secondary/30 shadow-secondary/40 relative flex w-full flex-row justify-between gap-2 shadow-lg'>
      {/* Images - Currently not implemented so shows example image with disclaimer */}
      <div className='flex flex-1 items-center justify-center p-4'>
        <div className='relative flex aspect-square w-full flex-row justify-center'>
          <Avatar
            src={avatarUrl}
            showFallback
            fallback={
              <div className='relative aspect-square h-full w-full'>
                <UserCircleIcon className='text-accent h-full w-full opacity-60 blur-sm' />
                <div className='text-foreground absolute left-0 top-0 flex h-full w-full items-center justify-center text-lg font-semibold'>
                  No Profile Picture
                </div>
              </div>
            }
            // name={landlordBio.display_name}
            className='aspect-square h-full w-full'
          />
          {isUserLandlord && (
            <form
              className='absolute -bottom-2 left-0 flex w-full justify-center'
              action={urlDispatch}
            >
              <ChangeImageButton
                type='button'
                variant='light'
                className='group'
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                <label className='text-accent hover:text-accent/80'>
                  Change Picture
                </label>
              </ChangeImageButton>
              <input
                name='newProfileFile'
                hidden
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={(e) => {
                  if (e.target.files && e.target.files.length >= 0) {
                    (e.target.form as HTMLFormElement).requestSubmit();
                  }
                }}
              />
            </form>
          )}
        </div>
      </div>

      {/* General Property Details */}
      <div className='justify-top flex w-full flex-1 flex-col gap-2 px-8 py-4 sm:max-w-md'>
        {/* Title - Uses Name */}
        <div className='flex w-full flex-col'>
          <div className='flex flex-row justify-between'>
            <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
              {landlordBio.display_name}
            </h2>
            {isUserLandlord && !editMode && (
              <Button variant='light' onClick={() => setEditMode(true)}>
                Edit
              </Button>
            )}
          </div>
          <span className='border-accent w-full border border-b' />
        </div>
        <StarRatingLayout rating={landlordBio.average_rating} />
        <MaybeForm editMode={editMode} action={profileDispatch}>
          <div className='flex flex-col gap-2'>
            <h3 className='text-accent text-lg font-semibold'>Contact:</h3>
            {editMode ? (
              <TextInput
                defaultValue={landlordBio.display_email}
                type='email'
                name='email'
                error={!!profileState.errors?.email}
                errorMessage={profileState.errors?.email?.join(', ')}
              />
            ) : (
              <a
                href={`mailto:${landlordBio.display_email}`}
                className='text-blue-500 underline transition-colors duration-300 ease-in-out hover:text-blue-600'
              >
                {landlordBio.display_email}
              </a>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className='text-accent text-lg font-semibold'>About Me:</h3>
            {editMode ? (
              <Textarea
                defaultValue={landlordBio.bio}
                name='bio'
                error={!!profileState.errors?.bio}
                errorMessage={profileState.errors?.bio?.join(', ')}
              />
            ) : (
              <p className='italic'>{landlordBio.bio}</p>
            )}
          </div>
          <div className='mt-auto flex flex-row justify-end gap-2'>
            {editMode && (
              <>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <SubmitButton>Save</SubmitButton>
              </>
            )}
            {message && <p className='text-accent'>{message}</p>}
          </div>
        </MaybeForm>
      </div>
    </div>
  );
};

export default LandlordProfile;
