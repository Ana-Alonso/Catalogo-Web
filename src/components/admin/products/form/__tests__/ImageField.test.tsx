import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '../../../../../i18n';
import { ImageField } from '../ImageField';

const renderField = () =>
  render(
    <ImageField
      previewUrl=""
      externalImageUrl=""
      isEditing={false}
      onFileChange={vi.fn()}
      onExternalUrlChange={vi.fn()}
    />
  );

describe('ImageField', () => {
  it('permite alcanzar el input de fichero con el teclado', async () => {
    const user = userEvent.setup();
    renderField();

    const fileInput = screen.getByLabelText(new RegExp(i18n.t('admin.imageField.upload')));
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).not.toHaveClass('hidden');
    expect(fileInput).toHaveClass('sr-only');

    await user.tab();
    expect(fileInput).toHaveFocus();
  });

  it('expone el input de URL externa con un nombre accesible', () => {
    renderField();

    const urlInput = screen.getByLabelText(new RegExp(i18n.t('admin.imageField.urlHint')));
    expect(urlInput).toHaveAttribute('type', 'url');
  });
});
