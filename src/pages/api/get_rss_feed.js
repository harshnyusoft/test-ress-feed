// @ts-nocheck
import { parseStringPromise } from 'xml2js';

const fetchWithHeaders = async (url) => {
	const response = await fetch(url, {
		// headers: {
		// 	"User-Agent": "Mozilla/5.0 (compatible; DemoNextApp/1.0; +https://taxworkoutgroup.com/)"
		// }

		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			"Accept-Language": "en-US,en;q=0.5",
			"Referer": "https://www.justice.gov/",
			"Connection": "keep-alive"
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



export default async function handler(req, res) {
	const { url } = req.query;

	if (!url || typeof url !== 'string') {
		return res.status(400).json({ error: 'URL is required and must be a string' });
	}

	try {
		const json = await fetchWithHeaders(url);
		res.status(200).json(json);
	} catch (err) {
		console.error('Error:', err);
		res.status(500).json({
			error: err.message || 'Failed to fetch or parse RSS feed',
			err: err,
			stack: err.stack,
			success: false
		});
	}
}
