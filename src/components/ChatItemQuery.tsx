import React from 'react';

import { cn } from '../utils/cn';
import { AiStatusIcons } from './icons';

interface ChatItemQueryProps extends React.HTMLAttributes<HTMLDivElement> {
  query: string;
  isGenerating: boolean;
  isGeneratingError: boolean;
  isGeneratingErrorRetryable: boolean;
  onGeneratingErrorRetry: () => void;
}
export const ChatItemQuery = React.forwardRef<HTMLDivElement, ChatItemQueryProps>(
  (
    {
      className,
      query,
      isGenerating,
      isGeneratingError,
      isGeneratingErrorRetryable,
      onGeneratingErrorRetry,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'break-all flex gap-2 px-4 py-1 items-center font-medium justify-between',
          isGeneratingError
            ? isGeneratingErrorRetryable
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-red-600 dark:text-red-400'
            : 'text-primary dark:text-primary-light',
          className
        )}
        {...props}
      >
        <div
          className="flex items-center gap-2"
          style={{
            wordBreak: 'break-word',
          }}
        >
          <div className="size-5">
            {isGeneratingError ? (
              isGeneratingErrorRetryable ? (
                <AiStatusIcons.Retryable />
              ) : (
                <AiStatusIcons.Error />
              )
            ) : isGenerating ? (
              <AiStatusIcons.Generating />
            ) : (
              <AiStatusIcons.Generated />
            )}
          </div>
          {query}
        </div>
        {isGeneratingError && isGeneratingErrorRetryable && (
          <button
            className="group text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm cursor-pointer flex items-center gap-0.5"
            onClick={onGeneratingErrorRetry}
          >
            <AiStatusIcons.Retry />
            <p className="px-1">Retry</p>
          </button>
        )}
      </div>
    );
  }
);
ChatItemQuery.displayName = 'ChatItemMessage';
