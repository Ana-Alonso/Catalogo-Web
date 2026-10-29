import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedImage, Image } from '../index';

const cover = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

describe('Image', () => {
  it('publica el tamaño intrínseco para reservar su hueco antes de cargar', () => {
    render(
      <Image
        src={cover}
        alt="Portada del libro"
        intrinsicWidth={1200}
        intrinsicHeight={1600}
      />
    );

    const img = screen.getByRole('img', { name: 'Portada del libro' });

    expect(img).toHaveAttribute('width', '1200');
    expect(img).toHaveAttribute('height', '1600');
  });

  it('no escribe dimensiones cuando no se le indican', () => {
    render(<Image src={cover} alt="Portada del libro" />);

    const img = screen.getByRole('img', { name: 'Portada del libro' });

    expect(img).not.toHaveAttribute('width');
    expect(img).not.toHaveAttribute('height');
  });
});

describe('AnimatedImage', () => {
  it('publica el tamaño intrínseco igual que la imagen estática', () => {
    render(
      <AnimatedImage
        src={cover}
        alt="Portada del libro"
        intrinsicWidth={1200}
        intrinsicHeight={1600}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    );

    const img = screen.getByRole('img', { name: 'Portada del libro' });

    expect(img).toHaveAttribute('width', '1200');
    expect(img).toHaveAttribute('height', '1600');
  });
});
