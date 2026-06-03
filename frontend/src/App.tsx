import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';

interface Game {
  appid: number;
  name: string;
  price: number;
  release_date: string;
  review_count: number;
  revenue_1year: number;
  tags: string[];
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // States for filters and pagination
  const [includeAnd, setIncludeAnd] = useState('');
  const [includeOr, setIncludeOr] = useState('');
  const [excludeAnd, setExcludeAnd] = useState('');
  const [excludeOr, setExcludeOr] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isInitialMount = useRef(true);

  const fetchGames = useCallback(async (page: number) => {
    setLoading(true);
    setError('');

    try {
      const filters = [];
      if (includeAnd.trim()) filters.push(`INCLUDE_AND ${includeAnd.trim()}`);
      if (includeOr.trim()) filters.push(`INCLUDE_OR ${includeOr.trim()}`);
      if (excludeAnd.trim()) filters.push(`EXCLUDE_AND ${excludeAnd.trim()}`);
      if (excludeOr.trim()) filters.push(`EXCLUDE_OR ${excludeOr.trim()}`);

      const filterTags = filters.join(';');

      const response = await axios.get('http://localhost:8000/api/games/', {
        params: {
          page: page,
          sort: sortBy,
          filter_tags: filterTags
        }
      });

      const data = response.data;
      setTotalPages(data.total_pages);
      setGames(data.results);

      if (data.results.length === 0) {
        setError('Nenhum jogo encontrado.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar jogos.');
    } finally {
      setLoading(false);
    }
  }, [includeAnd, includeOr, excludeAnd, excludeOr, sortBy]);

  // Handle page changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchGames(1);
    } else {
      fetchGames(currentPage);
    }
  }, [currentPage, fetchGames]);

  const handleSearch = () => {
    if (currentPage === 1) {
      fetchGames(1);
    } else {
      setCurrentPage(1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div>
      <h1>Steam Analytics</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="INCLUDE_AND"
          value={includeAnd}
          onChange={(e) => setIncludeAnd(e.target.value)}
        />
        <input
          type="text"
          placeholder="INCLUDE_OR"
          value={includeOr}
          onChange={(e) => setIncludeOr(e.target.value)}
        />
        <input
          type="text"
          placeholder="EXCLUDE_AND"
          value={excludeAnd}
          onChange={(e) => setExcludeAnd(e.target.value)}
        />
        <input
          type="text"
          placeholder="EXCLUDE_OR"
          value={excludeOr}
          onChange={(e) => setExcludeOr(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="revenue">Receita</option>
          <option value="reviews">Reviews</option>
          <option value="price">Preço</option>
          <option value="release">Lançamento</option>
        </select>

        <button onClick={handleSearch}>Buscar</button>
      </div>

      {loading && <div id="loading">Carregando jogos...</div>}
      {error && <div id="errorMessage">{error}</div>}

      <div id="gamesList">
        {games.map((game) => (
          <div key={game.appid} className="game">
            <h2>{game.name}</h2>
            <p>💰 Preço: ${game.price ?? 0}</p>
            <p>⭐ Reviews: {game.review_count ?? 0}</p>
            <p>📈 Receita: ${Math.floor(game.revenue_1year ?? 0)}</p>
            <p>📅 Lançamento: {game.release_date ?? "-"}</p>
            <p>🏷️ Tags: {game.tags.join(", ")}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          ⬅ Página Anterior
        </button>
        <span id="pageInfo">
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Próxima Página ➡
        </button>
      </div>
    </div>
  );
}

export default App;