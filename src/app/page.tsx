'use client';

import { useState, useCallback, useRef, KeyboardEvent, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ChatItem } from '@/components/ChatItem';
import { SendIcon } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/utils/cn';

export default function Component() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);
  const [sessionId, setSessionId] = useState<string>();
  const [queries, setQueries] = useState<
    {
      query: string;
      key: string;
    }[]
  >(
    query
      ? [
          {
            query: query,
            key: uuidv4(),
          },
        ]
      : []
  );

  const onSendRetryQuery = useCallback(
    (index: number) => {
      const newQueries = queries.slice();
      newQueries[index] = {
        query: newQueries[index]?.query || '',
        key: uuidv4(),
      };
      setQueries(newQueries);
    },
    [queries]
  );

  const onSendFollowupQuery = useCallback(
    (query: string) => {
      setQueries([
        ...queries,
        {
          query: query,
          key: uuidv4(),
        },
      ]);

      setQuery('');
    },
    [queries]
  );

  const onEnter = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSendFollowupQuery(query);
      }
    },
    [onSendFollowupQuery, query]
  );

  return (
    <div className="flex h-screen mx-auto w-2/5">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat messages */}
        <ScrollArea className="flex-1 p-4 space-y-4">
          {queries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <img src="/logo.svg" alt="Mintlify Logo" className="w-12 h-12 mb-4" />
              </div>
            </div>
          ) : (
            queries.map(({ query: itemQuery, key }, i) => (
              <ChatItem
                key={key}
                query={itemQuery}
                sessionId={sessionId ?? ''}
                setSessionId={setSessionId}
                className="last:mb-2"
                onGeneratingErrorRetry={() => onSendRetryQuery(i)}
                openCitationInSameTab={false}
                onCitationClick={() => {}}
                apiKey={'mint_dsc_YOUR_KEY_GOES_HERE'}
                url={undefined}
              />
            ))
          )}
        </ScrollArea>

        {/* Input area */}
        <div
          className={cn(
            'py-1 px-2 h-[56px] flex-shrink-0 relative z-10 border-b transition border-transparent mb-8'
          )}
        >
          <button
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 text-gray-950 dark:text-white px-1.5 py-1.5 rounded-md opacity-70'
            )}
          >
            <SendIcon />
          </button>
          <input
            ref={inputRef}
            className={cn(
              'rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 h-full w-full focus:ring-0 text-gray-950 dark:text-white placeholder:text-gray-400 placeholder:dark:text-white/50 tracking-tight focus:border-gray-950 dark:focus:border-white disabled:text-gray-500 dark:disabled:text-white/50',
              'pl-4 pr-12',
              'shadow-input'
            )}
            // making sure to focus
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            placeholder={'Ask anything...'}
            autoComplete="off"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setQuery(e.target.value);
            }}
            onKeyDown={onEnter}
          />
        </div>
      </div>
    </div>
  );
}
