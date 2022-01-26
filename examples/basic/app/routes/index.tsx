import { json, type LoaderFunction, useLoaderData, Link } from 'remix';
import { isAuthenticated } from '@authing/remix';
import { sessionStorage } from '~/services/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request, sessionStorage);

  return json(user || {});
};

export default function Index() {
  const user = useLoaderData();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Remix</h1>
      <nav>
        <Link to='/login'>Login</Link> | <Link to='/logout'>Logout</Link>
      </nav>
      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
    </div>
  );
}
