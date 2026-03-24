import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="app app--dashboard"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        textAlign: 'center',
        gap: 16,
      }}
    >
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 28,
          color: 'var(--text-hi)',
        }}
      >
        Page not found
      </h1>
      <p style={{ color: 'var(--text-mid)', maxWidth: 400, lineHeight: 1.6 }}>
        That URL does not match a lesson, scenario, or page on NumPy Dojo.
      </p>
      <Link href="/" className="dashboard-cta" style={{ textDecoration: 'none' }}>
        Back to dashboard
      </Link>
    </div>
  );
}
