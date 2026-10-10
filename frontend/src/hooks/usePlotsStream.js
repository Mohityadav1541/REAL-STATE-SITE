import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function usePlotsStream(slug) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!slug) return;

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const eventSource = new EventSource(`${baseUrl}/projects/${slug}/plots/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.project && data.plots) {
          queryClient.setQueryData(['project-plots', slug], data);
        }
      } catch (err) {
        console.error('SSE Parsing error:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
    };

    return () => {
      eventSource.close();
    };
  }, [slug, queryClient]);
}
