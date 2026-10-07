import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	MONGODB_URI: {
		public: false,
		static: false,
		schema: (value: string | undefined) => value ?? ''
	}
});
