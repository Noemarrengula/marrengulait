import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
  });
};

export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

export const sanitizeUrl = (url: string): string => {
  const sanitized = DOMPurify.sanitize(url, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  
  if (!/^(https?:\/\/)/i.test(sanitized)) {
    return '#';
  }
  
  return sanitized;
};

export const sanitizeReview = (review: {
  title?: string | null;
  comment: string;
}): { title: string; comment: string } => {
  return {
    title: review.title ? sanitizeText(review.title) : '',
    comment: sanitizeHTML(review.comment),
  };
};

export const sanitizeProductDescription = (description: string | null): string => {
  if (!description) return '';
  
  return DOMPurify.sanitize(description, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'class', 'style'],
    ADD_ATTR: ['target'],
  });
};

export default sanitizeHTML;
