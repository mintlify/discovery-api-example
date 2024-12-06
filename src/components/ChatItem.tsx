import * as React from 'react';
import { useEffect, useState } from 'react';

import { cn } from '../utils/cn';
import { createTopic, generateResponse, getFormattedCitations } from '../utils/discoveryFetchers';
import { ChatItemQuery } from './ChatItemQuery';
import { ChatItemResponse } from './ChatItemResponse';

interface ChatItemProps extends React.HTMLAttributes<HTMLDivElement> {
  query: string;
  sessionId: string;
  openCitationInSameTab: boolean;
  setSessionId: (sessionId: string) => void;
  onGeneratingErrorRetry: () => void;
  onCitationClick: () => void;
  apiKey: string;
  url: string | undefined;
}

export const ChatItem = React.forwardRef<HTMLDivElement, ChatItemProps>(
  (
    {
      query,
      sessionId,
      openCitationInSameTab,
      setSessionId,
      onGeneratingErrorRetry,
      onCitationClick,
      apiKey,
      url,
      className,
      ...props
    },
    ref
  ) => {
    const [isGenerating, setIsGenerating] = useState(true);
    const [isGeneratingError, setIsGeneratingError] = useState(false);
    const [isGeneratingErrorRetryable] = useState(true);

    const [response, setResponse] = useState<string>('');
    const [baseUrl, setBaseUrl] = useState<string>('');

    useEffect(() => {
      const generateChat = async () => {
        let topicId = sessionId;
        if (!sessionId) {
          const newTopicId = await createTopic(apiKey, url);
          if (newTopicId) {
            setSessionId(newTopicId);
            topicId = newTopicId;
          }
        }

        setIsGenerating(true);
        try {
          await generateResponse({
            topicId,
            userQuery: query,
            setResponse,
            setBaseUrl,
            apiKey,
            url,
          });
        } catch (error) {
          setIsGeneratingError(true);
        }
        setIsGenerating(false);
      };

      void generateChat();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    return (
      <div
        ref={ref}
        className={cn(
          'py-3 flex flex-col border border-gray-200 dark:border-white/10 rounded-2xl',
          className
        )}
        {...props}
      >
        <ChatItemQuery
          query={query}
          isGenerating={!response.length}
          isGeneratingError={isGeneratingError}
          isGeneratingErrorRetryable={isGeneratingErrorRetryable}
          onGeneratingErrorRetry={onGeneratingErrorRetry}
        />
        <ChatItemResponse
          query={query}
          isGenerating={!response.length}
          isGeneratingError={isGeneratingError}
          response={response.split('||')[0] ?? ''}
          baseUrl={baseUrl}
          citations={isGenerating ? [] : getFormattedCitations(response.split('||')[1])}
          openCitationInSameTab={openCitationInSameTab}
          onCitationClick={onCitationClick}
        />
      </div>
    );
  }
);
ChatItem.displayName = 'ChatItem';
