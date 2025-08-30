export const load = async ({ cookies }) => {
	const locale = cookies.get('locale');

	return { locale };
};
