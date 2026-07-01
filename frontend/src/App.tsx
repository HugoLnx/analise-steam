import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import GameCard, { type Game } from './components/GameCard';
import FilterSidebar from './components/FilterSidebar';
import type { TagClause } from './components/TagClauseFilter';

function App() {
  const [initialFilters] = useState(() => {
    try {
      const savedFilters = localStorage.getItem('filters');
      if (savedFilters) return JSON.parse(savedFilters);
    } catch (e) {
      console.error('Error parsing filters from localStorage', e);
    }
    return {};
  });

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // States for filters and pagination
  const [includeAnd, setIncludeAnd] = useState(initialFilters.includeAnd ?? '');
  const [includeOr, setIncludeOr] = useState(initialFilters.includeOr ?? '');
  const [excludeAnd, setExcludeAnd] = useState(initialFilters.excludeAnd ?? '');
  const [excludeOr, setExcludeOr] = useState(initialFilters.excludeOr ?? '');
  
  // Novos Filtros
  const [title, setTitle] = useState(initialFilters.title ?? '');
  const [onlyBr, setOnlyBr] = useState(initialFilters.onlyBr ?? false);
  const [reviewsMin, setReviewsMin] = useState(initialFilters.reviewsMin ?? '');
  const [reviewsMax, setReviewsMax] = useState(initialFilters.reviewsMax ?? '');
  const [revenueMin, setRevenueMin] = useState(initialFilters.revenueMin ?? '');
  const [revenueMax, setRevenueMax] = useState(initialFilters.revenueMax ?? '');
  const [priceMin, setPriceMin] = useState(initialFilters.priceMin ?? '');
  const [priceMax, setPriceMax] = useState(initialFilters.priceMax ?? '');
  const [weeksMin, setWeeksMin] = useState(initialFilters.weeksMin ?? '');
  const [weeksMax, setWeeksMax] = useState(initialFilters.weeksMax ?? '');

  // No Min/Max states
  const [revNoMin, setRevNoMin] = useState(initialFilters.revNoMin ?? true);
  const [revNoMax, setRevNoMax] = useState(initialFilters.revNoMax ?? true);
  const [revenueNoMin, setRevenueNoMin] = useState(initialFilters.revenueNoMin ?? true);
  const [revenueNoMax, setRevenueNoMax] = useState(initialFilters.revenueNoMax ?? true);
  const [priceNoMin, setPriceNoMin] = useState(initialFilters.priceNoMin ?? true);
  const [priceNoMax, setPriceNoMax] = useState(initialFilters.priceNoMax ?? true);
  const [weeksNoMin, setWeeksNoMin] = useState(initialFilters.weeksNoMin ?? true);
  const [weeksNoMax, setWeeksNoMax] = useState(initialFilters.weeksNoMax ?? true);

  // Novos estados para TagClauseFilter
  const [tagClauses, setTagClauses] = useState<TagClause[]>(initialFilters.tagClauses ?? []);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState(initialFilters.sortBy ?? 'revenue');
  const [currentPage, setCurrentPage] = useState(initialFilters.currentPage ?? 1);
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



  // Save to localStorage when states change
  useEffect(() => {
    const filters = {
      includeAnd, includeOr, excludeAnd, excludeOr,
      title, onlyBr,
      reviewsMin, reviewsMax, revenueMin, revenueMax, priceMin, priceMax, weeksMin, weeksMax,
      revNoMin, revNoMax, revenueNoMin, revenueNoMax, priceNoMin, priceNoMax, weeksNoMin, weeksNoMax,
      tagClauses, sortBy, currentPage
    };
    localStorage.setItem('filters', JSON.stringify(filters));
  }, [
    includeAnd, includeOr, excludeAnd, excludeOr,
    title, onlyBr,
    reviewsMin, reviewsMax, revenueMin, revenueMax, priceMin, priceMax, weeksMin, weeksMax,
    revNoMin, revNoMax, revenueNoMin, revenueNoMax, priceNoMin, priceNoMax, weeksNoMin, weeksNoMax,
    tagClauses, sortBy, currentPage
  ]);

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
          revenue_min: revenueNoMin ? '' : (Number(revenueMin) * 1000).toString(),
          revenue_max: revenueNoMax ? '' : (Number(revenueMax) * 1000).toString(),
          price_min: priceNoMin ? '' : (Number(priceMin) - 0.2).toString(),
          price_max: priceNoMax ? '' : (Number(priceMax) + 0.4).toString(),
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
      fetchGames(currentPage);
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
      setCurrentPage((prev: number) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev: number) => prev - 1);
    }
  };

  const handleAppReset = () => {
    setCurrentPage(1);
    setSortBy('revenue');
    localStorage.removeItem('filters');
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
        onReset={handleAppReset}
      />
    </div>
  );
}

export default App;
