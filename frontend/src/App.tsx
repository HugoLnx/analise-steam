import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import GameCard, { type Game } from './components/GameCard';
import FilterSidebar from './components/FilterSidebar';
import type { TagClause } from './components/TagClauseFilter';

function App() {
  // TODO: #29 - Carregar no useEffect inicial as configurações salvas no localStorage (filtros ativos, sortBy, página atual)
  // TODO: #29 - Adicionar um useEffect que observe mudanças nos filtros e chame localStorage.setItem('filters', JSON.stringify(...)) para persistência
  // TODO: #29 - Garantir que o botão 'Reset' limpe as chaves salvas correspondentes no localStorage para sincronizar a sessão
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

  // No Min/Max states
  const [revNoMin, setRevNoMin] = useState(true);
  const [revNoMax, setRevNoMax] = useState(true);
  const [revenueNoMin, setRevenueNoMin] = useState(true);
  const [revenueNoMax, setRevenueNoMax] = useState(true);
  const [priceNoMin, setPriceNoMin] = useState(true);
  const [priceNoMax, setPriceNoMax] = useState(true);
  const [weeksNoMin, setWeeksNoMin] = useState(true);
  const [weeksNoMax, setWeeksNoMax] = useState(true);

  // Novos estados para TagClauseFilter
  const [tagClauses, setTagClauses] = useState<TagClause[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState('revenue');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isInitialMount = useRef(true);

  // Fetch real tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tags/');
        setAvailableTags(response.data);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    fetchTags();
  }, []);

  const fetchGames = useCallback(async (page: number) => {
    setLoading(true);
    setError('');

    try {
      const filters = [];
      
      // Old input filters
      if (includeAnd.trim()) filters.push(`INCLUDE_AND ${includeAnd.trim()}`);
      if (includeOr.trim()) filters.push(`INCLUDE_OR ${includeOr.trim()}`);
      if (excludeAnd.trim()) filters.push(`EXCLUDE_AND ${excludeAnd.trim()}`);
      if (excludeOr.trim()) filters.push(`EXCLUDE_OR ${excludeOr.trim()}`);

      // New Tag Clauses filters
      tagClauses.forEach(clause => {
        if (clause.tags.length > 0) {
          filters.push(`${clause.type} ${clause.tags.join(',')}`);
        }
      });

      const filterTags = filters.join(';');

      const response = await axios.get('http://localhost:8000/api/games/', {
        params: {
          page: page,
          sort: sortBy,
          filter_tags: filterTags,
          title: title,
          only_br: onlyBr,
          reviews_min: revNoMin ? '' : reviewsMin,
          reviews_max: revNoMax ? '' : reviewsMax,
          revenue_min: revenueNoMin ? '' : revenueMin,
          revenue_max: revenueNoMax ? '' : revenueMax,
          price_min: priceNoMin ? '' : priceMin,
          price_max: priceNoMax ? '' : priceMax,
          weeks_min: weeksNoMin ? '' : weeksMin,
          weeks_max: weeksNoMax ? '' : weeksMax,
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
    weeksMin, weeksMax,
    revNoMin, revNoMax,
    revenueNoMin, revenueNoMax,
    priceNoMin, priceNoMax,
    weeksNoMin, weeksNoMax,
    tagClauses
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
        revNoMin={revNoMin}
        setRevNoMin={setRevNoMin}
        revNoMax={revNoMax}
        setRevNoMax={setRevNoMax}
        revenueNoMin={revenueNoMin}
        setRevenueNoMin={setRevenueNoMin}
        revenueNoMax={revenueNoMax}
        setRevenueNoMax={setRevenueNoMax}
        priceNoMin={priceNoMin}
        setPriceNoMin={setPriceNoMin}
        priceNoMax={priceNoMax}
        setPriceNoMax={setPriceNoMax}
        weeksNoMin={weeksNoMin}
        setWeeksNoMin={setWeeksNoMin}
        weeksNoMax={weeksNoMax}
        setWeeksNoMax={setWeeksNoMax}
        availableTags={availableTags}
        tagClauses={tagClauses}
        setTagClauses={setTagClauses}
      />
    </div>
  );
}

export default App;
