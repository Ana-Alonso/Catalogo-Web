import React, { type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import { Box } from '../../ui';
import { theme } from '../../../theme';
import { ACCEPTED_IMAGE_INPUT } from '../../../utils/imageValidation';

interface ImageFieldProps {
  previewUrl: string;
  externalImageUrl: string;
  isEditing: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onExternalUrlChange: (value: string) => void;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  previewUrl,
  externalImageUrl,
  isEditing,
  onFileChange,
  onExternalUrlChange,
}) => {
  const { t } = useTranslation();

  return (
    <Box className="space-y-4">
      <label className={theme.inputs.label}>
        {t('admin.imageField.label')}{' '}
        {isEditing
          ? t('admin.imageField.optionalHint')
          : t('admin.imageField.requiredHint')}
      </label>

      <Box className="flex flex-col sm:flex-row items-center gap-6">
        <label className="w-full sm:w-auto flex-1 cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-800 hover:border-orange-600 rounded-lg transition-colors bg-neutral-950/60">
          <Upload className="w-8 h-8 text-neutral-500 mb-2 group-hover:text-orange-600" />
          <span className="text-sm text-neutral-300 font-medium">
            {t('admin.imageField.upload')}
          </span>
          <span className="text-xs text-neutral-500 mt-1">
            {t('admin.imageField.formats')}
          </span>
          <input
            type="file"
            accept={ACCEPTED_IMAGE_INPUT}
            onChange={onFileChange}
            className="hidden"
          />
        </label>

        {(previewUrl || externalImageUrl) && (
          <Box className="w-28 h-28 relative rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 flex-shrink-0">
            <img
              src={previewUrl || externalImageUrl}
              alt={t('admin.imageField.previewAlt')}
              className="w-full h-full object-cover"
            />
          </Box>
        )}
      </Box>

      <Box>
        <span className="text-xs text-neutral-500 block mb-1">
          {t('admin.imageField.urlHint')}
        </span>
        <input
          type="url"
          value={externalImageUrl}
          onChange={(event) => onExternalUrlChange(event.target.value)}
          placeholder="https://..."
          className={theme.inputs.base}
        />
      </Box>
    </Box>
  );
};

export default ImageField;
