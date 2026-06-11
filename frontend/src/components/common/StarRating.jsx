export default function StarRating({ rating, size = '1rem' }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#d1d5db', fontSize: size }}>
        ★
      </span>
    );
  }
  return <span className="rating" aria-label={`Rating: ${rating} out of 5`}>{stars}</span>;
}
