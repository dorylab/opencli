import { cli, Strategy } from '../../registry.js';

cli({
  site: 'github', name: 'search', description: 'Search GitHub repositories', domain: 'github.com', strategy: Strategy.PUBLIC, browser: false,
  args: [
    { name: 'keyword', required: true, help: 'Search keyword' },
    { name: 'sort', default: 'stars', help: 'Sort by: stars, forks, updated' },
    { name: 'limit', type: 'int', default: 20, help: 'Number of results' },
  ],
  columns: ['rank', 'name', 'stars', 'language', 'description'],
  func: async (_page, kwargs) => {
    const { keyword, sort = 'stars', limit = 20 } = kwargs;
    const resp = await fetch(`https://api.github.com/search/repositories?${new URLSearchParams({ q: keyword, sort, order: 'desc', per_page: String(Math.min(Number(limit), 100)) })}`, {
      headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'opencli/0.1' },
    });
    const data = await resp.json() as any;
    return (data.items ?? []).slice(0, Number(limit)).map((item: any, i: number) => ({
      rank: i + 1, name: item.full_name, stars: item.stargazers_count, language: item.language ?? '', description: (item.description ?? '').slice(0, 80),
    }));
  },
});
