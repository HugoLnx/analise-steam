import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import GameCard, { type Game } from './components/GameCard';
import FilterSidebar from './components/FilterSidebar';

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // States for filters and pagination
  const [includeAnd, setIncludeAnd] = useState('');
  const [includeOr, setIncludeOr] = useState('');
  const [excludeAnd, setExcludeAnd] = useState('');
  const [excludeOr, setExcludeOr] = useState('');
  
  // Novos Filtros
  const [title, setTitle] = useState('');
  const [onlyBr, setOnlyBr] = useState(false);
  const [reviewsMin, setReviewsMin] = useState('');
  const [reviewsMax, setReviewsMax] = useState('');
  const [revenueMin, setRevenueMin] = useState('');
  const [revenueMax, setRevenueMax] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [weeksMin, setWeeksMin] = useState('');
  const [weeksMax, setWeeksMax] = useState('');

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
          filter_tags: filterTags,
          title: title,
          only_br: onlyBr,
          reviews_min: reviewsMin,
          reviews_max: reviewsMax,
          revenue_min: revenueMin,
          revenue_max: revenueMax,
          price_min: priceMin,
          price_max: priceMax,
          weeks_min: weeksMin,
          weeks_max: weeksMax,
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
  }, [
    includeAnd, includeOr, excludeAnd, excludeOr, 
    sortBy, title, onlyBr, 
    reviewsMin, reviewsMax, 
    revenueMin, revenueMax, 
    priceMin, priceMax, 
    weeksMin, weeksMax
  ]);

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
    <div className="app-layout">
      <main className="content-area">
        <header className="results-bar">
          <span className="results-count">
            {loading ? 'Carregando...' : `Showing ${games.length} results`}
          </span>
          <div className="sort-container">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="revenue">Relevância (Receita)</option>
              <option value="reviews">Reviews</option>
              <option value="price">Preço</option>
              <option value="release">Lançamento</option>
            </select>
          </div>
        </header>

        {error && <div id="errorMessage">{error}</div>}

        <div id="gamesList">
          {games.map((game) => (
            <GameCard key={game.appid} game={game} />
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
      </main>

      <FilterSidebar 
        includeAnd={includeAnd}
        setIncludeAnd={setIncludeAnd}
        includeOr={includeOr}
        setIncludeOr={setIncludeOr}
        excludeAnd={excludeAnd}
        setExcludeAnd={setExcludeAnd}
        excludeOr={excludeOr}
        setExcludeOr={setExcludeOr}
        onSearch={handleSearch}
        title={title}
        setTitle={setTitle}
        onlyBr={onlyBr}
        setOnlyBr={setOnlyBr}
        reviewsMin={reviewsMin}
        setReviewsMin={setReviewsMin}
        reviewsMax={reviewsMax}
        setReviewsMax={setReviewsMax}
        revenueMin={revenueMin}
        setRevenueMin={setRevenueMin}
        revenueMax={revenueMax}
        setRevenueMax={setRevenueMax}
        priceMin={priceMin}
        setPriceMin={setPriceMin}
        priceMax={priceMax}
        setPriceMax={setPriceMax}
        weeksMin={weeksMin}
        setWeeksMin={setWeeksMin}
        weeksMax={weeksMax}
        setWeeksMax={setWeeksMax}
      />
    </div>
  );
}

export default App;
