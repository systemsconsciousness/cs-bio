'use client';

import { Settings } from 'lucide-react';

export default function AdminLink() {
  const stackApiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
  const contentstackUrl = stackApiKey 
    ? `https://app.contentstack.com/stack/${stackApiKey}/dashboard`
    : 'https://app.contentstack.com';

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href={contentstackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
        title="Edit content in Contentstack"
      >
        <Settings className="w-4 h-4 mr-2" />
        Edit Content
      </a>
    </div>
  );
}