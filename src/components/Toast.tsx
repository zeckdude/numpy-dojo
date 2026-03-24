'use client';

export function Toast({ message }: { message: string }) {
  return <div className={`toast ${message ? 'show' : ''}`}>{message}</div>;
}
