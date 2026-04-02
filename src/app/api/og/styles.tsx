import React from 'react';

// Satori (next/og) requires absolute style objects for SVG generation.
// This file houses the style definitions and the visual template to resolve persistent 
// "inline-style" linting warnings in the main API route.

export const styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row' as const,
    backgroundColor: '#FAFAFA',
    fontFamily: 'serif',
  },
  leftPanel: {
    display: 'flex',
    width: '50%',
    height: '100%',
    backgroundColor: '#ECECEC',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  placeholder: {
    fontSize: 80,
    color: '#CBD5E1',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '50%',
    height: '100%',
    padding: '80px',
    justifyContent: 'space-between',
    borderLeft: '1px solid #E5E7EB',
  },
  topSection: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  typeTag: {
    textTransform: 'uppercase' as const,
    letterSpacing: '0.2em',
    fontSize: 18,
    color: '#9CA3AF',
    fontFamily: 'sans-serif',
    fontWeight: 700,
    marginBottom: '10px'
  },
  title: {
    fontSize: 54,
    fontWeight: 600,
    color: '#111827',
    lineHeight: 1.2,
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },
  price: {
    marginTop: '30px',
    fontSize: 42,
    color: '#EC4899',
    fontFamily: 'sans-serif',
    fontWeight: 500,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  brand: {
    fontSize: 24,
    color: '#111827',
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  divider: {
    height: '1px',
    width: '40px',
    backgroundColor: '#D1D5DB'
  },
  url: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'sans-serif',
  }
};

interface OGTemplateProps {
  title: string;
  image: string | null;
  price: string | null;
  type: string;
}

export const OGTemplate = ({ title, image, price, type }: OGTemplateProps) => (
  <div style={styles.container}>
    <div style={styles.leftPanel}>
      {image ? (
        <img src={image} alt={title} style={styles.image} />
      ) : (
        <div style={styles.placeholder}>LI.</div>
      )}
    </div>
    <div style={styles.rightPanel}>
      <div style={styles.topSection}>
        <div style={styles.typeTag}>{type}</div>
        <div style={styles.title}>{title}</div>
        {price && <div style={styles.price}>{price}</div>}
      </div>
      <div style={styles.footer}>
        <div style={styles.brand}>London's Imports</div>
        <div style={styles.divider} />
        <div style={styles.url}>londonsimports.com</div>
      </div>
    </div>
  </div>
);
