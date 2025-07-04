const fetchWithHeaders = async (url) => {
	const response = await fetch(url, {
		headers: {
			"User-Agent": "Mozilla/5.0 (compatible; DemoNextApp/1.0; +https://test-ress-feed.vercel.app/)"
		}
	});

	if (!response.ok) {
		const errorDetails = {
			status: response.status,
			statusText: response.statusText,
			headers: [...response.headers.entries()],
			body: await response.text(),
		};
		throw new Error(`Failed to fetch RSS feed. Status: ${response.status}, Details: ${JSON.stringify(errorDetails)}`);
	}

	const xml = await response.text();
	const json = await parseStringPromise(xml, { explicitArray: false });
	return json?.rss?.channel || json?.feed || json;
};
