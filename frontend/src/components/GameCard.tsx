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

const formatNumber = (num: number, isCurrency: boolean = false) => {
  if (num < 1000) {
    return isCurrency ? num.toFixed(2) : parseFloat(num.toFixed(2)).toString();
  }
  if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
};

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
            {formatNumber(game.review_count_1year || 0)} ({formatNumber(game.review_count || 0)} {game.review_impression || "No Reviews"})
          </span>
          <span className="badge price">${game.price ?? 0}</span>
          <span className="badge revenue">${formatNumber(game.revenue_1year || 0, true)} BRL</span>
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