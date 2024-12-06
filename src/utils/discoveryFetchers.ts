import { optionallyAddLeadingSlash } from './leadingSlash';

export type Citation = {
  citationNumber: number;
  title: string;
  url: string;
  rootRecordId?: number;
  rootRecordType?: string;
};

const DEFAULT_URL = 'https://api-dsc.mintlify.com/v1';

export const createTopic = async (apiKey: string, url: string | undefined) => {
  if (!apiKey) return;

  const topicResponse = await fetch(`${url ?? DEFAULT_URL}/chat/topic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!topicResponse.ok) return;

  const topic: unknown = await topicResponse.json();

  if (
    topic &&
    typeof topic === 'object' &&
    'topicId' in topic &&
    typeof topic.topicId === 'string'
  ) {
    return topic.topicId;
  } else {
    return undefined;
  }
};

export const generateResponse = async ({
  topicId,
  userQuery,
  setResponse,
  setBaseUrl,
  apiKey,
  url,
}: {
  topicId: string;
  userQuery: string;
  setResponse: React.Dispatch<React.SetStateAction<string>>;
  setBaseUrl: React.Dispatch<React.SetStateAction<string>>;
  apiKey: string;
  url: string | undefined;
}) => {
  if (!apiKey) return;

  const queryResponse = await fetch(`${url ?? DEFAULT_URL}/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ message: userQuery, topicId }),
  });

  if (!queryResponse.ok || !queryResponse.body) {
    throw Error(queryResponse.statusText);
  }
  const streamReader = queryResponse.body.getReader();

  for (;;) {
    const { done, value } = await streamReader.read();
    if (done) {
      setResponse((prev) => {
        return prev + new TextDecoder().decode(value);
      });
      setBaseUrl(queryResponse.headers.get('X-Mintlify-Base-Url') ?? '');
      return;
    }

    const newValue = new TextDecoder().decode(value);
    setResponse((prev) => prev + newValue);
  }
};

type ChunkMetadata = {
  id: string;
  link?: string;
  metadata?: Record<string, unknown>;
  chunk_html?: string;
};

export const generateDeeplink = (chunkMetadata: ChunkMetadata) => {
  if (
    !(
      'metadata' in chunkMetadata &&
      !!chunkMetadata.metadata &&
      'title' in chunkMetadata.metadata &&
      'link' in chunkMetadata &&
      typeof chunkMetadata.link === 'string'
    )
  )
    return '';
  const section = chunkMetadata.metadata.title;
  const link = optionallyAddLeadingSlash(chunkMetadata.link);
  if (section && typeof section === 'string') {
    const sectionSlug = section
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll(/[^a-zA-Z0-9-_#]/g, '');

    return `${link}#${sectionSlug}`;
  }

  return link;
};

type UnformattedCitation = {
  id: string;
  link: string;
  chunk_html: string;
  metadata: Record<string, string>;
};

export function getFormattedCitations(rawContent?: string): Citation[] {
  try {
    const citations: UnformattedCitation[] = JSON.parse(rawContent ?? '[]');

    const uniqueCitations = new Map(
      citations.map((citation, index) => {
        const title = citation.metadata.title ?? '';
        const formattedCitation = {
          citationNumber: index,
          title: citation.metadata.title ?? '',
          url: generateDeeplink(citation),
        };

        return [title, formattedCitation];
      })
    );

    return [...uniqueCitations.values()];
  } catch {
    return [];
  }
}
