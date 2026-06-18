export interface Game {
  appid: number;
  name: string;
  price: number;
  release_date: string;
  review_count: number;
  revenue_1year: number;
  tags: string[];
  screenshot_urls: string[];
  capsule_url: string;
  review_count_1year: number;
  review_impression: string;
}

const GameCard = ({ game }: { game: Game }) => {
  const steamUrl = `https://store.steampowered.com/app/${game.appid}`;
  const steamDbUrl = `https://steamdb.info/app/${game.appid}`;

  const releaseDate = new Date(game.release_date);
  const diffTime = Math.abs(new Date().getTime() - releaseDate.getTime());
  const diffYears = (diffTime / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);

  return (
    <div className="game-card">
      <div className="screenshots-grid">
        {(game.screenshot_urls || []).slice(0, 4).map((ss, i) => (
          <img key={i} src={ss} alt={`${game.name} screenshot ${i + 1}`} />
        ))}
      </div>
      <div className="game-info">
        <h2 className="game-name">{game.name}</h2>
        <div className="badges-row">
          <span className="badge rating">
            {/* TODO: #28 - Criar uma função utilitária ou helper de formatação amigável (pretty format) */}
            {/* TODO: #28 - Se review_count for maior que 1000, exibir como '1.2k', se maior que 1000000, exibir como '1.2M' */}
            {(game.review_count_1year || 0).toFixed(1)} ({game.review_count || 0} {game.review_impression || "No Reviews"})
          </span>
          <span className="badge price">${game.price ?? 0}</span>
          {/* TODO: #28 - Formatar o valor da receita com separador de milhar adequado dependendo do padrão visual da moeda */}
          <span className="badge revenue">${((game.revenue_1year || 0) / 1000000).toFixed(2)}M BRL</span>
          <span className="badge age">{diffYears} years</span>
        </div>
        <div className="header-image-container">
           <img className="header-image" src={game.capsule_url} alt={game.name} />
        </div>
        <div className="tags-container">
          {game.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="actions-row">
          <a href={steamUrl} target="_blank" rel="noreferrer" className="btn-steam">Steam Store</a>
          <a href={steamDbUrl} target="_blank" rel="noreferrer" className="btn-steamdb">SteamDB</a>
        </div>
      </div>
    </div>
  );
};
export default GameCard;