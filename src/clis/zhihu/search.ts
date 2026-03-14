import { cli, Strategy } from '../../registry.js';
import { fetchJson } from '../../bilibili.js';

cli({
  site: 'zhihu',
  name: 'search',
  description: '搜索知乎问题和回答',
  domain: 'www.zhihu.com',
  strategy: Strategy.COOKIE,
  args: [
    { name: 'keyword', required: true, help: 'Search keyword' },
    { name: 'type', default: 'general', help: 'general, article, video' },
    { name: 'limit', type: 'int', default: 20, help: 'Number of results' },
  ],
  columns: ['rank', 'title', 'author', 'type', 'url'],
  func: async (page, kwargs) => {
    const { keyword, type = 'general', limit = 20 } = kwargs;

    // Navigate to zhihu to ensure cookie context
    await page.goto('https://www.zhihu.com');

    const qs = new URLSearchParams({ q: keyword, type, limit: String(limit) });
    const payload = await fetchJson(page, `https://www.zhihu.com/api/v4/search_v3?${qs}`);

    const data: any[] = payload?.data ?? [];
    const rows: any[] = [];

    for (let i = 0; i < Math.min(data.length, Number(limit)); i++) {
      const item = data[i];
      const obj = item.object ?? item;
      const itemType = item.type ?? obj.type ?? 'unknown';

      let title = '';
      let author = '';
      let url = '';

      if (itemType === 'search_result') {
        const highlight = obj.highlight ?? {};
        title = (highlight.title ?? obj.title ?? '').replace(/<[^>]+>/g, '');
        author = obj.author?.name ?? '';
        url = obj.url ?? '';
      } else if (obj.question) {
        title = (obj.question.title ?? obj.title ?? '').replace(/<[^>]+>/g, '');
        author = obj.author?.name ?? '';
        url = obj.question.url ? `https://www.zhihu.com/question/${obj.question.id}` : '';
      } else {
        title = (obj.title ?? obj.name ?? '').replace(/<[^>]+>/g, '');
        author = obj.author?.name ?? '';
        url = obj.url ?? '';
      }

      if (!title) continue;

      rows.push({
        rank: rows.length + 1,
        title: title.slice(0, 60),
        author,
        type: itemType.replace('search_result', 'result'),
        url,
      });
    }

    return rows;
  },
});
