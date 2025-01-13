import SkeletonCard from './SkeletonCard';

const SkeletonList = () => {
  return (
    <ul className="flex flex-col justify-center items-center gap-6">
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i}>
          <SkeletonCard />
        </li>
      ))}
    </ul>
  );
};

export default SkeletonList;
