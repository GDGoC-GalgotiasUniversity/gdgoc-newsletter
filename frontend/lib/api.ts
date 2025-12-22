export async function fetchNewsletters(page = 1, limit = 10) {
  const res = await fetch(`/api/newsletters?page=${page}&limit=${limit}`);
  return res.json();
}

export async function fetchNewsletter(slug: string) {
  const res = await fetch(`/api/newsletters/${slug}`);
  return res.json();
}

export async function createNewsletter(data: {
  title: string;
  content: string;
  excerpt: string;
  author: string;
}) {
  const res = await fetch('/api/newsletters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateNewsletter(
  slug: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    author?: string;
    featured?: boolean;
  }
) {
  const res = await fetch(`/api/newsletters/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteNewsletter(slug: string) {
  const res = await fetch(`/api/newsletters/${slug}`, {
    method: 'DELETE',
  });
  return res.json();
}
