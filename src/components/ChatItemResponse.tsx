import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import React, { useState } from 'react';

import { cn } from '../utils/cn';
import { optionallyAddBaseUrl } from '../utils/optionallyAddBaseUrl';
import { Citation } from '../utils/discoveryFetchers';

interface ChatItemResponseProps extends React.HTMLAttributes<HTMLDivElement> {
  query: string;
  isGenerating: boolean;
  isGeneratingError: boolean;
  response: string;
  baseUrl: string;
  citations: Citation[];
  openCitationInSameTab: boolean;
  onCitationClick: () => void;
}
const ThumbsBeforeFeedbackClassName =
  'rounded-md px-1.5 py-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer text-gray-500';
const ThumbsAfterFeedbackClassName =
  'rounded-md px-1.5 py-1 bg-primary dark:bg-primary-light text-white dark:text-gray-950';
export const ChatItemResponse = React.forwardRef<HTMLDivElement, ChatItemResponseProps>(
  (
    {
      className,
      isGenerating,
      isGeneratingError,
      response,
      baseUrl,
      citations,
      openCitationInSameTab,
      onCitationClick,
      ...props
    },
    ref
  ) => {
    const [thumbedUp, setIsThumbedUp] = useState(false);
    const [thumbedDown, setIsThumbedDown] = useState(false);

    if (isGeneratingError) {
      return (
        <div
          ref={ref}
          className={cn('text-gray-950 dark:text-white px-4 py-2', className)}
          {...props}
        >
          Sorry, we could not generate a response to your question.
        </div>
      );
    } else if (isGenerating) {
      return (
        <div ref={ref} className={cn('px-4 py-2', className)} {...props}>
          <div className="h-4 w-2 bg-gray-400 dark:bg-gray-700 animate-pulse"></div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex flex-col gap-4 px-4 py-2', className)} {...props}>
        <Markdown className="text-gray-700 dark:text-gray-300 prose dark:prose-invert">
          {response}
        </Markdown>
        <div className="flex items-end gap-2">
          <div ref={ref} className="flex gap-2 flex-wrap">
            {citations.map((citation) => {
              if (citation.title) {
                const url = optionallyAddBaseUrl(baseUrl, citation.url);
                return (
                  <a
                    key={url}
                    href={url}
                    target={openCitationInSameTab ? '_self' : '_blank'}
                    onClick={() => {
                      onCitationClick();
                    }}
                  >
                    <div className="flex items-center rounded-md gap-1 px-1.5 h-6 text-xs text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                      {citation.title}
                    </div>
                  </a>
                );
              }
              return null;
            })}
          </div>
          <div className="flex gap-1 items-center">
            <button
              className={cn(
                thumbedUp ? ThumbsAfterFeedbackClassName : ThumbsBeforeFeedbackClassName
              )}
              onClick={() => {
                setIsThumbedUp(true);
                setIsThumbedDown(false);
              }}
            >
              <ThumbsUpIcon size={12} absoluteStrokeWidth strokeWidth={1.5} />
            </button>
            <button
              className={cn(
                thumbedDown ? ThumbsAfterFeedbackClassName : ThumbsBeforeFeedbackClassName
              )}
              onClick={() => {
                setIsThumbedUp(false);
                setIsThumbedDown(true);
              }}
            >
              <ThumbsDownIcon size={12} absoluteStrokeWidth strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    );
  }
);
ChatItemResponse.displayName = 'ChatItemResponse';
