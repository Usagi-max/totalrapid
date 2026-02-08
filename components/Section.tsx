// src/components/Section.tsx
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  bgColor?: string;
};

export const Section = ({ children, bgColor }: Props) => {
  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor: bgColor ?? 'transparent' }}
    >
      <div className="max-w-4xl mx-auto">{children}</div>
    </section>
  );
};
