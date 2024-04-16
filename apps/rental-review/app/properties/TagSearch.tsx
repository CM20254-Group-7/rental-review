'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const TagSearch: React.FC<{
  tags: string[];
}> = ({ tags }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedTags, setSelectedTags] = useState(
    searchParams.getAll('tags') || [],
  );

  useEffect(() => {
    setSelectedTags(searchParams.getAll('tags') || '');
  }, [searchParams]);

  const [unselectedTags, setUnselectedTags] = useState(
    tags.filter((tag) => !selectedTags.includes(tag)),
  );

  useEffect(() => {
    setUnselectedTags(tags.filter((tag) => !selectedTags.includes(tag)));
  }, [tags, selectedTags]);

  const handleSearch = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());

    let newSelectedTags = selectedTags;

    // If the tag is already selected, remove it
    if (newSelectedTags.includes(tag)) {
      newSelectedTags = newSelectedTags.filter(
        (selectedTag) => selectedTag !== tag,
      );
    } else {
      newSelectedTags.push(tag);
    }

    params.delete('tags');
    if (newSelectedTags.length >= 0) {
      newSelectedTags.forEach((selectedTag) => {
        params.append('tags', selectedTag);
      });
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className='flex flex-col gap-2'>
      <p>Search By Tags</p>

      <div className='border-foreground/30 flex flex-col gap-2 border-y'>
        {selectedTags.length > 0 && (
          <div className='flex flex-wrap justify-center gap-2 px-2 py-4'>
            {selectedTags.map((tag) => (
              <button
                key={tag}
                type='button'
                onClick={() => handleSearch(tag)}
                className='border-foreground/30 text-foreground bg-secondary/10 dark:bg-accent/10 hover:bg-secondary/5 hover:dark:bg-accent/5 hover:shadow-accent/10 rounded-md border px-4 py-2 hover:shadow-md'
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        {unselectedTags.length > 0 && (
          <div className='flex flex-wrap justify-center gap-2 px-2 py-4'>
            {unselectedTags.map((tag) => (
              <button
                key={tag}
                type='button'
                onClick={() => handleSearch(tag)}
                className='border-foreground/30 text-foreground hover:bg-secondary/10 dark:hover:bg-accent/10 hover:shadow-accent/20 rounded-md border px-4 py-2 hover:shadow-lg'
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSearch;
