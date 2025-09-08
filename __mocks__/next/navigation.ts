export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
});

export const usePathname = jest.fn(() => '/');

export const useSearchParams = jest.fn(() => ({
  get: jest.fn(),
  getAll: jest.fn(),
  has: jest.fn(),
  entries: jest.fn(),
  forEach: jest.fn(),
  keys: jest.fn(),
  values: jest.fn(),
  toString: jest.fn(),
  size: 0,
}));

export const useParams = jest.fn(() => ({}));

export const notFound = () => {
  const error = new Error('Not found');
  (error as any).digest = 'NEXT_NOT_FOUND';
  throw error;
};

export const redirect = jest.fn((path) => {
  const error = new Error('Redirect') as any;
  error.digest = `NEXT_REDIRECT;${path}`;
  throw error;
});

export const permanentRedirect = jest.fn((path) => {
  const error = new Error('Permanent Redirect') as any;
  error.digest = `NEXT_REDIRECT;${path};permanent`;
  throw error;
});

export const useSelectedLayoutSegment = jest.fn(() => null);

export const useSelectedLayoutSegments = jest.fn(() => []);

export const useServerInsertedHTML = jest.fn(() => {});

export default {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
  notFound,
  redirect,
  permanentRedirect,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
  useServerInsertedHTML,
};
