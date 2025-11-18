import { FooterResponseProps } from '../types/footerTypes';
import { AboutResponseProps } from '../types/aboutTypes';

export const PLACEHOLDER_IMAGE = '/placeholder.png';
export const PLACEHOLDER_TITLE = 'Título indisponível';
export const PLACEHOLDER_DESCRIPTION = 'Conteúdo indisponível.';
export const PLACEHOLDER_ALT = 'Imagem indisponível';
export const PLACEHOLDER_DATE_LABEL = 'Data indisponível';

export const DEFAULT_FOOTER: FooterResponseProps = {
	_id: 0 as unknown as number,
	institution: PLACEHOLDER_TITLE,
	location: PLACEHOLDER_TITLE,
	email: PLACEHOLDER_DESCRIPTION,
	phone: PLACEHOLDER_DESCRIPTION,
	copyrightText: PLACEHOLDER_DESCRIPTION,
	laboratoryName: PLACEHOLDER_TITLE,
	createdAt: new Date().toISOString() as unknown as Date,
	updatedAt: new Date().toISOString() as unknown as Date,
	logos: [] as any,
};

export const DEFAULT_ABOUT: AboutResponseProps = {
	_id: 'placeholder-about',
	title: PLACEHOLDER_TITLE,
	text: PLACEHOLDER_DESCRIPTION,
	file: {
		_id: 'placeholder-file',
		platform: 'web',
		imageName: 'placeholder.png',
		size: 0,
		key: 'placeholder',
		url: PLACEHOLDER_IMAGE,
		altText: PLACEHOLDER_ALT,
		createdAt: new Date().toISOString(),
		updateAt: new Date().toISOString(),
	},
};

export const DEFAULT_PAGINATED_NEWS = {
	response: [],
	totalPages: 1,
};