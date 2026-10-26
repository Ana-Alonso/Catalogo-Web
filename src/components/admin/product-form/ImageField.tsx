import React, { type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import { Box, Image, Input, Typography } from '../../ui';
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
    <Box display="flex" direction="column" gap="md">
      <Typography variant="body" size="xs" tone="muted" weight="semibold" transform="uppercase" tracking="wider" marginBottom="sm">
        {t('admin.imageField.label')}{' '}
        {isEditing
          ? t('admin.imageField.optionalHint')
          : t('admin.imageField.requiredHint')}
      </Typography>

      <Box display="flex" direction="column" stackBelow="sm" align="center" gap="lg">
        <Box
          as="label"
          display="flex"
          direction="column"
          align="center"
          justify="center"
          grow
          block
          widthSm="auto"
          cursor="pointer"
          padding="lg"
          border
          borderTone="neutral"
          borderWidth="thick"
          borderStyle="dashed"
          hoverBorder="primary"
          rounded="lg"
          background="subtle"
          group
          cssTransition="colors"
        >
          <Upload className="w-8 h-8 text-neutral-500 mb-2 group-hover:text-orange-600" />
          <Typography variant="body" size="sm" tone="muted" weight="medium">
            {t('admin.imageField.upload')}
          </Typography>
          <Typography variant="body" size="xs" tone="subtle" marginTop="xs">
            {t('admin.imageField.formats')}
          </Typography>
          <input
            type="file"
            accept={ACCEPTED_IMAGE_INPUT}
            onChange={onFileChange}
            className="hidden"
          />
        </Box>

        {(previewUrl || externalImageUrl) && (
          <Box
            width={28}
            height={28}
            position="relative"
            rounded="lg"
            overflow="hidden"
            border
            borderTone="strong"
            background="strong"
            shrink={false}
          >
            <Image
              src={previewUrl || externalImageUrl}
              alt={t('admin.imageField.previewAlt')}
              fullWidth
              height="full"
              fit="fill"
            />
          </Box>
        )}
      </Box>

      <Box>
        <Typography variant="body" size="xs" tone="subtle" display="block" marginBottom="xs">
          {t('admin.imageField.urlHint')}
        </Typography>
        <Input
          type="url"
          value={externalImageUrl}
          onChange={(event) => onExternalUrlChange(event.target.value)}
          placeholder="https://..."
        />
      </Box>
    </Box>
  );
};

export default ImageField;
